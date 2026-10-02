<?php
/**
 * System users API — super_admin only (users.* / roles.manage).
 * users ≠ members; optional member_id association.
 */
ob_start();
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../config/auth.php';
require_once __DIR__ . '/../../config/rbac.php';

corsHeaders();
ob_clean();

const USER_UUID = '/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i';

function usersResponse(array $payload, int $status = 200): void {
    http_response_code($status);
    echo json_encode($payload);
    exit;
}

function usersInput(): array {
    $data = json_decode(file_get_contents('php://input'), true);
    if (!is_array($data)) {
        usersResponse(['success' => false, 'message' => 'A JSON body is required.'], 400);
    }
    return $data;
}

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

try {
    $pdo = localPdo();

    switch ($method) {
        case 'GET':
            requirePermission('users.view');
            $rows = $pdo->query(
                'SELECT u.id, u.email, u.role_id, u.member_id, u.is_active, u.created_at,
                        r.code AS role_code, r.label AS role_label,
                        m.full_name AS member_name
                 FROM users u
                 LEFT JOIN roles r ON r.id = u.role_id
                 LEFT JOIN members m ON m.id = u.member_id
                 ORDER BY u.created_at DESC, u.email ASC'
            )->fetchAll();
            usersResponse(['success' => true, 'data' => $rows]);

        case 'POST':
            requirePermission('users.create');
            $data = usersInput();
            $email = isset($data['email']) && is_string($data['email']) ? trim($data['email']) : '';
            if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                usersResponse(['success' => false, 'message' => 'A valid email is required.'], 400);
            }
            $roleCode = isset($data['role']) && is_string($data['role']) ? trim($data['role']) : '';
            $roleStmt = $pdo->prepare('SELECT id FROM roles WHERE code = :code LIMIT 1');
            $roleStmt->execute(['code' => $roleCode]);
            $roleId = $roleStmt->fetchColumn();
            if ($roleId === false) {
                usersResponse(['success' => false, 'message' => 'A valid role is required.'], 400);
            }

            $memberId = null;
            if (!empty($data['member_id'])) {
                if (!is_string($data['member_id']) || !preg_match(USER_UUID, $data['member_id'])) {
                    usersResponse(['success' => false, 'message' => 'Invalid member_id.'], 400);
                }
                $m = $pdo->prepare('SELECT id FROM members WHERE id = :id LIMIT 1');
                $m->execute(['id' => $data['member_id']]);
                if ($m->fetchColumn() === false) {
                    usersResponse(['success' => false, 'message' => 'Member not found.'], 404);
                }
                $memberId = $data['member_id'];
            }

            $dup = $pdo->prepare('SELECT id FROM users WHERE email = :email LIMIT 1');
            $dup->execute(['email' => $email]);
            if ($dup->fetchColumn() !== false) {
                usersResponse(['success' => false, 'message' => 'Email already registered.'], 409);
            }

            $pdo->beginTransaction();
            $before = $pdo->query('SELECT id FROM users')->fetchAll(PDO::FETCH_COLUMN);
            $known = array_fill_keys($before, true);
            $ins = $pdo->prepare(
                'INSERT INTO users (email, role_id, member_id, is_active) VALUES (:email, :role_id, :member_id, 1)'
            );
            $ins->execute([
                'email' => $email,
                'role_id' => $roleId,
                'member_id' => $memberId,
            ]);
            $rows = $pdo->query(
                'SELECT u.id, u.email, u.role_id, u.member_id, u.is_active, u.created_at,
                        r.code AS role_code, r.label AS role_label
                 FROM users u LEFT JOIN roles r ON r.id = u.role_id'
            )->fetchAll();
            $created = array_values(array_filter($rows, static fn(array $r): bool => !isset($known[$r['id']])));
            if (count($created) !== 1) {
                $pdo->rollBack();
                usersResponse(['success' => false, 'message' => 'User was not created safely.'], 500);
            }
            $pdo->commit();
            usersResponse(['success' => true, 'message' => 'User created.', 'data' => $created[0]], 201);

        case 'PUT':
            requirePermission('users.update');
            $data = usersInput();
            $id = $data['id'] ?? null;
            if (!is_string($id) || !preg_match(USER_UUID, $id)) {
                usersResponse(['success' => false, 'message' => 'A valid user id is required.'], 400);
            }

            $exists = $pdo->prepare('SELECT id, email FROM users WHERE id = :id LIMIT 1');
            $exists->execute(['id' => $id]);
            $existing = $exists->fetch();
            if ($existing === false) {
                usersResponse(['success' => false, 'message' => 'User not found.'], 404);
            }

            $fields = [];
            $params = ['id' => $id];

            if (array_key_exists('role', $data)) {
                requirePermission('roles.manage');
                $roleCode = is_string($data['role']) ? trim($data['role']) : '';
                $roleStmt = $pdo->prepare('SELECT id FROM roles WHERE code = :code LIMIT 1');
                $roleStmt->execute(['code' => $roleCode]);
                $roleId = $roleStmt->fetchColumn();
                if ($roleId === false) {
                    usersResponse(['success' => false, 'message' => 'A valid role is required.'], 400);
                }
                $fields[] = 'role_id = :role_id';
                $params['role_id'] = $roleId;
            }

            if (array_key_exists('is_active', $data)) {
                $fields[] = 'is_active = :is_active';
                $params['is_active'] = ((int) $data['is_active']) === 1 ? 1 : 0;
                // Prevent self-deactivation
                $ctx = currentUserContext();
                if ($ctx['id'] === $id && (int) $params['is_active'] !== 1) {
                    usersResponse(['success' => false, 'message' => 'You cannot deactivate your own account.'], 409);
                }
            }

            if (array_key_exists('member_id', $data)) {
                $memberId = $data['member_id'];
                if ($memberId === null || $memberId === '') {
                    $fields[] = 'member_id = NULL';
                } else {
                    if (!is_string($memberId) || !preg_match(USER_UUID, $memberId)) {
                        usersResponse(['success' => false, 'message' => 'Invalid member_id.'], 400);
                    }
                    $m = $pdo->prepare('SELECT id FROM members WHERE id = :id LIMIT 1');
                    $m->execute(['id' => $memberId]);
                    if ($m->fetchColumn() === false) {
                        usersResponse(['success' => false, 'message' => 'Member not found.'], 404);
                    }
                    $fields[] = 'member_id = :member_id';
                    $params['member_id'] = $memberId;
                }
            }

            if ($fields === []) {
                usersResponse(['success' => false, 'message' => 'No changes provided.'], 400);
            }

            $pdo->prepare('UPDATE users SET ' . implode(', ', $fields) . ' WHERE id = :id')->execute($params);

            $row = $pdo->prepare(
                'SELECT u.id, u.email, u.role_id, u.member_id, u.is_active, u.created_at,
                        r.code AS role_code, r.label AS role_label
                 FROM users u LEFT JOIN roles r ON r.id = u.role_id
                 WHERE u.id = :id LIMIT 1'
            );
            $row->execute(['id' => $id]);
            usersResponse(['success' => true, 'message' => 'User updated.', 'data' => $row->fetch()]);

        case 'DELETE':
            requirePermission('users.delete');
            $data = usersInput();
            $id = $data['id'] ?? null;
            if (!is_string($id) || !preg_match(USER_UUID, $id)) {
                usersResponse(['success' => false, 'message' => 'A valid user id is required.'], 400);
            }
            $ctx = currentUserContext();
            if ($ctx['id'] === $id) {
                usersResponse(['success' => false, 'message' => 'You cannot delete your own account.'], 409);
            }

            // Protect the known development/admin account
            $row = $pdo->prepare('SELECT email FROM users WHERE id = :id LIMIT 1');
            $row->execute(['id' => $id]);
            $email = $row->fetchColumn();
            if ($email === false) {
                usersResponse(['success' => false, 'message' => 'User not found.'], 404);
            }
            if (!str_ends_with(strtolower((string) $email), '@example.test')
                && strcasecmp((string) $email, 'caranyagan.johnpaul.bueno@gmail.com') === 0) {
                usersResponse(['success' => false, 'message' => 'This account cannot be deleted.'], 409);
            }

            $del = $pdo->prepare('DELETE FROM users WHERE id = :id');
            $del->execute(['id' => $id]);
            if ($del->rowCount() !== 1) {
                usersResponse(['success' => false, 'message' => 'User could not be deleted.'], 500);
            }
            usersResponse(['success' => true, 'message' => 'User deleted.']);

        default:
            header('Allow: GET, POST, PUT, DELETE, OPTIONS');
            usersResponse(['success' => false, 'message' => 'Method not allowed.'], 405);
    }
} catch (Throwable $e) {
    if (isset($pdo) && $pdo instanceof PDO && $pdo->inTransaction()) {
        $pdo->rollBack();
    }
    error_log('Users API error: ' . $e->getMessage());
    usersResponse(['success' => false, 'message' => 'Unable to process user request.'], 500);
}
