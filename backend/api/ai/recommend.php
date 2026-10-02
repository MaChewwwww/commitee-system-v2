<?php
/**
 * AI member recommendations — local PDO + server-side Gemini.
 */
ob_start();
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../config/auth.php';
require_once __DIR__ . '/../../config/rbac.php';
require_once __DIR__ . '/../../config/ai.php';

corsHeaders();
ob_clean();
requirePermission('ai.use');

const AI_REC_UUID = '/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i';

function aiRecResponse(array $payload, int $status = 200): void {
    http_response_code($status);
    echo json_encode($payload);
    exit;
}

try {
    $data = json_decode(file_get_contents('php://input'), true);
    if (!is_array($data)) {
        $data = [];
    }

    $committeeId = $data['committee_id'] ?? '';
    $requiredSkills = $data['required_skills'] ?? [];
    if (!is_array($requiredSkills)) {
        $requiredSkills = is_string($requiredSkills) && $requiredSkills !== ''
            ? array_map('trim', explode(',', $requiredSkills))
            : [];
    }
    $preferredPosition = isset($data['preferred_position']) && is_string($data['preferred_position'])
        ? trim($data['preferred_position'])
        : '';
    $maxWorkload = 5;

    if (!is_string($committeeId) || !preg_match(AI_REC_UUID, $committeeId)) {
        aiRecResponse(['success' => false, 'message' => 'Committee required'], 400);
    }
    rbacAssertCommitteeAccess($committeeId);

    $pdo = localPdo();

    $cStmt = $pdo->prepare(
        'SELECT id, name, type, purpose FROM committees WHERE id = :id LIMIT 1'
    );
    $cStmt->execute(['id' => $committeeId]);
    $committee = $cStmt->fetch();
    if ($committee === false) {
        aiRecResponse(['success' => false, 'message' => 'Committee not found.'], 404);
    }

    $members = $pdo->query(
        "SELECT id, full_name, position, skills, availability
         FROM members WHERE availability = 'available'"
    )->fetchAll();

    $pendingTasks = $pdo->query(
        "SELECT member_id FROM tasks WHERE status = 'pending' AND member_id IS NOT NULL"
    )->fetchAll();

    $taskCounts = [];
    foreach ($pendingTasks as $task) {
        $mid = $task['member_id'];
        $taskCounts[$mid] = ($taskCounts[$mid] ?? 0) + 1;
    }

    $aStmt = $pdo->prepare(
        'SELECT member_id FROM committee_members WHERE committee_id = :cid'
    );
    $aStmt->execute(['cid' => $committeeId]);
    $assignedIds = $aStmt->fetchAll(PDO::FETCH_COLUMN);
    $assignedLookup = array_fill_keys($assignedIds ?: [], true);

    $eligibleMembers = array_values(array_filter(
        $members,
        static function (array $m) use ($taskCounts, $assignedLookup, $maxWorkload, $preferredPosition): bool {
            if (isset($assignedLookup[$m['id']])) {
                return false;
            }
            if (($taskCounts[$m['id']] ?? 0) >= $maxWorkload) {
                return false;
            }
            if ($preferredPosition !== '' && strcasecmp((string) ($m['position'] ?? ''), $preferredPosition) !== 0) {
                return false;
            }
            return true;
        }
    ));

    if (empty($eligibleMembers)) {
        aiRecResponse(['success' => false, 'message' => 'No eligible members available']);
    }

    $membersList = array_map(
        static function (array $m) use ($taskCounts): string {
            $skills = memberSkillsToString($m['skills'] ?? null);
            $taskCount = $taskCounts[$m['id']] ?? 0;
            return "- ID:{$m['id']} | Name:{$m['full_name']} | Position:" . ($m['position'] ?? 'Member')
                . " | Skills:{$skills} | Tasks:{$taskCount}/5 | Availability:" . ($m['availability'] ?? 'available');
        },
        $eligibleMembers
    );

    $prompt = "You are an AI for SK (Sangguniang Kabataan) Committee Management System in the Philippines.

Committee: {$committee['name']}
Type: " . ($committee['type'] ?? 'General') . "
Purpose: " . ($committee['purpose'] ?? 'Not specified') . "
Required Skills: " . (empty($requiredSkills) ? 'Any' : implode(', ', $requiredSkills)) . "
Maximum members needed: 5
Preferred Position: " . ($preferredPosition !== '' ? $preferredPosition : 'Any') . "

Eligible Members:
" . implode("\n", $membersList) . "

Analyze each member and recommend the TOP 3 best members for this committee.
Consider: skills match, current workload (fewer tasks = better), position, and availability.
Score each from 0-100.

Respond ONLY in this exact JSON format:
{
  \"recommendations\": [
    {
      \"member_id\": \"uuid here\",
      \"member_name\": \"name here\",
      \"score\": 95,
      \"reason\": \"brief reason here\",
      \"skills_match\": \"high/medium/low\",
      \"workload_status\": \"light/moderate/heavy\"
    }
  ],
  \"summary\": \"brief overall recommendation summary\"
}";

    $ai = geminiGenerate($prompt);

    if (!$ai['ok']) {
        $payload = geminiClientErrorPayload($ai);
        $status = 502;
        if (($ai['details'] ?? '') === 'NOT CONFIGURED') {
            $status = 503;
        } elseif (in_array((int) ($ai['http'] ?? 0), [401, 403], true)) {
            $status = 502;
        }
        aiRecResponse($payload, $status);
    }

    if (!is_array($ai['json']) || !isset($ai['json']['recommendations'])) {
        aiRecResponse([
            'success' => false,
            'error' => 'AI response error',
            'message' => 'AI returned an unusable recommendation payload.',
            'details' => 'Missing recommendations JSON',
        ], 502);
    }

    aiRecResponse([
        'success' => true,
        'data' => $ai['json'],
        'model' => $ai['model'] ?? null,
    ]);
} catch (Throwable $e) {
    error_log('AI recommend error: ' . $e->getMessage());
    aiRecResponse(['success' => false, 'message' => 'Unable to generate recommendations.', 'error' => 'Unable to generate recommendations.'], 500);
}
