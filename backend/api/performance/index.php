<?php
/**
 * Performance API — local MariaDB/PDO
 * Persisted score field: performance_score (not final_score)
 */
ob_start();
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../config/auth.php';
require_once __DIR__ . '/../../config/rbac.php';
require_once __DIR__ . '/../../domain/reporting.php';

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

            rbacAssertMemberAccess($memberId);
            if ($committeeId !== null) {
                $membership = $pdo->prepare('SELECT 1 FROM committee_members WHERE committee_id=:cid AND member_id=:mid');
                $membership->execute(['cid'=>$committeeId,'mid'=>$memberId]);
                if (!$membership->fetchColumn()) throw new DomainException('Attendance must reference a member of this committee.',409);
            }
            $attendance = perfRate($data['attendance_rate'] ?? null, 'Attendance rate');
            $period = $data['period'] ?? '';
            if (!is_string($period) || !preg_match('/^\d{4}-\d{2}$/',$period)) throw new DomainException('Choose a reporting month (YYYY-MM).',400);
            workflowDate($period.'-01','Reporting month');
            if ($period > substr(workflowNow(),0,7)) throw new DomainException('Attendance cannot be recorded for a future month.',400);
            $pdo->beginTransaction();
            $lock=$pdo->prepare('SELECT id FROM members WHERE id=:id FOR UPDATE');
            $lock->execute(['id'=>$memberId]);
            $source=workflowReportData($pdo,$committeeId);
            $source['attendance']=array_values(array_filter($source['attendance'],fn($r)=>$r['member_id']!==$memberId));
            $source['attendance'][]=['id'=>'','member_id'=>$memberId,'attendance_rate'=>$attendance,'created_at'=>workflowNow()];
            $scores=workflowScores([['id'=>$memberId,'full_name'=>'']],$source['tasks'],$source['attendance']);
            $prior=$pdo->prepare('SELECT id FROM performance WHERE member_id=:mid AND committee_id <=> :cid AND period=:period ORDER BY created_at DESC,id DESC LIMIT 1');
            $prior->execute(['mid'=>$memberId,'cid'=>$committeeId,'period'=>$period]);
            $id=$prior->fetchColumn();
            $values=['member_id'=>$memberId,'committee_id'=>$committeeId,'attendance_rate'=>$attendance,'task_completion_rate'=>$scores[0]['task_completion_rate'],'performance_score'=>$scores[0]['performance_score'],'period'=>$period];
            if ($id) {
                $values['id']=$id;
                $query='UPDATE performance SET member_id=:member_id,committee_id=:committee_id,attendance_rate=:attendance_rate,task_completion_rate=:task_completion_rate,performance_score=:performance_score,period=:period,created_at=CURRENT_TIMESTAMP WHERE id=:id';
            } else {
                $id=$pdo->query('SELECT UUID()')->fetchColumn();
                $values['id']=$id;
                $query='INSERT INTO performance (id,member_id,committee_id,attendance_rate,task_completion_rate,performance_score,period) VALUES (:id,:member_id,:committee_id,:attendance_rate,:task_completion_rate,:performance_score,:period)';
            }
            $pdo->prepare($query)->execute($values);
            $pdo->commit();
            perfResponse(['success'=>true,'message'=>'Attendance saved. Scores are calculated from approved tasks.','data'=>perfRecord($pdo,$id)],201);

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
} catch (DomainException $e) {
    if (isset($pdo) && $pdo->inTransaction()) $pdo->rollBack();
    perfResponse(['success'=>false,'message'=>$e->getMessage()],$e->getCode() ?: 400);
} catch (Throwable $e) {
    if (isset($pdo) && $pdo instanceof PDO && $pdo->inTransaction()) {
        $pdo->rollBack();
    }
    error_log('Performance API error: ' . $e->getMessage());
    perfResponse(['success' => false, 'message' => 'Unable to process performance request.'], 500);
}
