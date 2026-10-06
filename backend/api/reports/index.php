<?php
/**
 * Reports API — local MariaDB/PDO
 * Canonical field: report_type (not type)
 */
ob_start();
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../config/auth.php';
require_once __DIR__ . '/../../config/rbac.php';
require_once __DIR__ . '/../../domain/reporting.php';

corsHeaders();
ob_clean();

const REPORT_SELECT = 'id, title, committee_id, report_type, date_from, date_to, created_at, snapshot_json';
const REPORT_UUID = '/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i';
const REPORT_TYPES = ['committee', 'member', 'performance', 'workload', 'full'];

function reportResponse(array $payload, int $status = 200): void {
    http_response_code($status);
    echo json_encode($payload);
    exit;
}

function reportInput(): array {
    $data = json_decode(file_get_contents('php://input'), true);
    if (!is_array($data)) {
        reportResponse(['success' => false, 'message' => 'A JSON report record is required.'], 400);
    }
    return $data;
}

function reportUuid(?string $value, string $label, bool $allowNull = false): ?string {
    if ($value === null || $value === '') {
        if ($allowNull) {
            return null;
        }
        reportResponse(['success' => false, 'message' => 'A valid ' . $label . ' is required.'], 400);
    }
    if (!preg_match(REPORT_UUID, $value)) {
        reportResponse(['success' => false, 'message' => 'A valid ' . $label . ' is required.'], 400);
    }
    return $value;
}

function reportExists(PDO $pdo, string $table, string $id): bool {
    $stmt = $pdo->prepare("SELECT 1 FROM {$table} WHERE id = :id LIMIT 1");
    $stmt->execute(['id' => $id]);
    return (bool) $stmt->fetchColumn();
}

function reportRecord(PDO $pdo, string $id): ?array {
    $stmt = $pdo->prepare('SELECT ' . REPORT_SELECT . ' FROM reports WHERE id = :id LIMIT 1');
    $stmt->execute(['id' => $id]);
    $row = $stmt->fetch();
    return $row === false ? null : $row;
}

function reportDate(?string $value, string $label): ?string {
    if ($value === null || $value === '') {
        return null;
    }
    workflowDate($value, $label);
    if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $value)) {
        reportResponse(['success' => false, 'message' => $label . ' must be YYYY-MM-DD.'], 400);
    }
    return $value;
}

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

