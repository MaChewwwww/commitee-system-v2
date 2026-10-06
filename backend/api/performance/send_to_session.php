<?php
/**
 * Send performance → session_performance_logs — local MariaDB/PDO
 * Uses performance_score (not final_score). record_id stays UUID string.
 */
ob_start();
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../config/auth.php';
require_once __DIR__ . '/../../config/rbac.php';
require_once __DIR__ . '/../../domain/reporting.php';

corsHeaders();
ob_clean();

const SESSION_UUID = '/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i';

function sessionResponse(array $payload, int $status = 200): void {
    http_response_code($status);
    echo json_encode($payload);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

try {
    $pdo = localPdo();

    if ($method === 'GET') {
        requirePermission('session.view');
        sessionResponse([
            'success' => true,
            'message' => 'send_to_session.php is working!',
            'method' => 'Use POST to send data',
        ]);
    }

    if ($method !== 'POST') {
        header('Allow: GET, POST, OPTIONS');
        sessionResponse(['success' => false, 'message' => 'Method not allowed.'], 405);
    }

    requirePermission('session.create');
    $data = json_decode(file_get_contents('php://input'), true);
    if (!is_array($data)) {
        $data = [];
    }

    $committeeId = $data['committee_id'] ?? null;
    if ($committeeId !== null && $committeeId !== '') {
        if (!is_string($committeeId) || !preg_match(SESSION_UUID, $committeeId)) {
            sessionResponse(['success' => false, 'message' => 'A valid committee_id is required.'], 400);
        }
        rbacAssertCommitteeAccess($committeeId);
        $stmt = $pdo->prepare(
            'SELECT id, member_id, committee_id, attendance_rate, task_completion_rate,
                    performance_score, period, created_at
             FROM performance WHERE committee_id = :cid'
        );
        $stmt->execute(['cid' => $committeeId]);
        $scores = $stmt->fetchAll();
    } else {
        $committeeId = null;
        rbacAssertCommitteeAccess(null);
        $scores = $pdo->query(
            'SELECT id, member_id, committee_id, attendance_rate, task_completion_rate,
                    performance_score, period, created_at FROM performance'
        )->fetchAll();
    }

    $source=workflowReportData($pdo,$committeeId);
    $scores=workflowScores($source['members'],$source['tasks'],$source['attendance']);
    foreach ($scores as &$score) $score['committee_id']=$committeeId;
    unset($score);

    if (empty($scores)) {
        sessionResponse(['success' => false, 'message' => 'No performance data found'], 404);
    }

    $total = count($scores);
    $avgScore = round(array_sum(array_column($scores, 'performance_score')) / $total, 2);

    $analytics = [
        'total_members' => $total,
        'average_score' => $avgScore,
        'top_performer' => $scores[0]['full_name'] ?? 'N/A',
        'generated_at' => date('Y-m-d H:i:s'),
        'members' => $scores,
    ];

    $pdo->beginTransaction();

    $insert = $pdo->prepare(
        'INSERT INTO session_performance_logs
            (committee_id, member_id, performance_score, attendance_rate, task_completion, analytics_data, sent_to_session)
         VALUES
            (:committee_id, :member_id, :performance_score, :attendance_rate, :task_completion, :analytics_data, 1)'
    );

    foreach ($scores as $score) {
        $insert->execute([
            'committee_id' => $score['committee_id'] ?? null,
            'member_id' => $score['member_id'] ?? null,
            'performance_score' => $score['performance_score'] ?? 0,
            'attendance_rate' => $score['attendance_rate'] ?? 0,
            'task_completion' => $score['task_completion_rate'] ?? 0,
            'analytics_data' => json_encode($analytics, JSON_UNESCAPED_UNICODE),
        ]);
    }

    $log = $pdo->prepare(
        'INSERT INTO module_integration_log
            (source_module, target_module, data_type, record_id, status)
         VALUES
            (:source_module, :target_module, :data_type, :record_id, :status)'
    );
    $log->execute([
        'source_module' => 'performance',
        'target_module' => 'session_management',
        'data_type' => 'performance_logs',
        'record_id' => $committeeId,
        'status' => 'sent',
    ]);

    $pdo->commit();

    sessionResponse([
        'success' => true,
        'message' => 'Performance logs sent!',
        'analytics_summary' => $analytics,
    ]);
} catch (Throwable $e) {
    if (isset($pdo) && $pdo instanceof PDO && $pdo->inTransaction()) {
        $pdo->rollBack();
    }
    error_log('send_to_session error: ' . $e->getMessage());
    sessionResponse(['success' => false, 'message' => 'Unable to send performance to session.'], 500);
}
