<?php
/**
 * Jurisdictions API — local MariaDB/PDO
 */
ob_start();
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../config/auth.php';
require_once __DIR__ . '/../../config/rbac.php';

corsHeaders();
ob_clean();

const JURIS_SELECT = 'id, committee_id, area_name, category, created_at';
const JURIS_UUID = '/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i';

function jurisResponse(array $payload, int $status = 200): void {
    http_response_code($status);
    echo json_encode($payload);
    exit;
}

function jurisInput(): array {
    $data = json_decode(file_get_contents('php://input'), true);
    if (!is_array($data)) {
        jurisResponse(['success' => false, 'message' => 'A JSON jurisdiction record is required.'], 400);
    }
    return $data;
}

function jurisUuid(mixed $value, string $label): string {
    if (!is_string($value) || !preg_match(JURIS_UUID, $value)) {
        jurisResponse(['success' => false, 'message' => 'A valid ' . $label . ' is required.'], 400);
    }
    return $value;
}

function jurisExists(PDO $pdo, string $table, string $id): bool {
    $stmt = $pdo->prepare("SELECT 1 FROM {$table} WHERE id = :id LIMIT 1");
    $stmt->execute(['id' => $id]);
    return (bool) $stmt->fetchColumn();
}

function jurisRecord(PDO $pdo, string $id): ?array {
    $stmt = $pdo->prepare('SELECT ' . JURIS_SELECT . ' FROM jurisdictions WHERE id = :id LIMIT 1');
    $stmt->execute(['id' => $id]);
    $row = $stmt->fetch();
    return $row === false ? null : $row;
}

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

try {
    $pdo = localPdo();

    switch ($method) {
        case 'GET':
            requirePermission('jurisdictions.view');
            $stmt = $pdo->query('SELECT ' . JURIS_SELECT . ' FROM jurisdictions ORDER BY created_at DESC, id DESC');
            echo json_encode(rbacFilterRows($stmt->fetchAll()));
            exit;

        case 'POST':
            requirePermission('jurisdictions.create');
            $data = jurisInput();
            $committeeId = jurisUuid($data['committee_id'] ?? null, 'committee ID');
            $areaName = isset($data['area_name']) && is_string($data['area_name']) ? trim($data['area_name']) : '';
            if ($areaName === '') {
                jurisResponse(['success' => false, 'message' => 'Area name is required.'], 400);
            }
            if (mb_strlen($areaName) > 255) {
                jurisResponse(['success' => false, 'message' => 'Area name is too long.'], 400);
            }
            $category = null;
            if (isset($data['category']) && is_string($data['category']) && trim($data['category']) !== '') {
                $category = trim($data['category']);
                if (mb_strlen($category) > 100) {
                    jurisResponse(['success' => false, 'message' => 'Category is too long.'], 400);
                }
            }
            rbacAssertCommitteeAccess($committeeId);
            if (!jurisExists($pdo, 'committees', $committeeId)) {
                jurisResponse(['success' => false, 'message' => 'Committee not found.'], 404);
            }

            $pdo->beginTransaction();
            $before = $pdo->query('SELECT id FROM jurisdictions')->fetchAll(PDO::FETCH_COLUMN);
            $known = array_fill_keys($before, true);
            $insert = $pdo->prepare(
                'INSERT INTO jurisdictions (committee_id, area_name, category) VALUES (:committee_id, :area_name, :category)'
            );
            $insert->execute([
                'committee_id' => $committeeId,
                'area_name' => $areaName,
                'category' => $category,
            ]);
            $rows = $pdo->query('SELECT ' . JURIS_SELECT . ' FROM jurisdictions')->fetchAll();
            $created = array_values(array_filter($rows, static fn(array $r): bool => !isset($known[$r['id']])));
            if (count($created) !== 1) {
                $pdo->rollBack();
                jurisResponse(['success' => false, 'message' => 'Jurisdiction was not created safely.'], 500);
            }
            $pdo->commit();
            jurisResponse(['success' => true, 'message' => 'Jurisdiction created successfully.', 'data' => $created[0]], 201);

        case 'PUT':
            requirePermission('jurisdictions.update');
            $data = jurisInput();
            $id = jurisUuid($data['id'] ?? null, 'jurisdiction ID');
            $committeeId = jurisUuid($data['committee_id'] ?? null, 'committee ID');
            $areaName = isset($data['area_name']) && is_string($data['area_name']) ? trim($data['area_name']) : '';
            if ($areaName === '') {
                jurisResponse(['success' => false, 'message' => 'Area name is required.'], 400);
            }
            $category = null;
            if (isset($data['category']) && is_string($data['category']) && trim($data['category']) !== '') {
                $category = trim($data['category']);
            }
            $existing = jurisRecord($pdo, $id);
            if ($existing === null) {
                jurisResponse(['success' => false, 'message' => 'Jurisdiction not found.'], 404);
            }
            rbacAssertCommitteeAccess($existing['committee_id'] ?? null);
            rbacAssertCommitteeAccess($committeeId);
            if (!jurisExists($pdo, 'committees', $committeeId)) {
                jurisResponse(['success' => false, 'message' => 'Committee not found.'], 404);
            }
            $update = $pdo->prepare(
                'UPDATE jurisdictions SET committee_id = :committee_id, area_name = :area_name, category = :category WHERE id = :id'
            );
            $update->execute([
                'committee_id' => $committeeId,
                'area_name' => $areaName,
                'category' => $category,
                'id' => $id,
            ]);
            jurisResponse([
                'success' => true,
                'message' => 'Jurisdiction updated successfully.',
                'data' => jurisRecord($pdo, $id),
            ]);

        case 'DELETE':
            requirePermission('jurisdictions.delete');
            $data = jurisInput();
            $id = jurisUuid($data['id'] ?? null, 'jurisdiction ID');
            $existing = jurisRecord($pdo, $id);
            if ($existing === null) {
                jurisResponse(['success' => false, 'message' => 'Jurisdiction not found.'], 404);
            }
            rbacAssertCommitteeAccess($existing['committee_id'] ?? null);
            $delete = $pdo->prepare('DELETE FROM jurisdictions WHERE id = :id');
            $delete->execute(['id' => $id]);
            if ($delete->rowCount() !== 1) {
                jurisResponse(['success' => false, 'message' => 'Jurisdiction could not be deleted.'], 500);
            }
            jurisResponse(['success' => true, 'message' => 'Jurisdiction deleted successfully.']);

        default:
            header('Allow: GET, POST, PUT, DELETE, OPTIONS');
            jurisResponse(['success' => false, 'message' => 'Method not allowed.'], 405);
    }
} catch (Throwable $e) {
    if (isset($pdo) && $pdo instanceof PDO && $pdo->inTransaction()) {
        $pdo->rollBack();
    }
    error_log('Jurisdictions API error: ' . $e->getMessage());
    jurisResponse(['success' => false, 'message' => 'Unable to process jurisdiction request.'], 500);
}
