<?php
/**
 * Export report → legislative_archives — local MariaDB/PDO
 * report_id stays CHAR(36) UUID; field is report_type (not type).
 */
ob_start();
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../config/auth.php';
require_once __DIR__ . '/../../config/rbac.php';

corsHeaders();
ob_clean();

const ARCHIVE_UUID = '/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i';

function archiveResponse(array $payload, int $status = 200): void {
    http_response_code($status);
    echo json_encode($payload);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

try {
    $pdo = localPdo();

    if ($method === 'GET') {
        requirePermission('archives.view');
        $stmt = $pdo->query(
            'SELECT id, report_id, report_title, report_type, committee_id, compiled_data,
                    archive_reference, status, exported_at
             FROM legislative_archives
             ORDER BY exported_at DESC, id DESC'
        );
        $rows = $stmt->fetchAll();
        $allowed = rbacAccessibleCommitteeIds();
        if ($allowed !== null) {
            $rows = array_values(array_filter(
                $rows,
                static function (array $row) use ($allowed): bool {
                    $cid = $row['committee_id'] ?? null;
                    if ($cid === null || $cid === '') {
                        return false;
                    }
                    return in_array((string) $cid, $allowed, true);
                }
            ));
        }
        foreach ($rows as &$row) {
            if (isset($row['compiled_data']) && is_string($row['compiled_data'])) {
                $decoded = json_decode($row['compiled_data'], true);
                $row['compiled_data'] = $decoded ?? $row['compiled_data'];
            }
        }
        unset($row);
        echo json_encode($rows);
        exit;
    }

    if ($method !== 'POST') {
        header('Allow: GET, POST, OPTIONS');
        archiveResponse(['success' => false, 'message' => 'Method not allowed.'], 405);
    }

    requireAnyPermission(['reports.export', 'archives.create']);
    $data = json_decode(file_get_contents('php://input'), true);
    if (!is_array($data)) {
        archiveResponse(['success' => false, 'message' => 'A JSON body is required.'], 400);
    }

    $reportId = $data['report_id'] ?? null;
    if (!is_string($reportId) || !preg_match(ARCHIVE_UUID, $reportId)) {
        archiveResponse(['success' => false, 'message' => 'A valid report_id is required.'], 400);
    }

    $reportStmt = $pdo->prepare(
        'SELECT id, title, committee_id, report_type, date_from, date_to, created_at, snapshot_json
         FROM reports WHERE id = :id LIMIT 1'
    );
    $reportStmt->execute(['id' => $reportId]);
    $report = $reportStmt->fetch();
    if ($report === false) {
        archiveResponse(['success' => false, 'message' => 'Report not found.'], 404);
    }

    $committeeId = $report['committee_id'] ?? null;
    rbacAssertCommitteeAccess($committeeId !== null && $committeeId !== '' ? (string) $committeeId : null);

    $snapshot = json_decode($report['snapshot_json'] ?? 'null', true);
    if (!$snapshot) archiveResponse(['success'=>false,'message'=>'This historical report has no saved snapshot. Generate a new report to archive verified figures.'],409);
    unset($report['snapshot_json']);
    $compiled = ['report'=>$report,'snapshot'=>$snapshot,'exported_at'=>date('Y-m-d H:i:s'),'system'=>'SP Committee Management System'];

    $ref = 'ARCH-' . date('Ymd') . '-' . substr(preg_replace('/[^a-f0-9]/i', '', $reportId), 0, 8);

    $pdo->beginTransaction();
    $lock = $pdo->prepare('SELECT id FROM reports WHERE id=:id FOR UPDATE');
    $lock->execute(['id'=>$reportId]);
    $prior = $pdo->prepare('SELECT archive_reference FROM legislative_archives WHERE report_id=:id LIMIT 1');
    $prior->execute(['id'=>$reportId]);
    if ($existingReference = $prior->fetchColumn()) {
        $pdo->commit();
        archiveResponse(['success'=>true,'message'=>'Report already archived.','archive_reference'=>$existingReference]);
    }

    $insert = $pdo->prepare(
        'INSERT INTO legislative_archives
            (report_id, report_title, report_type, committee_id, compiled_data, archive_reference, status)
         VALUES
            (:report_id, :report_title, :report_type, :committee_id, :compiled_data, :archive_reference, :status)'
    );
    $insert->execute([
        'report_id' => $reportId,
        'report_title' => $report['title'] ?? 'Untitled',
        'report_type' => $report['report_type'] ?? 'general',
        'committee_id' => $committeeId,
        'compiled_data' => json_encode($compiled, JSON_UNESCAPED_UNICODE),
        'archive_reference' => $ref,
        'status' => 'archived',
    ]);

    $log = $pdo->prepare(
        'INSERT INTO module_integration_log
            (source_module, target_module, data_type, record_id, status)
         VALUES
            (:source_module, :target_module, :data_type, :record_id, :status)'
    );
    $log->execute([
        'source_module' => 'reports',
        'target_module' => 'legislative_archives',
        'data_type' => 'accomplishment_report',
        'record_id' => $reportId,
        'status' => 'sent',
    ]);

    $pdo->commit();

    archiveResponse([
        'success' => true,
        'message' => 'Exported to Legislative Archives!',
        'archive_reference' => $ref,
    ]);
} catch (Throwable $e) {
    if (isset($pdo) && $pdo instanceof PDO && $pdo->inTransaction()) {
        $pdo->rollBack();
    }
    error_log('export_to_archives error: ' . $e->getMessage());
    archiveResponse(['success' => false, 'message' => 'Unable to export to archives.'], 500);
}
