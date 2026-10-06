<?php
ob_start();
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../config/auth.php';
require_once __DIR__ . '/../../config/rbac.php';

corsHeaders();
ob_clean();

const MEMBER_SELECT = 'id, full_name, email, phone, position, skills, availability, workload_score, created_at';
const MEMBER_UUID_PATTERN = '/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i';

function memberResponse(array $payload, int $status = 200): void {
    http_response_code($status);
    echo json_encode($payload);
    exit;
}

function memberInput(): array {
    $data = json_decode(file_get_contents('php://input'), true);
    if (!is_array($data)) {
        memberResponse(['success' => false, 'message' => 'A JSON member record is required.'], 400);
    }

    return $data;
}

function memberText(array $data, string $field, int $maximumLength, bool $required = false): ?string {
    $value = $data[$field] ?? null;
    if ($value === null) {
        if ($required) {
            memberResponse(['success' => false, 'message' => 'Full name is required.'], 400);
        }
        return null;
    }

    if (!is_string($value)) {
        memberResponse(['success' => false, 'message' => 'Invalid ' . str_replace('_', ' ', $field) . '.'], 400);
    }

    $value = trim($value);
    if ($required && $value === '') {
        memberResponse(['success' => false, 'message' => 'Full name is required.'], 400);
    }
    if (!$required && $value === '') {
        return null;
    }
    if (mb_strlen($value) > $maximumLength) {
        memberResponse(['success' => false, 'message' => ucfirst(str_replace('_', ' ', $field)) . ' is too long.'], 400);
    }

    return $value;
}

function validatedMember(array $data): array {
    $fullName = memberText($data, 'full_name', 255, true);
    $email = memberText($data, 'email', 254);
    $phone = memberText($data, 'phone', 100);
    $position = memberText($data, 'position', 255);

    if ($email !== null && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        memberResponse(['success' => false, 'message' => 'Email address is invalid.'], 400);
    }

    $availability = $data['availability'] ?? 'available';
    if (!is_string($availability) || !in_array($availability, ['available', 'busy', 'unavailable'], true)) {
        memberResponse(['success' => false, 'message' => 'Availability must be available, busy, or unavailable.'], 400);
    }

    $skills = $data['skills'] ?? [];
    if (!is_array($skills)) {
        memberResponse(['success' => false, 'message' => 'Skills must be a list.'], 400);
    }
    if (count($skills) > 50) {
        memberResponse(['success' => false, 'message' => 'Too many skills were provided.'], 400);
    }

    $normalizedSkills = [];
    foreach ($skills as $skill) {
        if (!is_string($skill)) {
            memberResponse(['success' => false, 'message' => 'Each skill must be text.'], 400);
        }
        $skill = trim($skill);
        if ($skill === '') {
            continue;
        }
        if (mb_strlen($skill) > 100) {
            memberResponse(['success' => false, 'message' => 'A skill is too long.'], 400);
        }
        $normalizedSkills[] = $skill;
    }

    $skillsJson = json_encode(array_values(array_unique($normalizedSkills)), JSON_UNESCAPED_UNICODE);
    if ($skillsJson === false) {
        memberResponse(['success' => false, 'message' => 'Skills could not be saved.'], 400);
    }

    return [
        'full_name' => $fullName,
        'email' => $email,
        'phone' => $phone,
        'position' => $position,
        'skills' => $skillsJson,
        'availability' => $availability,
    ];
}

function memberId(array $data): string {
    $id = $data['id'] ?? '';
    if (!is_string($id) || !preg_match(MEMBER_UUID_PATTERN, $id)) {
        memberResponse(['success' => false, 'message' => 'A valid member ID is required.'], 400);
    }

    return $id;
}

function memberDependencies(PDO $pdo, string $memberId): int {
    $statement = $pdo->prepare(
        'SELECT COUNT(*) FROM committee_members WHERE member_id = :committee_member_id '
        . 'UNION ALL SELECT COUNT(*) FROM tasks WHERE member_id = :task_member_id '
        . 'UNION ALL SELECT COUNT(*) FROM performance WHERE member_id = :performance_member_id '
        . 'UNION ALL SELECT COUNT(*) FROM session_performance_logs WHERE member_id = :session_member_id '
        . 'UNION ALL SELECT COUNT(*) FROM users WHERE member_id = :user_member_id'
    );
    $statement->execute([
        'committee_member_id' => $memberId,
        'task_member_id' => $memberId,
        'performance_member_id' => $memberId,
        'session_member_id' => $memberId,
        'user_member_id' => $memberId,
    ]);

    return array_sum(array_map('intval', $statement->fetchAll(PDO::FETCH_COLUMN)));
}

