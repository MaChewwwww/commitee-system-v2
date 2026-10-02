<?php
/**
 * Performance API — local MariaDB/PDO
 * Persisted score field: performance_score (not final_score)
 */
ob_start();
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../config/auth.php';
require_once __DIR__ . '/../../config/rbac.php';

corsHeaders();
ob_clean();

const PERF_SELECT = 'id, member_id, committee_id, attendance_rate, task_completion_rate, performance_score, period, created_at';
const PERF_UUID = '/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i';

function perfResponse(array $payload, int $status = 200): void {
    http_response_code($status);
    echo json_encode($payload);
    exit;
}

function perfInput(): array {
    $data = json_decode(file_get_contents('php://input'), true);
    if (!is_array($data)) {
        perfResponse(['success' => false, 'message' => 'A JSON performance record is required.'], 400);
    }
    return $data;
}

function perfUuid(?string $value, string $label, bool $allowNull = false): ?string {
    if ($value === null || $value === '') {
        if ($allowNull) {
            return null;
        }
        perfResponse(['success' => false, 'message' => 'A valid ' . $label . ' is required.'], 400);
    }
    if (!preg_match(PERF_UUID, $value)) {
        perfResponse(['success' => false, 'message' => 'A valid ' . $label . ' is required.'], 400);
    }
    return $value;
}

function perfRate(mixed $value, string $label): float {
    if (!is_numeric($value)) {
        perfResponse(['success' => false, 'message' => $label . ' must be a number.'], 400);
    }
    $rate = (float) $value;
    if ($rate < 0 || $rate > 100) {
        perfResponse(['success' => false, 'message' => $label . ' must be between 0 and 100.'], 400);
    }
    return round($rate, 2);
}

function perfExists(PDO $pdo, string $table, string $id): bool {
    $stmt = $pdo->prepare("SELECT 1 FROM {$table} WHERE id = :id LIMIT 1");
    $stmt->execute(['id' => $id]);
    return (bool) $stmt->fetchColumn();
}

function perfRecord(PDO $pdo, string $id): ?array {
    $stmt = $pdo->prepare('SELECT ' . PERF_SELECT . ' FROM performance WHERE id = :id LIMIT 1');
    $stmt->execute(['id' => $id]);
    $row = $stmt->fetch();
    return $row === false ? null : $row;
}

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

try {
    $pdo = localPdo();

    switch ($method) {
        case 'GET':
            requirePermission('performance.view');
            $stmt = $pdo->query('SELECT ' . PERF_SELECT . ' FROM performance ORDER BY created_at DESC, id DESC');
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
            requirePermission('performance.create');
            $data = perfInput();
            $memberId = perfUuid(
                isset($data['member_id']) && is_string($data['member_id']) ? $data['member_id'] : null,
                'member ID'
            );
            $committeeId = perfUuid(
                isset($data['committee_id']) && is_string($data['committee_id']) ? $data['committee_id'] : null,
                'committee ID',
                true
            );
            rbacAssertCommitteeAccess($committeeId);

            if (!perfExists($pdo, 'members', $memberId)) {
                perfResponse(['success' => false, 'message' => 'Member not found.'], 404);
            }
            if ($committeeId !== null && !perfExists($pdo, 'committees', $committeeId)) {
                perfResponse(['success' => false, 'message' => 'Committee not found.'], 404);
            }

            $attendance = perfRate($data['attendance_rate'] ?? 0, 'Attendance rate');
            $taskCompletion = perfRate($data['task_completion_rate'] ?? 0, 'Task completion rate');
            $score = perfRate($data['performance_score'] ?? 0, 'Performance score');

            $period = null;
            if (isset($data['period']) && is_string($data['period']) && trim($data['period']) !== '') {
                $period = trim($data['period']);
                if (mb_strlen($period) > 50) {
                    perfResponse(['success' => false, 'message' => 'Period is too long.'], 400);
                }
            }

            $pdo->beginTransaction();
            $before = $pdo->query('SELECT id FROM performance')->fetchAll(PDO::FETCH_COLUMN);
            $known = array_fill_keys($before, true);
            $insert = $pdo->prepare(
                'INSERT INTO performance (member_id, committee_id, attendance_rate, task_completion_rate, performance_score, period)
                 VALUES (:member_id, :committee_id, :attendance_rate, :task_completion_rate, :performance_score, :period)'
            );
            $insert->execute([
                'member_id' => $memberId,
                'committee_id' => $committeeId,
                'attendance_rate' => $attendance,
                'task_completion_rate' => $taskCompletion,
                'performance_score' => $score,
                'period' => $period,
            ]);
            $rows = $pdo->query('SELECT ' . PERF_SELECT . ' FROM performance')->fetchAll();
            $created = array_values(array_filter($rows, static fn(array $r): bool => !isset($known[$r['id']])));
            if (count($created) !== 1) {
                $pdo->rollBack();
                perfResponse(['success' => false, 'message' => 'Performance record was not created safely.'], 500);
            }
            $pdo->commit();
            perfResponse(['success' => true, 'message' => 'Performance saved successfully.', 'data' => $created[0]], 201);

        case 'DELETE':
            requirePermission('performance.delete');
            $data = perfInput();
            $id = perfUuid($data['id'] ?? null, 'performance ID');
            $existing = perfRecord($pdo, $id);
            if ($existing === null) {
                perfResponse(['success' => false, 'message' => 'Performance record not found.'], 404);
            }
            $ctx = currentUserContext();
            if ($ctx['role_code'] === 'sk_member') {
                rbacAssertMemberAccess($existing['member_id'] ?? null);
            } else {
                rbacAssertCommitteeAccess(isset($existing['committee_id']) ? (string) $existing['committee_id'] : null);
            }
            $delete = $pdo->prepare('DELETE FROM performance WHERE id = :id');
            $delete->execute(['id' => $id]);
            if ($delete->rowCount() !== 1) {
                perfResponse(['success' => false, 'message' => 'Performance record could not be deleted.'], 500);
            }
            perfResponse(['success' => true, 'message' => 'Performance record deleted successfully.']);

        default:
            header('Allow: GET, POST, DELETE, OPTIONS');
            perfResponse(['success' => false, 'message' => 'Method not allowed.'], 405);
    }
} catch (Throwable $e) {
    if (isset($pdo) && $pdo instanceof PDO && $pdo->inTransaction()) {
        $pdo->rollBack();
    }
    error_log('Performance API error: ' . $e->getMessage());
    perfResponse(['success' => false, 'message' => 'Unable to process performance request.'], 500);
}
