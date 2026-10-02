<?php
/**
 * RBAC helpers — builds on existing OTP session auth.
 * users ≠ members; optional users.member_id association for scoped roles.
 */
require_once __DIR__ . '/database.php';
require_once __DIR__ . '/auth.php';

const RBAC_CHAIR_ROLE_NAME = 'Chairperson';

/** @var array<string,mixed>|null */
$GLOBALS['_rbac_user_ctx'] = null;

function rbacForbidden(string $message = 'Forbidden'): void {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => $message, 'error' => 'FORBIDDEN']);
    exit;
}

function rbacUnauthorized(string $message = 'Authentication required'): void {
    http_response_code(401);
    echo json_encode(['authenticated' => false, 'success' => false, 'message' => $message]);
    exit;
}

/**
 * Load authenticated user + role + permissions from DB (cached per request).
 *
 * @param bool $refresh
 * @param bool $soft When true, return null instead of exiting on failure (for HTML pages).
 * @return array<string,mixed>|null
 */
function currentUserContext(bool $refresh = false, bool $soft = false): ?array {
    if (!$refresh && is_array($GLOBALS['_rbac_user_ctx'] ?? null)) {
        return $GLOBALS['_rbac_user_ctx'];
    }

    startAppSession();
    if (empty($_SESSION['email'])) {
        if ($soft) {
            return null;
        }
        rbacUnauthorized();
    }

    $pdo = localPdo();
    $stmt = $pdo->prepare(
        'SELECT u.id, u.email, u.role_id, u.member_id, u.is_active,
                r.code AS role_code, r.label AS role_label
         FROM users u
         LEFT JOIN roles r ON r.id = u.role_id
         WHERE u.email = :email
         LIMIT 1'
    );
    $stmt->execute(['email' => $_SESSION['email']]);
    $user = $stmt->fetch();

    if ($user === false) {
        if ($soft) {
            return null;
        }
        rbacUnauthorized('User account not found');
    }
    if ((int) ($user['is_active'] ?? 0) !== 1) {
        if ($soft) {
            return null;
        }
        rbacForbidden('Account is inactive');
    }
    if (empty($user['role_id']) || empty($user['role_code'])) {
        if ($soft) {
            return null;
        }
        rbacForbidden('No role assigned to this account');
    }

    $_SESSION['user_id'] = $user['id'];
    $_SESSION['role_code'] = $user['role_code'];

    $permStmt = $pdo->prepare(
        'SELECT p.code
         FROM role_permissions rp
         INNER JOIN permissions p ON p.id = rp.permission_id
         WHERE rp.role_id = :role_id
         ORDER BY p.code ASC'
    );
    $permStmt->execute(['role_id' => $user['role_id']]);
    $permissions = $permStmt->fetchAll(PDO::FETCH_COLUMN) ?: [];

    $chairIds = [];
    $assignedIds = [];
    $memberId = $user['member_id'] ?? null;
    if (is_string($memberId) && $memberId !== '') {
        $aStmt = $pdo->prepare(
            'SELECT committee_id, role FROM committee_members WHERE member_id = :mid'
        );
        $aStmt->execute(['mid' => $memberId]);
        foreach ($aStmt->fetchAll() as $row) {
            $assignedIds[] = $row['committee_id'];
            if (strcasecmp((string) $row['role'], RBAC_CHAIR_ROLE_NAME) === 0) {
                $chairIds[] = $row['committee_id'];
            }
        }
    }

    $ctx = [
        'id' => (string) $user['id'],
        'email' => (string) $user['email'],
        'role_id' => (string) $user['role_id'],
        'role_code' => (string) $user['role_code'],
        'role_label' => (string) ($user['role_label'] ?? $user['role_code']),
        'member_id' => is_string($memberId) && $memberId !== '' ? $memberId : null,
        'is_active' => true,
        'permissions' => array_values(array_map('strval', $permissions)),
        'chair_committee_ids' => array_values(array_unique($chairIds)),
        'assigned_committee_ids' => array_values(array_unique($assignedIds)),
    ];

    $GLOBALS['_rbac_user_ctx'] = $ctx;
    return $ctx;
}

function userHasPermission(string $permissionCode): bool {
    $ctx = currentUserContext();
    if ($ctx['role_code'] === 'super_admin') {
        return true;
    }
    return in_array($permissionCode, $ctx['permissions'], true);
}

function requirePermission(string $permissionCode): array {
    requireAuthenticatedApi();
    $ctx = currentUserContext();
    if (!userHasPermission($permissionCode)) {
        rbacForbidden('Missing permission: ' . $permissionCode);
    }
    return $ctx;
}

function requireAnyPermission(array $permissionCodes): array {
    requireAuthenticatedApi();
    $ctx = currentUserContext();
    foreach ($permissionCodes as $code) {
        if (is_string($code) && userHasPermission($code)) {
            return $ctx;
        }
    }
    rbacForbidden('Missing required permission');
}

