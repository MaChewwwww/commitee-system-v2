<?php
ob_start();
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../config/auth.php';
require_once __DIR__ . '/../../config/rbac.php';
require_once __DIR__ . '/../../domain/lifecycle.php';

corsHeaders();
ob_clean();

const COMMITTEE_SELECT = 'id, name, type, issued_date, issued_by, effective_until, purpose, mandate, qualification_requirements, status, created_at';
const COMMITTEE_UUID_PATTERN = '/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i';

function committeeResponse(array $payload, int $status = 200): void {
    http_response_code($status);
    echo json_encode($payload);
    exit;
}

function committeeInput(): array {
    $data = json_decode(file_get_contents('php://input'), true);
    if (!is_array($data)) {
        committeeResponse(['success' => false, 'message' => 'A JSON committee record is required.'], 400);
    }

    return $data;
}

function committeeText(array $data, string $field, int $maximumLength, bool $required = false): ?string {
    $value = $data[$field] ?? null;
    if ($value === null) {
        if ($required) {
            committeeResponse(['success' => false, 'message' => 'Committee name is required.'], 400);
        }
        return null;
    }

    if (!is_string($value)) {
        committeeResponse(['success' => false, 'message' => 'Invalid ' . str_replace('_', ' ', $field) . '.'], 400);
    }

    $value = trim($value);
    if ($required && $value === '') {
        committeeResponse(['success' => false, 'message' => 'Committee name is required.'], 400);
    }
    if (!$required && $value === '') {
        return null;
    }
    if (strlen($value) > $maximumLength) {
        committeeResponse(['success' => false, 'message' => ucfirst(str_replace('_', ' ', $field)) . ' is too long.'], 400);
    }

    return $value;
}

function validatedCommittee(array $data, ?string $legacyType = null): array {
    $issuedDate = committeeText($data, 'issued_date', 10);
    if ($issuedDate !== null) {
        $date = DateTimeImmutable::createFromFormat('!Y-m-d', $issuedDate);
        if (!$date || $date->format('Y-m-d') !== $issuedDate || (int) $date->format('Y') < 1000) {
            committeeResponse(['success' => false, 'message' => 'Date issued must be a valid date in YYYY-MM-DD format.'], 400);
        }
    }

    $type = $data['type'] ?? null;
    if (!is_string($type) || (!in_array($type, ['Standing', 'Ad Hoc', 'Advisory'], true) && $type !== $legacyType)) {
        committeeResponse(['success' => false, 'message' => 'Committee Type must be Standing, Ad Hoc, or Advisory.'], 400);
    }

    $status = $data['status'] ?? 'active';
    if (!is_string($status) || !in_array($status, ['active', 'inactive', 'dissolved'], true)) {
        committeeResponse(['success' => false, 'message' => 'Status must be active, inactive, or dissolved.'], 400);
    }

    return [
        'name' => committeeText($data, 'name', 255, true),
        'type' => $type,
        'issued_date' => $issuedDate,
        'issued_by' => committeeText($data, 'issued_by', 255),
        'purpose' => committeeText($data, 'purpose', 65535),
        'mandate' => committeeText($data, 'mandate', 65535),
        'qualification_requirements' => committeeText($data, 'qualification_requirements', 65535),
        'status' => $status,
    ];
}

function committeeId(array $data): string {
    $id = $data['id'] ?? '';
    if (!is_string($id) || !preg_match(COMMITTEE_UUID_PATTERN, $id)) {
        committeeResponse(['success' => false, 'message' => 'A valid committee ID is required.'], 400);
    }

    return $id;
}

function committeeDependencies(PDO $pdo, string $committeeId): int {
    $statement = $pdo->prepare(
        'SELECT COUNT(*) FROM committee_members WHERE committee_id = :assignment_committee_id '
        . 'UNION ALL SELECT COUNT(*) FROM tasks WHERE committee_id = :task_committee_id '
        . 'UNION ALL SELECT COUNT(*) FROM jurisdictions WHERE committee_id = :jurisdiction_committee_id '
        . 'UNION ALL SELECT COUNT(*) FROM performance WHERE committee_id = :performance_committee_id '
        . 'UNION ALL SELECT COUNT(*) FROM reports WHERE committee_id = :report_committee_id '
        . 'UNION ALL SELECT COUNT(*) FROM legislative_archives WHERE committee_id = :archive_committee_id '
        . 'UNION ALL SELECT COUNT(*) FROM session_performance_logs WHERE committee_id = :session_committee_id'
    );
    $statement->execute([
        'assignment_committee_id' => $committeeId,
        'task_committee_id' => $committeeId,
        'jurisdiction_committee_id' => $committeeId,
        'performance_committee_id' => $committeeId,
        'report_committee_id' => $committeeId,
        'archive_committee_id' => $committeeId,
        'session_committee_id' => $committeeId,
    ]);

    return array_sum(array_map('intval', $statement->fetchAll(PDO::FETCH_COLUMN)));
}

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

