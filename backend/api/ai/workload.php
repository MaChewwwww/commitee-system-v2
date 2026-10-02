<?php
/**
 * AI workload analysis — local PDO + server-side Gemini.
 */
ob_start();
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../config/auth.php';
require_once __DIR__ . '/../../config/rbac.php';
require_once __DIR__ . '/../../config/ai.php';

corsHeaders();
ob_clean();
requirePermission('ai.use');

function aiWlResponse(array $payload, int $status = 200): void {
    http_response_code($status);
    echo json_encode($payload);
    exit;
}

try {
    $pdo = localPdo();
    $maxTasks = 5;

    $members = $pdo->query(
        'SELECT id, full_name, position, availability FROM members ORDER BY full_name ASC'
    )->fetchAll();
    $tasks = $pdo->query(
        'SELECT id, member_id, status FROM tasks WHERE member_id IS NOT NULL'
    )->fetchAll();

    $taskCounts = [];
    foreach ($tasks as $task) {
        $mid = $task['member_id'];
        $taskCounts[$mid] = ($taskCounts[$mid] ?? 0) + 1;
    }

    $overloaded = [];
    $underloaded = [];
    $balanced = [];

    foreach ($members as $m) {
        $count = $taskCounts[$m['id']] ?? 0;
        $m['task_count'] = $count;
        if ($count > $maxTasks) {
            $overloaded[] = $m;
        } elseif ($count < 2) {
            $underloaded[] = $m;
        } else {
            $balanced[] = $m;
        }
    }

    $fmt = static fn(array $list): string => empty($list)
        ? 'None'
        : implode("\n", array_map(
            static fn(array $m): string => "- {$m['full_name']}: {$m['task_count']} tasks",
            $list
        ));

    $prompt = "You are an AI workload distribution assistant for SK Committee System.

OVERLOADED MEMBERS (more than 5 tasks):
" . $fmt($overloaded) . "

UNDERLOADED MEMBERS (less than 2 tasks):
" . $fmt($underloaded) . "

BALANCED MEMBERS (2-5 tasks):
" . $fmt($balanced) . "

Analyze the workload distribution and provide recommendations.
Respond ONLY in this JSON format:
{
  \"status\": \"balanced/needs_rebalancing\",
  \"overloaded_count\": 0,
  \"underloaded_count\": 0,
  \"recommendations\": [
    {
      \"action\": \"redistribute\",
      \"from_member\": \"name\",
      \"to_member\": \"name\",
      \"reason\": \"brief reason\"
    }
  ],
  \"summary\": \"overall workload analysis summary\",
  \"alert_level\": \"green/yellow/red\"
}";

    $ai = geminiGenerate($prompt);

    if (!$ai['ok']) {
        $payload = geminiClientErrorPayload($ai);
        $payload['stats'] = [
            'total_members' => count($members),
            'overloaded' => count($overloaded),
            'underloaded' => count($underloaded),
            'balanced' => count($balanced),
            'overloaded_members' => $overloaded,
            'underloaded_members' => $underloaded,
        ];
        $payload['ai_analysis'] = null;
        $payload['ai_error'] = $payload['message'];
        $status = (($ai['details'] ?? '') === 'NOT CONFIGURED') ? 503 : 502;
        aiWlResponse($payload, $status);
    }

    if (!is_array($ai['json'])) {
        aiWlResponse([
            'success' => false,
            'error' => 'AI response error',
            'message' => 'AI returned an unusable workload payload.',
            'details' => 'Missing analysis JSON',
            'ai_analysis' => null,
            'ai_error' => 'AI returned an unusable workload payload.',
            'stats' => [
                'total_members' => count($members),
                'overloaded' => count($overloaded),
                'underloaded' => count($underloaded),
                'balanced' => count($balanced),
                'overloaded_members' => $overloaded,
                'underloaded_members' => $underloaded,
            ],
        ], 502);
    }

    aiWlResponse([
        'success' => true,
        'stats' => [
            'total_members' => count($members),
            'overloaded' => count($overloaded),
            'underloaded' => count($underloaded),
            'balanced' => count($balanced),
            'overloaded_members' => $overloaded,
            'underloaded_members' => $underloaded,
        ],
        'ai_analysis' => $ai['json'],
        'ai_error' => null,
        'model' => $ai['model'] ?? null,
    ]);
} catch (Throwable $e) {
    error_log('AI workload error: ' . $e->getMessage());
    aiWlResponse(['success' => false, 'message' => 'Unable to analyze workload.', 'error' => 'Unable to analyze workload.'], 500);
}