function rbacIsGlobalRole(?string $roleCode = null): bool {
    $code = $roleCode ?? currentUserContext()['role_code'];
    return in_array($code, ['super_admin', 'sk_chairperson', 'secretary', 'treasurer'], true);
}

function rbacIsScopedRole(?string $roleCode = null): bool {
    $code = $roleCode ?? currentUserContext()['role_code'];
    return in_array($code, ['committee_chairperson', 'sk_member'], true);
}

/** Committee IDs the user may access for scoped resources. */
function rbacAccessibleCommitteeIds(): ?array {
    $ctx = currentUserContext();
    if (rbacIsGlobalRole($ctx['role_code'])) {
        return null; // null = unrestricted
    }
    if ($ctx['role_code'] === 'committee_chairperson') {
        return $ctx['chair_committee_ids'];
    }
    if ($ctx['role_code'] === 'sk_member') {
        return $ctx['assigned_committee_ids'];
    }
    return [];
}

function rbacCanAccessCommittee(?string $committeeId): bool {
    if ($committeeId === null || $committeeId === '') {
        // System-wide / unscoped records: global roles only
        return rbacIsGlobalRole();
    }
    $allowed = rbacAccessibleCommitteeIds();
    if ($allowed === null) {
        return true;
    }
    return in_array($committeeId, $allowed, true);
}

function rbacCanAccessMember(?string $memberId): bool {
    $ctx = currentUserContext();
    if (rbacIsGlobalRole($ctx['role_code'])) {
        return true;
    }
    if ($ctx['role_code'] === 'committee_chairperson') {
        if ($memberId === null || $memberId === '') {
            return false;
        }
        // Chair may see members assigned to their committees
        $pdo = localPdo();
        $ids = $ctx['chair_committee_ids'];
        if ($ids === []) {
            return false;
        }
        $ph = implode(',', array_fill(0, count($ids), '?'));
        $stmt = $pdo->prepare(
            "SELECT 1 FROM committee_members
             WHERE member_id = ? AND committee_id IN ({$ph})
             LIMIT 1"
        );
        $stmt->execute(array_merge([$memberId], $ids));
        return (bool) $stmt->fetchColumn();
    }
    if ($ctx['role_code'] === 'sk_member') {
        return $ctx['member_id'] !== null && $ctx['member_id'] === $memberId;
    }
    return false;
}

function rbacOwnMemberId(): ?string {
    return currentUserContext()['member_id'];
}

/**
 * Filter a list of associative rows by committee_id / member_id scope.
 *
 * @param array<int,array<string,mixed>> $rows
 * @return array<int,array<string,mixed>>
 */
function rbacFilterRows(array $rows, string $committeeKey = 'committee_id', string $memberKey = 'member_id'): array {
    $ctx = currentUserContext();
    if (rbacIsGlobalRole($ctx['role_code'])) {
        return $rows;
    }

    $out = [];
    foreach ($rows as $row) {
        $cid = isset($row[$committeeKey]) && $row[$committeeKey] !== null ? (string) $row[$committeeKey] : null;
        $mid = isset($row[$memberKey]) && $row[$memberKey] !== null ? (string) $row[$memberKey] : null;

        if ($ctx['role_code'] === 'sk_member') {
            if ($mid !== null && $mid === $ctx['member_id']) {
                $out[] = $row;
                continue;
            }
            // assignments/tasks may only expose own member_id
            if ($mid === null && $cid !== null && rbacCanAccessCommittee($cid)) {
                // reports without member_id but committee in assignment
                $out[] = $row;
            }
            continue;
        }

        if ($ctx['role_code'] === 'committee_chairperson') {
            if ($cid !== null && rbacCanAccessCommittee($cid)) {
                $out[] = $row;
                continue;
            }
            if ($cid === null && $mid !== null && rbacCanAccessMember($mid)) {
                $out[] = $row;
            }
        }
    }
    return array_values($out);
}

function rbacAssertCommitteeAccess(?string $committeeId): void {
    if (!rbacCanAccessCommittee($committeeId)) {
        rbacForbidden('You do not have access to this committee resource.');
    }
}

function rbacAssertMemberAccess(?string $memberId): void {
    if (!rbacCanAccessMember($memberId)) {
        rbacForbidden('You do not have access to this member resource.');
    }
}

/**
 * Session payload for frontend RBAC (no secrets).
 */
function rbacSessionPayload(): array {
    $ctx = currentUserContext();
    return [
        'authenticated' => true,
        'user' => [
            'id' => $ctx['id'],
            'email' => $ctx['email'],
            'role' => $ctx['role_code'],
            'role_label' => $ctx['role_label'],
            'member_id' => $ctx['member_id'],
            'permissions' => $ctx['permissions'],
            'chair_committee_ids' => $ctx['chair_committee_ids'],
            'assigned_committee_ids' => $ctx['assigned_committee_ids'],
        ],
    ];
}