try {
    $pdo = localPdo();

    switch ($method) {
        case 'GET':
            requirePermission('committees.view');
            $statement = $pdo->query('SELECT ' . COMMITTEE_SELECT . ' FROM committees ORDER BY created_at DESC, id DESC');
            $rows = $statement->fetchAll();
            $allowed = rbacAccessibleCommitteeIds();
            if ($allowed !== null) {
                $rows = array_values(array_filter(
                    $rows,
                    static fn(array $row): bool => in_array($row['id'] ?? '', $allowed, true)
                ));
            }
            echo json_encode($rows);
            exit;

        case 'POST':
            requirePermission('committees.create');
            $committee = validatedCommittee(committeeInput());

            // The MariaDB trigger owns UUID creation. The transaction snapshot
            // identifies exactly the one row created by this request.
            $pdo->beginTransaction();
            $before = $pdo->query('SELECT id FROM committees')->fetchAll(PDO::FETCH_COLUMN);
            $knownIds = array_fill_keys($before, true);

            $insert = $pdo->prepare(
                'INSERT INTO committees (name, type, issued_date, issued_by, purpose, mandate, qualification_requirements, status) '
                . 'VALUES (:name, :type, :issued_date, :issued_by, :purpose, :mandate, :qualification_requirements, :status)'
            );
            $insert->execute($committee);

            $createdRows = $pdo->query('SELECT ' . COMMITTEE_SELECT . ' FROM committees')->fetchAll();
            $created = array_values(array_filter($createdRows, static fn(array $row): bool => !isset($knownIds[$row['id']])));
            if (count($created) !== 1) {
                $pdo->rollBack();
                committeeResponse(['success' => false, 'message' => 'Committee was not created safely. Please try again.'], 500);
            }

            $pdo->commit();
            committeeResponse(['success' => true, 'data' => $created[0]], 201);

        case 'PUT':
            requirePermission('committees.update');
            $data = committeeInput();
            $id = committeeId($data);
            $exists = $pdo->prepare('SELECT status, type, issued_date, issued_by FROM committees WHERE id = :id');
            $exists->execute(['id' => $id]);
            $existing = $exists->fetch();
            if ($existing === false) {
                committeeResponse(['success' => false, 'message' => 'Committee not found.'], 404);
            }
            rbacAssertCommitteeAccess($id);
            $committee = validatedCommittee($data + $existing, $existing['type']);

            $pdo->beginTransaction();
            $update = $pdo->prepare(
                'UPDATE committees SET name = :name, type = :type, issued_date = :issued_date, issued_by = :issued_by, purpose = :purpose, mandate = :mandate, '
                . 'qualification_requirements = :qualification_requirements, status = :status WHERE id = :id'
            );
            $update->execute($committee + ['id' => $id]);
            $pdo->commit();

            $record = $pdo->prepare('SELECT ' . COMMITTEE_SELECT . ' FROM committees WHERE id = :id');
            $record->execute(['id' => $id]);
            committeeResponse([
                'success' => true,
                'message' => $update->rowCount() === 0 ? 'No committee changes were needed.' : 'Committee updated successfully.',
                'data' => $record->fetch(),
            ]);

        case 'DELETE':
            requirePermission('committees.delete');
            $id = committeeId(committeeInput());
            rbacAssertCommitteeAccess($id);

            $exists = $pdo->prepare('SELECT id FROM committees WHERE id = :id');
            $exists->execute(['id' => $id]);
            if ($exists->fetchColumn() === false) {
                committeeResponse(['success' => false, 'message' => 'Committee not found.'], 404);
            }

            if (committeeDependencies($pdo, $id) > 0) {
                committeeResponse([
                    'success' => false,
                    'message' => 'This committee cannot be deleted because related assignments, tasks, jurisdictions, performance records, reports, archives, or session records exist.',
                ], 409);
            }

            $delete = $pdo->prepare('DELETE FROM committees WHERE id = :id');
            $delete->execute(['id' => $id]);
            if ($delete->rowCount() !== 1) {
                committeeResponse(['success' => false, 'message' => 'Committee could not be deleted.'], 500);
            }

            committeeResponse(['success' => true, 'message' => 'Committee deleted successfully.']);

        default:
            header('Allow: GET, POST, PUT, DELETE, OPTIONS');
            committeeResponse(['success' => false, 'message' => 'Method not allowed.'], 405);
    }
} catch (DomainException $exception) {
    committeeResponse(['success'=>false, 'message'=>$exception->getMessage()], (int)$exception->getCode() ?: 400);
} catch (PDOException $exception) {
    if (isset($pdo) && $pdo instanceof PDO && $pdo->inTransaction()) {
        $pdo->rollBack();
    }

    if ($method === 'DELETE' && $exception->getCode() === '23000') {
        committeeResponse([
            'success' => false,
            'message' => 'This committee cannot be deleted because related assignments, tasks, jurisdictions, performance records, reports, archives, or session records exist.',
        ], 409);
    }

    committeeResponse(['success' => false, 'message' => 'Committees database operation failed. Please try again later.'], 500);
} catch (Throwable $exception) {
    if (isset($pdo) && $pdo instanceof PDO && $pdo->inTransaction()) {
        $pdo->rollBack();
    }
    committeeResponse(['success' => false, 'message' => 'Committees request could not be processed.'], 500);
}
