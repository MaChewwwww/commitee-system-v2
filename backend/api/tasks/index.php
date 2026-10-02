<?php
/**
 * Tasks API — local MariaDB/PDO
 */
ob_start();
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../config/auth.php';
require_once __DIR__ . '/../../config/rbac.php';

corsHeaders();
ob_clean();

const TASK_SELECT = 'id, committee_id, member_id, title, description, status, due_date, created_at, updated_at';
const TASK_UUID = '/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i';
const TASK_STATUSES = ['pending', 'completed'];

function taskResponse(array $payload, int $status = 200): void {
    http_response_code($status);
    echo json_encode($payload);
    exit;
}

function taskInput(): array {
    $data = json_decode(file_get_contents('php://input'), true);
    if (!is_array($data)) {
        taskResponse(['success' => false, 'message' => 'A JSON task record is required.'], 400);
    }
    return $data;
}

function taskUuid(?string $value, string $label, bool $allowNull = false): ?string {
    if ($value === null || $value === '') {
        if ($allowNull) {
            return null;
        }
        taskResponse(['success' => false, 'message' => 'A valid ' . $label . ' is required.'], 400);
    }
    if (!is_string($value) || !preg_match(TASK_UUID, $value)) {
        taskResponse(['success' => false, 'message' => 'A valid ' . $label . ' is required.'], 400);
    }
    return $value;
}

function taskExists(PDO $pdo, string $table, string $id): bool {
    $stmt = $pdo->prepare("SELECT 1 FROM {$table} WHERE id = :id LIMIT 1");
    $stmt->execute(['id' => $id]);
    return (bool) $stmt->fetchColumn();
}

function taskRecord(PDO $pdo, string $id): ?array {
    $stmt = $pdo->prepare('SELECT ' . TASK_SELECT . ' FROM tasks WHERE id = :id LIMIT 1');
    $stmt->execute(['id' => $id]);
    $row = $stmt->fetch();
    return $row === false ? null : $row;
}

function taskAssertScope(array $task): void {
    $ctx = currentUserContext();
    if ($ctx['role_code'] === 'sk_member') {
        rbacAssertMemberAccess(isset($task['member_id']) ? (string) $task['member_id'] : null);
        return;
    }
    rbacAssertCommitteeAccess(isset($task['committee_id']) ? (string) $task['committee_id'] : null);
}

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