try {
    $pdo = localPdo();

    switch ($method) {
        case 'GET':
            requirePermission('reports.view');
            $stmt = $pdo->query('SELECT ' . REPORT_SELECT . ' FROM reports ORDER BY created_at DESC, id DESC');
            $rows = $stmt->fetchAll();
            $allowed = rbacAccessibleCommitteeIds();
            if ($allowed !== null) {
                $rows = array_values(array_filter(
                    $rows,
                    static function (array $row) use ($allowed): bool {
                        $cid = $row['committee_id'] ?? null;
                        if ($cid === null || $cid === '') {
                            return false; // null committee_id only for global roles
                        }
                        return in_array((string) $cid, $allowed, true);
                    }
                ));
            }
            if (currentUserContext()['role_code']==='sk_member') $rows=array_values(array_filter($rows,fn($r)=>$r['report_type']==='committee'));
            foreach ($rows as &$row) { $row['snapshot'] = json_decode($row['snapshot_json'] ?? 'null', true); unset($row['snapshot_json']); }
            unset($row);
            echo json_encode($rows);
            exit;

        case 'POST':
            requirePermission('reports.create');
            $data = reportInput();
            $title = isset($data['title']) && is_string($data['title']) ? trim($data['title']) : '';
            if ($title === '') {
                reportResponse(['success' => false, 'message' => 'Title is required.'], 400);
            }
            if (mb_strlen($title) > 255) {
                reportResponse(['success' => false, 'message' => 'Title is too long.'], 400);
            }

            $reportType = $data['report_type'] ?? null;
            if (!is_string($reportType) || !in_array($reportType, REPORT_TYPES, true)) {
                reportResponse(['success' => false, 'message' => 'A valid report_type is required.'], 400);
            }

            $committeeId = reportUuid(
                isset($data['committee_id']) && is_string($data['committee_id']) ? $data['committee_id'] : null,
                'committee ID',
                true
            );
            rbacAssertCommitteeAccess($committeeId);
            if ($committeeId !== null && !reportExists($pdo, 'committees', $committeeId)) {
                reportResponse(['success' => false, 'message' => 'Committee not found.'], 404);
            }

            $dateFrom = reportDate(isset($data['date_from']) && is_string($data['date_from']) ? $data['date_from'] : null, 'Date from');
            $dateTo = reportDate(isset($data['date_to']) && is_string($data['date_to']) ? $data['date_to'] : null, 'Date to');

            if ($dateFrom && $dateTo && $dateFrom > $dateTo) throw new DomainException('The start date must not be after the end date.', 400);
            $pdo->beginTransaction();
            $snapshot = workflowReport($pdo, $reportType, $title, $committeeId, $dateFrom, $dateTo);
            $before = $pdo->query('SELECT id FROM reports')->fetchAll(PDO::FETCH_COLUMN);
            $known = array_fill_keys($before, true);
            $insert = $pdo->prepare(
                'INSERT INTO reports (title, committee_id, report_type, date_from, date_to, snapshot_json)
                 VALUES (:title, :committee_id, :report_type, :date_from, :date_to, :snapshot_json)'
            );
            $insert->execute([
                'title' => $title,
                'committee_id' => $committeeId,
                'report_type' => $reportType,
                'date_from' => $dateFrom,
                'date_to' => $dateTo,
                'snapshot_json' => json_encode($snapshot, JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR),
            ]);
            $rows = $pdo->query('SELECT ' . REPORT_SELECT . ' FROM reports')->fetchAll();
            $created = array_values(array_filter($rows, static fn(array $r): bool => !isset($known[$r['id']])));
            if (count($created) !== 1) {
                $pdo->rollBack();
                reportResponse(['success' => false, 'message' => 'Report was not created safely.'], 500);
            }
            $pdo->commit();
            $created[0]['snapshot'] = $snapshot;
            unset($created[0]['snapshot_json']);
            reportResponse(['success' => true, 'message' => 'Report created successfully.', 'data' => $created[0]], 201);

        case 'DELETE':
            requirePermission('reports.delete');
            $data = reportInput();
            $id = reportUuid($data['id'] ?? null, 'report ID');
            $existing = reportRecord($pdo, $id);
            if ($existing === null) {
                reportResponse(['success' => false, 'message' => 'Report not found.'], 404);
            }
            rbacAssertCommitteeAccess(isset($existing['committee_id']) ? (string) $existing['committee_id'] : null);

            // Block delete if archived
            $arch = $pdo->prepare('SELECT COUNT(*) FROM legislative_archives WHERE report_id = :id');
            $arch->execute(['id' => $id]);
            if ((int) $arch->fetchColumn() > 0) {
                reportResponse([
                    'success' => false,
                    'message' => 'This report cannot be deleted because archive records exist.',
                ], 409);
            }

            $delete = $pdo->prepare('DELETE FROM reports WHERE id = :id');
            $delete->execute(['id' => $id]);
            if ($delete->rowCount() !== 1) {
                reportResponse(['success' => false, 'message' => 'Report could not be deleted.'], 500);
            }
            reportResponse(['success' => true, 'message' => 'Report deleted successfully.']);

        default:
            header('Allow: GET, POST, DELETE, OPTIONS');
            reportResponse(['success' => false, 'message' => 'Method not allowed.'], 405);
    }
} catch (DomainException $e) {
    if (isset($pdo) && $pdo->inTransaction()) $pdo->rollBack();
    reportResponse(["success"=>false,"message"=>$e->getMessage()], $e->getCode() ?: 400);
} catch (Throwable $e) {
    if (isset($pdo) && $pdo instanceof PDO && $pdo->inTransaction()) {
        $pdo->rollBack();
    }
    error_log('Reports API error: ' . $e->getMessage());
    reportResponse(['success' => false, 'message' => 'Unable to process report request.'], 500);
}
