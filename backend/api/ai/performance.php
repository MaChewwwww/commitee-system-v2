<?php
/**
 * AI Performance analysis — local PDO data + server-side Gemini.
 */
ob_start();
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../config/auth.php';
require_once __DIR__ . '/../../config/rbac.php';
require_once __DIR__ . '/../../config/ai.php';

corsHeaders();
ob_clean();
requirePermission('ai.use');

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

    $tasks = $pdo->query(
        'SELECT id, member_id, status, due_date, updated_at FROM tasks'
    )->fetchAll();
    $performance = $pdo->query(
        'SELECT member_id, attendance_rate, performance_score, created_at
         FROM performance ORDER BY created_at DESC'
    )->fetchAll();

    $tasksByMember = [];
    foreach ($tasks as $task) {
        $mid = $task['member_id'] ?? null;
        if ($mid) {
            $tasksByMember[$mid][] = $task;
        }
    }

    $attendanceByMember = [];
    foreach ($performance as $perf) {
        $mid = $perf['member_id'] ?? null;
        if ($mid && !isset($attendanceByMember[$mid])) {
            $attendanceByMember[$mid] = (float) ($perf['attendance_rate'] ?? 0);
        }
    }

    $memberScores = [];
    foreach ($members as $member) {
        $mid = $member['id'];
        $memberTasks = $tasksByMember[$mid] ?? [];
        $totalTasks = count($memberTasks);
        $completedTasks = array_values(array_filter(
            $memberTasks,
            static fn(array $t): bool => ($t['status'] ?? '') === 'completed'
        ));
        $completedCount = count($completedTasks);
        $onTimeTasks = count(array_filter(
            $completedTasks,
            static function (array $t): bool {
                if (empty($t['due_date'])) {
                    return false;
                }
                $updated = $t['updated_at'] ?? date('Y-m-d H:i:s');
                return strtotime((string) $updated) <= strtotime((string) $t['due_date'] . ' 23:59:59');
            }
        ));

        $attendanceRate = $attendanceByMember[$mid] ?? 0.0;
        $taskCompletionRate = $totalTasks > 0 ? ($completedCount / $totalTasks) * 100 : 0;
        $onTimeRate = $completedCount > 0 ? ($onTimeTasks / $completedCount) * 100 : 0;
        $finalScore = ($taskCompletionRate * 0.50) + ($attendanceRate * 0.20) + ($onTimeRate * 0.30);

        $memberScores[] = [
            'member_id' => $mid,
            'member_name' => $member['full_name'],
            'position' => $member['position'],
            'total_tasks' => $totalTasks,
            'completed_tasks' => $completedCount,
            'task_completion_rate' => round($taskCompletionRate, 2),
            'attendance_rate' => round($attendanceRate, 2),
            'on_time_rate' => round($onTimeRate, 2),
            'final_score' => round($finalScore, 2),
            'grade' => $finalScore >= 90
                ? 'Excellent'
                : ($finalScore >= 75
                    ? 'Good'
                    : ($finalScore >= 60 ? 'Average' : 'Needs Improvement')),
        ];
    }

    usort($memberScores, static fn(array $a, array $b): int => $b['final_score'] <=> $a['final_score']);

    $lines = array_map(
        static fn(array $m): string => "- {$m['member_name']} | Score:{$m['final_score']}% | Tasks:{$m['completed_tasks']}/{$m['total_tasks']} | Attendance:{$m['attendance_rate']}% | OnTime:{$m['on_time_rate']}% | Grade:{$m['grade']}",
        $memberScores
    );

    $prompt = "You are a performance analyst for SK Committee System Philippines.

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