try {
    $pdo = localPdo();

    switch ($method) {
        case 'GET':
            requirePermission('tasks.view');
            $stmt = $pdo->query('SELECT ' . TASK_SELECT . ' FROM tasks ORDER BY created_at DESC, id DESC');
            $rows = $stmt->fetchAll();
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
            requirePermission('tasks.create');
            $data = taskInput();
            $title = isset($data['title']) && is_string($data['title']) ? trim($data['title']) : '';
            if ($title === '') {
                taskResponse(['success' => false, 'message' => 'Title is required.'], 400);
            }
            if (mb_strlen($title) > 255) {
                taskResponse(['success' => false, 'message' => 'Title is too long.'], 400);
            }

            $committeeId = taskUuid(
                isset($data['committee_id']) && is_string($data['committee_id']) ? $data['committee_id'] : null,
                'committee ID',
                true
            );
            $memberId = taskUuid(
                isset($data['member_id']) && is_string($data['member_id']) ? $data['member_id'] : null,
                'member ID',
                true
            );
            rbacAssertCommitteeAccess($committeeId);

            if ($committeeId !== null && !taskExists($pdo, 'committees', $committeeId)) {
                taskResponse(['success' => false, 'message' => 'Committee not found.'], 404);
            }
            if ($memberId !== null && !taskExists($pdo, 'members', $memberId)) {
                taskResponse(['success' => false, 'message' => 'Member not found.'], 404);
            }

            $status = $data['status'] ?? 'pending';
            if (!is_string($status) || !in_array($status, TASK_STATUSES, true)) {
                taskResponse(['success' => false, 'message' => 'Status must be pending or completed.'], 400);
            }

            $description = null;
            if (isset($data['description']) && is_string($data['description']) && trim($data['description']) !== '') {
                $description = trim($data['description']);
            }

            $dueDate = null;
            if (isset($data['due_date']) && is_string($data['due_date']) && trim($data['due_date']) !== '') {
                $dueDate = trim($data['due_date']);
                if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $dueDate)) {
                    taskResponse(['success' => false, 'message' => 'Due date must be YYYY-MM-DD.'], 400);
                }
            }

            // Existing UI rule: max 5 pending tasks per member
            if ($memberId !== null && $status === 'pending') {
                $countStmt = $pdo->prepare(
                    "SELECT COUNT(*) FROM tasks WHERE member_id = :member_id AND status = 'pending'"
                );
                $countStmt->execute(['member_id' => $memberId]);
                if ((int) $countStmt->fetchColumn() >= 5) {
                    taskResponse([
                        'success' => false,
                        'message' => 'This member already has 5 pending tasks (maximum).',
                    ], 409);
                }
            }

            $pdo->beginTransaction();
            $before = $pdo->query('SELECT id FROM tasks')->fetchAll(PDO::FETCH_COLUMN);
            $known = array_fill_keys($before, true);
            $insert = $pdo->prepare(
                'INSERT INTO tasks (committee_id, member_id, title, description, status, due_date)
                 VALUES (:committee_id, :member_id, :title, :description, :status, :due_date)'
            );
            $insert->execute([
                'committee_id' => $committeeId,
                'member_id' => $memberId,
                'title' => $title,
                'description' => $description,
                'status' => $status,
                'due_date' => $dueDate,
            ]);
            $rows = $pdo->query('SELECT ' . TASK_SELECT . ' FROM tasks')->fetchAll();
            $created = array_values(array_filter($rows, static fn(array $r): bool => !isset($known[$r['id']])));
            if (count($created) !== 1) {
                $pdo->rollBack();
                taskResponse(['success' => false, 'message' => 'Task was not created safely.'], 500);
            }
            $pdo->commit();
            taskResponse(['success' => true, 'message' => 'Task created successfully.', 'data' => $created[0]], 201);

        case 'PUT':
            requirePermission('tasks.update');
            $data = taskInput();
            $id = taskUuid($data['id'] ?? null, 'task ID');
            $existing = taskRecord($pdo, $id);
            if ($existing === null) {
                taskResponse(['success' => false, 'message' => 'Task not found.'], 404);
            }
            taskAssertScope($existing);

            $status = $data['status'] ?? $existing['status'];
            if (!is_string($status) || !in_array($status, TASK_STATUSES, true)) {
                taskResponse(['success' => false, 'message' => 'Status must be pending or completed.'], 400);
            }

            $title = array_key_exists('title', $data)
                ? (is_string($data['title']) ? trim($data['title']) : '')
                : $existing['title'];
            if ($title === '') {
                taskResponse(['success' => false, 'message' => 'Title is required.'], 400);
            }

            $description = array_key_exists('description', $data)
                ? (is_string($data['description']) && trim($data['description']) !== '' ? trim($data['description']) : null)
                : $existing['description'];

            $update = $pdo->prepare(
                'UPDATE tasks SET title = :title, description = :description, status = :status WHERE id = :id'
            );
            $update->execute([
                'title' => $title,
                'description' => $description,
                'status' => $status,
                'id' => $id,
            ]);
            taskResponse([
                'success' => true,
                'message' => 'Task updated successfully.',
                'data' => taskRecord($pdo, $id),
            ]);

        case 'DELETE':
            requirePermission('tasks.delete');
            $data = taskInput();
            $id = taskUuid($data['id'] ?? null, 'task ID');
            $existing = taskRecord($pdo, $id);
            if ($existing === null) {
                taskResponse(['success' => false, 'message' => 'Task not found.'], 404);
            }
            taskAssertScope($existing);
            $delete = $pdo->prepare('DELETE FROM tasks WHERE id = :id');
            $delete->execute(['id' => $id]);
            if ($delete->rowCount() !== 1) {
                taskResponse(['success' => false, 'message' => 'Task could not be deleted.'], 500);
            }
            taskResponse(['success' => true, 'message' => 'Task deleted successfully.']);

        default:
            header('Allow: GET, POST, PUT, DELETE, OPTIONS');
            taskResponse(['success' => false, 'message' => 'Method not allowed.'], 405);
    }
} catch (Throwable $e) {
    if (isset($pdo) && $pdo instanceof PDO && $pdo->inTransaction()) {
        $pdo->rollBack();
    }
    error_log('Tasks API error: ' . $e->getMessage());
    taskResponse(['success' => false, 'message' => 'Unable to process task request.'], 500);
}
