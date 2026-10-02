<?php
/**
 * Assignments API — local MariaDB (committee_members).
 * Replaces previous Supabase-backed implementation.
 *
 * Contracts (preserved for current UI):
 *   GET    → JSON array of {id, committee_id, member_id, role, assigned_at}
 *   POST   → {member_id, committee_id, role?} → {success, message?, data?}
 *   PUT    → {id, role} → {success, message?, data?}  (role update)
 *   DELETE → {id} → {success, message?}
 *
 * Business rules (verified from prior API + schema):
 *   - Duplicate (committee_id, member_id) blocked (UNIQUE + app check)
 *   - Max 5 members per committee
 *   - Member and committee must exist locally
 *   - CHAR(36) UUID identifiers
 */
ob_start();
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../config/auth.php';
require_once __DIR__ . '/../../config/rbac.php';

corsHeaders();
ob_clean();

const ASSIGNMENT_SELECT = 'id, committee_id, member_id, role, assigned_at';
const ASSIGNMENT_UUID_PATTERN = '/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i';
const ASSIGNMENT_MAX_PER_COMMITTEE = 5;
const ASSIGNMENT_ALLOWED_ROLES = [
    'Member',
    'Chairperson',
    'Vice Chairperson',
    'Secretary',
    'Treasurer',
];

function assignmentResponse(array $payload, int $status = 200): void {
    http_response_code($status);
    echo json_encode($payload);
    exit;
}

function assignmentInput(): array {
    $data = json_decode(file_get_contents('php://input'), true);
    if (!is_array($data)) {
        assignmentResponse(['success' => false, 'message' => 'A JSON assignment record is required.'], 400);
    }
    return $data;
}

function assignmentUuid(mixed $value, string $label): string {
    if (!is_string($value) || !preg_match(ASSIGNMENT_UUID_PATTERN, $value)) {
        assignmentResponse(['success' => false, 'message' => 'A valid ' . $label . ' is required.'], 400);
    }
    return $value;
}

function assignmentRole(mixed $value, bool $required = false): string {
    if ($value === null || $value === '') {
        if ($required) {
            assignmentResponse(['success' => false, 'message' => 'Role is required.'], 400);
        }
        return 'Member';
    }
    if (!is_string($value)) {
        assignmentResponse(['success' => false, 'message' => 'Invalid role.'], 400);
    }
    $role = trim($value);
    if (!in_array($role, ASSIGNMENT_ALLOWED_ROLES, true)) {
        assignmentResponse([
            'success' => false,
            'message' => 'Role must be one of: ' . implode(', ', ASSIGNMENT_ALLOWED_ROLES) . '.',
        ], 400);
    }
    return $role;
}

function assignmentExists(PDO $pdo, string $table, string $id): bool {
    $statement = $pdo->prepare("SELECT 1 FROM {$table} WHERE id = :id LIMIT 1");
    $statement->execute(['id' => $id]);
    return (bool) $statement->fetchColumn();
}

function assignmentRecord(PDO $pdo, string $id): ?array {
    $statement = $pdo->prepare('SELECT ' . ASSIGNMENT_SELECT . ' FROM committee_members WHERE id = :id LIMIT 1');
    $statement->execute(['id' => $id]);
    $row = $statement->fetch();
    return $row === false ? null : $row;
}

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