function memberRecord(array $record): array {
    $skills = json_decode($record['skills'] ?? '[]', true);
    $record['skills'] = is_array($skills) ? $skills : [];

    return $record;
}

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

try {
    $pdo = localPdo();

    switch ($method) {
        case 'GET':
            requirePermission('members.view');
            $statement = $pdo->query('SELECT ' . MEMBER_SELECT . ' FROM members ORDER BY created_at DESC, id DESC');
            $rows = array_map('memberRecord', $statement->fetchAll());
            if (rbacIsScopedRole()) {
                $rows = array_values(array_filter(
                    $rows,
                    static fn(array $row): bool => rbacCanAccessMember($row['id'] ?? null)
                ));
            }
            echo json_encode($rows);
            exit;

        case 'POST':
            requirePermission('members.create');
            $member = validatedMember(memberInput());

            // The UUID trigger owns ID generation. A transaction snapshot lets us
            // return precisely the trigger-created row without lastInsertId().
            $pdo->beginTransaction();
            $before = $pdo->query('SELECT id FROM members')->fetchAll(PDO::FETCH_COLUMN);
            $knownIds = array_fill_keys($before, true);

            $insert = $pdo->prepare(
                'INSERT INTO members (full_name, email, phone, position, skills, availability) '
                . 'VALUES (:full_name, :email, :phone, :position, :skills, :availability)'
            );
            $insert->execute($member);

            $createdRows = $pdo->query('SELECT ' . MEMBER_SELECT . ' FROM members')->fetchAll();
            $created = array_values(array_filter($createdRows, static fn(array $row): bool => !isset($knownIds[$row['id']])));
            if (count($created) !== 1) {
                $pdo->rollBack();
                memberResponse(['success' => false, 'message' => 'Member was not created safely. Please try again.'], 500);
            }

            $pdo->commit();
            memberResponse(['success' => true, 'data' => memberRecord($created[0])], 201);

        case 'PUT':
            requirePermission('members.update');
            $data = memberInput();
            $id = memberId($data);
            $member = validatedMember($data);

            $exists = $pdo->prepare('SELECT id FROM members WHERE id = :id');
            $exists->execute(['id' => $id]);
            if ($exists->fetchColumn() === false) {
                memberResponse(['success' => false, 'message' => 'Member not found.'], 404);
            }

            $update = $pdo->prepare(
                'UPDATE members SET full_name = :full_name, email = :email, phone = :phone, '
                . 'position = :position, skills = :skills, availability = :availability WHERE id = :id'
            );
            $update->execute($member + ['id' => $id]);

            $record = $pdo->prepare('SELECT ' . MEMBER_SELECT . ' FROM members WHERE id = :id');
            $record->execute(['id' => $id]);
            memberResponse([
                'success' => true,
                'message' => $update->rowCount() === 0 ? 'No member changes were needed.' : 'Member updated successfully.',
                'data' => memberRecord($record->fetch()),
            ]);

        case 'DELETE':
            requirePermission('members.delete');
            $id = memberId(memberInput());

            $exists = $pdo->prepare('SELECT id FROM members WHERE id = :id');
            $exists->execute(['id' => $id]);
            if ($exists->fetchColumn() === false) {
                memberResponse(['success' => false, 'message' => 'Member not found.'], 404);
            }

            if (memberDependencies($pdo, $id) > 0) {
                memberResponse([
                    'success' => false,
                    'message' => 'This member cannot be deleted because related committee assignments, tasks, performance records, or session records exist.',
                ], 409);
            }

            $delete = $pdo->prepare('DELETE FROM members WHERE id = :id');
            $delete->execute(['id' => $id]);
            if ($delete->rowCount() !== 1) {
                memberResponse(['success' => false, 'message' => 'Member could not be deleted.'], 500);
            }

            memberResponse(['success' => true, 'message' => 'Member deleted successfully.']);

        default:
            header('Allow: GET, POST, PUT, DELETE, OPTIONS');
            memberResponse(['success' => false, 'message' => 'Method not allowed.'], 405);
    }
} catch (PDOException $exception) {
    if (isset($pdo) && $pdo instanceof PDO && $pdo->inTransaction()) {
        $pdo->rollBack();
    }

    if ($method === 'DELETE' && $exception->getCode() === '23000') {
        memberResponse([
            'success' => false,
            'message' => 'This member cannot be deleted because related committee assignments, tasks, performance records, or session records exist.',
        ], 409);
    }

    memberResponse(['success' => false, 'message' => 'Members database operation failed. Please try again later.'], 500);
} catch (Throwable $exception) {
    if (isset($pdo) && $pdo instanceof PDO && $pdo->inTransaction()) {
        $pdo->rollBack();
    }
    memberResponse(['success' => false, 'message' => 'Members request could not be processed.'], 500);
}
