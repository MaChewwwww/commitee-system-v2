<?php
/**
 * Accomplishments helper — local MariaDB/PDO
 * Uses performance_score (not final_score).
 */
ob_start();
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../config/auth.php';
require_once __DIR__ . '/../../config/rbac.php';

corsHeaders();
ob_clean();
requirePermission('reports.view');

try {
    $pdo = localPdo();

    $committees = $pdo->query(
        'SELECT id, name, status FROM committees ORDER BY created_at DESC, id DESC'
    )->fetchAll();
    $allowed = rbacAccessibleCommitteeIds();
    if ($allowed !== null) {
        $committees = array_values(array_filter(
            $committees,
            static fn(array $row): bool => in_array($row['id'] ?? '', $allowed, true)
        ));
    }

    $performance = $pdo->query(
        'SELECT id, member_id, committee_id, performance_score FROM performance'
    )->fetchAll();
    $tasks = $pdo->query(
        'SELECT id, committee_id, status FROM tasks'
    )->fetchAll();

    $perfByCommittee = [];
    foreach ($performance as $row) {
        $cid = $row['committee_id'] ?? '';
        if ($cid === '' || $cid === null) {
            continue;
        }
        $perfByCommittee[$cid][] = $row;
    }

    $tasksByCommittee = [];
    foreach ($tasks as $row) {
        $cid = $row['committee_id'] ?? '';
        if ($cid === '' || $cid === null) {
            continue;
        }
        $tasksByCommittee[$cid][] = $row;
    }

    $summary = [];
    foreach ($committees as $committee) {
        $cid = $committee['id'];
        $cPerf = $perfByCommittee[$cid] ?? [];
        $cTasks = $tasksByCommittee[$cid] ?? [];
        $completed = array_filter(
            $cTasks,
            static fn(array $t): bool => ($t['status'] ?? '') === 'completed'
        );

        $avgScore = count($cPerf) > 0
            ? round(array_sum(array_column($cPerf, 'performance_score')) / count($cPerf), 2)
            : 0;

        $summary[] = [
            'committee_id' => $cid,
            'committee_name' => $committee['name'],
            'status' => $committee['status'],
            'member_count' => count($cPerf),
            'avg_performance' => $avgScore,
            'total_tasks' => count($cTasks),
            'completed_tasks' => count($completed),
        ];
    }

    echo json_encode([
        'success' => true,
        'accomplishments' => $summary,
        'generated_at' => date('Y-m-d H:i:s'),
    ]);
} catch (Throwable $e) {
    error_log('get_accomplishments error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Unable to build accomplishments.']);
}
