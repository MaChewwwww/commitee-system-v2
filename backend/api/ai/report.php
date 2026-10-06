<?php
/**
 * AI formal report summary — local PDO + server-side Gemini.
 */
ob_start();
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../config/auth.php';
require_once __DIR__ . '/../../config/rbac.php';
require_once __DIR__ . '/../../config/ai.php';

corsHeaders();
ob_clean();
requirePermission('ai.use');
if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') { http_response_code(405); header('Allow: POST, OPTIONS'); echo json_encode(['success'=>false,'message'=>'Use POST for AI requests.']); exit; }

function aiReportResponse(array $payload, int $status = 200): void {
    http_response_code($status);
    echo json_encode($payload);
    exit;
}

try {
    $pdo = localPdo();

    $committees = $pdo->query(
        'SELECT id, name, type, status FROM committees ORDER BY name ASC'
    )->fetchAll();
    $members = $pdo->query(
        'SELECT id, full_name, position FROM members ORDER BY full_name ASC'
    )->fetchAll();
    $tasks = $pdo->query(
        'SELECT id, committee_id, member_id, status FROM tasks'
    )->fetchAll();

    $committees = array_values(array_filter($committees, fn($c)=>rbacCanAccessCommittee($c['id'])));
    $members = array_values(array_filter($members, fn($m)=>rbacCanAccessMember($m['id'])));
    $tasks = rbacFilterRows($tasks);
    $pendingTasks = count(array_filter($tasks, static fn(array $t): bool => ($t['status'] ?? '') !== 'completed'));
    $completedTasks = count(array_filter($tasks, static fn(array $t): bool => ($t['status'] ?? '') === 'completed'));

    $committeesStr = '';
    foreach ($committees as $c) {
        $committeesStr .= '- ' . $c['name'] . ' (' . ($c['type'] ?: 'General') . ') - ' . $c['status'] . "\n";
    }

    $tasksByMember = [];
    foreach ($tasks as $t) {
        if (!empty($t['member_id'])) {
            $tasksByMember[$t['member_id']][] = $t;
        }
    }

    $membersStr = '';
    foreach ($members as $m) {
        $mTasks = $tasksByMember[$m['id']] ?? [];
        $mDone = count(array_filter($mTasks, static fn(array $t): bool => ($t['status'] ?? '') === 'completed'));
        $membersStr .= '- ' . $m['full_name'] . ' (' . ($m['position'] ?: 'Member') . '): '
            . count($mTasks) . ' total, ' . $mDone . " completed\n";
    }

    $prompt = 'You are a report generator for SP Committee Management System in the Philippines.

Data:
- Committees: ' . count($committees) . '
- Members: ' . count($members) . '
- Tasks: ' . count($tasks) . '
- Pending: ' . $pendingTasks . '
- Completed: ' . $completedTasks . '

Committees:
' . $committeesStr . '
Members:
' . $membersStr . '
Generate a comprehensive formal report. Include:
1. Executive Summary
2. Committee Status Overview
3. Member Performance
4. Workload Analysis
5. Key Findings
6. Recommendations
7. Conclusion

Use formal Filipino-English style.';

    $ai = geminiGenerate($prompt);
    if (!$ai['ok']) {
        $payload = geminiClientErrorPayload($ai);
        $status = (($ai['details'] ?? '') === 'NOT CONFIGURED') ? 503 : 502;
        aiReportResponse($payload, $status);
    }

    if (!isset($ai['text']) || !is_string($ai['text']) || trim($ai['text']) === '') {
        aiReportResponse([
            'success' => false,
            'error' => 'AI response error',
            'message' => 'AI returned an empty report.',
            'details' => 'Empty report text',
        ], 502);
    }

    aiReportResponse([
        'success' => true,
        'report_text' => $ai['text'],
        'message' => 'AI report generated.',
        'model' => $ai['model'] ?? null,
    ]);
} catch (Throwable $e) {
    error_log('AI report error: ' . $e->getMessage());
    aiReportResponse(['success' => false, 'message' => 'Unable to generate AI report.', 'error' => 'Unable to generate AI report.'], 500);
}