try {
    $pdo = localPdo();

    switch ($method) {
        case 'GET':
            requirePermission('assignments.view');
            $statement = $pdo->query(
                'SELECT ' . ASSIGNMENT_SELECT . ' FROM committee_members ORDER BY assigned_at DESC, id DESC'
            );
            $rows = $statement->fetchAll();
            $ctx = currentUserContext();
            if ($ctx['role_code'] === 'sk_member') {
                $ownId = $ctx['member_id'];
                $rows = $ownId === null
                    ? []
                    : array_values(array_filter(
                        $rows,
                        static fn(array $row): bool => ($row['member_id'] ?? null) === $ownId
                    ));
            } elseif ($ctx['role_code'] === 'committee_chairperson') {
                $chairIds = $ctx['chair_committee_ids'];
                $rows = array_values(array_filter(
                    $rows,
                    static fn(array $row): bool => in_array($row['committee_id'] ?? '', $chairIds, true)
                ));
            }
            echo json_encode($rows);
            exit;

        case 'POST':
            requirePermission('assignments.create');
            $data = assignmentInput();
            $committeeId = assignmentUuid($data['committee_id'] ?? null, 'committee ID');
            $memberId = assignmentUuid($data['member_id'] ?? null, 'member ID');
            $role = assignmentRole($data['role'] ?? null);
            rbacAssertCommitteeAccess($committeeId);

            if (!assignmentExists($pdo, 'committees', $committeeId)) {
                assignmentResponse(['success' => false, 'message' => 'Committee not found.'], 404);
            }
            if (!assignmentExists($pdo, 'members', $memberId)) {
                assignmentResponse(['success' => false, 'message' => 'Member not found.'], 404);
            }

            $duplicate = $pdo->prepare(
                'SELECT id FROM committee_members WHERE committee_id = :committee_id AND member_id = :member_id LIMIT 1'
            );
            $duplicate->execute(['committee_id' => $committeeId, 'member_id' => $memberId]);
            if ($duplicate->fetchColumn() !== false) {
                assignmentResponse([
                    'success' => false,
                    'message' => 'Member already assigned to this committee.',
                ], 409);
            }

            $countStmt = $pdo->prepare(
                'SELECT COUNT(*) FROM committee_members WHERE committee_id = :committee_id'
            );
            $countStmt->execute(['committee_id' => $committeeId]);
            $currentCount = (int) $countStmt->fetchColumn();
            if ($currentCount >= ASSIGNMENT_MAX_PER_COMMITTEE) {
                assignmentResponse([
                    'success' => false,
                    'message' => 'Committee already has the maximum of ' . ASSIGNMENT_MAX_PER_COMMITTEE . ' members.',
                ], 409);
            }

            $pdo->beginTransaction();
            $before = $pdo->query('SELECT id FROM committee_members')->fetchAll(PDO::FETCH_COLUMN);
            $knownIds = array_fill_keys($before, true);

            $insert = $pdo->prepare(
                'INSERT INTO committee_members (committee_id, member_id, role)
                 VALUES (:committee_id, :member_id, :role)'
            );
            $insert->execute([
                'committee_id' => $committeeId,
                'member_id' => $memberId,
                'role' => $role,
            ]);

            $createdRows = $pdo->query('SELECT ' . ASSIGNMENT_SELECT . ' FROM committee_members')->fetchAll();
            $created = array_values(array_filter(
                $createdRows,
                static fn(array $row): bool => !isset($knownIds[$row['id']])
            ));
            if (count($created) !== 1) {
                $pdo->rollBack();
                assignmentResponse(['success' => false, 'message' => 'Assignment was not created safely. Please try again.'], 500);
            }

            $pdo->commit();
            assignmentResponse([
                'success' => true,
                'message' => 'Member assigned successfully.',
                'data' => $created[0],
            ], 201);

        case 'PUT':
            requirePermission('assignments.update');
            $data = assignmentInput();
            $id = assignmentUuid($data['id'] ?? null, 'assignment ID');
            $role = assignmentRole($data['role'] ?? null, true);

            $existing = assignmentRecord($pdo, $id);
            if ($existing === null) {
                assignmentResponse(['success' => false, 'message' => 'Assignment not found.'], 404);
            }
            rbacAssertCommitteeAccess($existing['committee_id'] ?? null);

            $update = $pdo->prepare('UPDATE committee_members SET role = :role WHERE id = :id');
            $update->execute(['role' => $role, 'id' => $id]);

            $record = assignmentRecord($pdo, $id);
            assignmentResponse([
                'success' => true,
                'message' => $update->rowCount() === 0 ? 'No assignment changes were needed.' : 'Assignment updated successfully.',
                'data' => $record,
            ]);

        case 'DELETE':
            requirePermission('assignments.delete');
            $data = assignmentInput();
            $id = assignmentUuid($data['id'] ?? null, 'assignment ID');

            $existing = assignmentRecord($pdo, $id);
            if ($existing === null) {
                assignmentResponse(['success' => false, 'message' => 'Assignment not found.'], 404);
            }
            rbacAssertCommitteeAccess($existing['committee_id'] ?? null);

            $delete = $pdo->prepare('DELETE FROM committee_members WHERE id = :id');
            $delete->execute(['id' => $id]);
            if ($delete->rowCount() !== 1) {
                assignmentResponse(['success' => false, 'message' => 'Assignment could not be removed.'], 500);
            }

            assignmentResponse(['success' => true, 'message' => 'Assignment removed successfully.']);

        default:
            header('Allow: GET, POST, PUT, DELETE, OPTIONS');
            assignmentResponse(['success' => false, 'message' => 'Method not allowed.'], 405);
    }
} catch (PDOException $exception) {
    if (isset($pdo) && $pdo instanceof PDO && $pdo->inTransaction()) {
        $pdo->rollBack();
    }

    // Unique constraint race: treat as duplicate.
    if ((int) $exception->getCode() === 23000) {
        assignmentResponse([
            'success' => false,
            'message' => 'Member already assigned to this committee.',
        ], 409);
    }

    error_log('Assignments API error: ' . $exception->getMessage());
    assignmentResponse(['success' => false, 'message' => 'Unable to process assignment request.'], 500);
} catch (Throwable $exception) {
    if (isset($pdo) && $pdo instanceof PDO && $pdo->inTransaction()) {
        $pdo->rollBack();
    }
    error_log('Assignments API error: ' . $exception->getMessage());
    assignmentResponse(['success' => false, 'message' => 'Unable to process assignment request.'], 500);
}
