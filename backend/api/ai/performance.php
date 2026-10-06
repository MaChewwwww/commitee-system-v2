<?php
/**
 * AI Performance analysis — local PDO data + server-side Gemini.
 */
ob_start();
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../config/auth.php';
require_once __DIR__ . '/../../config/rbac.php';
require_once __DIR__ . '/../../config/ai.php';
require_once __DIR__ . '/../../domain/reporting.php';

corsHeaders();
ob_clean();
requirePermission('ai.use');
if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') { http_response_code(405); header('Allow: POST, OPTIONS'); echo json_encode(['success'=>false,'message'=>'Use POST for AI requests.']); exit; }

function aiPerfResponse(array $payload, int $status = 200): void {
    http_response_code($status);
    echo json_encode($payload);
    exit;
}

try {
    $data = json_decode(file_get_contents('php://input'), true);
    if (!is_array($data)) {
        $data = [];
    }

    $pdo = localPdo();
    $memberId = $data['member_id'] ?? null;

    if (is_string($memberId) && $memberId !== '') {
        $mStmt = $pdo->prepare(
            'SELECT id, full_name, position FROM members WHERE id = :id LIMIT 1'
        );
        $mStmt->execute(['id' => $memberId]);
        $members = $mStmt->fetchAll();
    } else {
        $members = $pdo->query(
            'SELECT id, full_name, position FROM members ORDER BY full_name ASC'
        )->fetchAll();
    }

    $members=array_values(array_filter($members,fn($m)=>rbacCanAccessMember($m['id'])));
    $tasks=rbacFilterRows($pdo->query('SELECT * FROM tasks')->fetchAll());
    $performance=rbacFilterRows($pdo->query('SELECT * FROM performance')->fetchAll());
    $memberScores=workflowScores($members,$tasks,$performance);
    foreach ($memberScores as &$score) {
        $score['member_name']=$score['full_name'];
        $score['final_score']=$score['performance_score'];
    }
    unset($score);

    $lines = array_map(
        static fn(array $m): string => "- {$m['member_name']} | Score:{$m['final_score']}% | Tasks:{$m['completed_tasks']}/{$m['total_tasks']} | Attendance:{$m['attendance_rate']}% | OnTime:{$m['on_time_rate']}% | Grade:{$m['grade']}",
        $memberScores
    );

    $prompt = "You are a performance analyst for SP Committee System Philippines.

Member Performance Data:
" . implode("\n", $lines) . "

Scoring: Task Completion=50%, Attendance=20%, On-Time=30%

Provide performance insights. Respond ONLY in JSON:
{
  \"top_performer\": \"name\",
  \"needs_improvement\": [\"name1\", \"name2\"],
  \"insights\": [
    \"insight 1\",
    \"insight 2\",
    \"insight 3\"
  ],
  \"recommendations\": [
    \"recommendation 1\",
    \"recommendation 2\"
  ],
  \"overall_team_score\": 0,
  \"team_status\": \"excellent/good/average/poor\"
}";

    $ai = geminiGenerate($prompt);
    if (!$ai['ok']) {
        $payload = geminiClientErrorPayload($ai);
        $payload['members'] = $memberScores;
        $payload['ai_insights'] = null;
        $payload['ai_error'] = $payload['message'];
        $status = (($ai['details'] ?? '') === 'NOT CONFIGURED') ? 503 : 502;
        aiPerfResponse($payload, $status);
    }

    if (!is_array($ai['json'])) {
        aiPerfResponse([
            'success' => false,
            'error' => 'AI response error',
            'message' => 'AI returned an unusable performance payload.',
            'details' => 'Missing insights JSON',
            'members' => $memberScores,
            'ai_insights' => null,
            'ai_error' => 'AI returned an unusable performance payload.',
        ], 502);
    }

    aiPerfResponse([
        'success' => true,
        'members' => $memberScores,
        'ai_insights' => $ai['json'],
        'ai_error' => null,
        'model' => $ai['model'] ?? null,
    ]);
} catch (Throwable $e) {
    error_log('AI performance error: ' . $e->getMessage());
    aiPerfResponse(['success' => false, 'message' => 'Unable to analyze performance.', 'error' => 'Unable to analyze performance.'], 500);
}
