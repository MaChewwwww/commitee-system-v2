<?php
/** Shared penalty matrix; governed by jurisdiction permissions. */
ob_start();
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../config/auth.php';
require_once __DIR__ . '/../../config/rbac.php';
corsHeaders();
ob_clean();

function penaltyResponse(array $data, int $status = 200): void {
    http_response_code($status);
    echo json_encode($data);
    exit;
}

function penaltyFields(array $data): array {
    $fields = [];
    foreach (['violation', 'legal_basis', 'first_offense', 'second_offense', 'third_offense'] as $field) {
        $value = $data[$field] ?? null;
        if (!is_string($value) || trim($value) === '' || mb_strlen(trim($value)) > 255) {
            penaltyResponse(['success' => false, 'message' => ucfirst(str_replace('_', ' ', $field)) . ' is required and must be at most 255 characters.'], 400);
        }
        $fields[$field] = trim($value);
    }
    return $fields;
}

try {
    $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
    $permission = ['GET'=>'view', 'POST'=>'create', 'PUT'=>'update', 'DELETE'=>'delete'][$method] ?? null;
    if ($permission === null) {
        header('Allow: GET, POST, PUT, DELETE, OPTIONS');
        penaltyResponse(['success'=>false, 'message'=>'Method not allowed.'], 405);
    }
    requirePermission('jurisdictions.' . $permission);
    if ($method !== 'GET' && !rbacIsGlobalRole()) rbacForbidden('Council-wide permission is required to maintain the penalty catalog.');
    $pdo = localPdo();
    if ($method === 'GET') {
        echo json_encode($pdo->query('SELECT id, violation, legal_basis, first_offense, second_offense, third_offense, created_at FROM penalties ORDER BY created_at DESC, id DESC')->fetchAll());
        exit;
    }
    $data = json_decode(file_get_contents('php://input'), true);
    if (!is_array($data)) penaltyResponse(['success'=>false, 'message'=>'A JSON penalty record is required.'], 400);
    if ($method === 'POST') {
        $fields = penaltyFields($data);
        $id = $pdo->query('SELECT UUID()')->fetchColumn();
        $statement = $pdo->prepare('INSERT INTO penalties (id, violation, legal_basis, first_offense, second_offense, third_offense) VALUES (:id, :violation, :legal_basis, :first_offense, :second_offense, :third_offense)');
        $statement->execute(['id'=>$id] + $fields);
        penaltyResponse(['success'=>true, 'message'=>'Penalty created successfully.'], 201);
    }
    $id = $data['id'] ?? null;
    if (!is_string($id) || !preg_match('/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i', $id)) {
        penaltyResponse(['success'=>false, 'message'=>'A valid penalty ID is required.'], 400);
    }
    $existing = $pdo->prepare('SELECT id FROM penalties WHERE id = :id');
    $existing->execute(['id'=>$id]);
    if ($existing->fetchColumn() === false) penaltyResponse(['success'=>false, 'message'=>'Penalty not found.'], 404);
    if ($method === 'PUT') {
        $fields = penaltyFields($data);
        $statement = $pdo->prepare('UPDATE penalties SET violation = :violation, legal_basis = :legal_basis, first_offense = :first_offense, second_offense = :second_offense, third_offense = :third_offense WHERE id = :id');
        $statement->execute(['id'=>$id] + $fields);
        penaltyResponse(['success'=>true, 'message'=>'Penalty updated successfully.']);
    }
    $statement = $pdo->prepare('DELETE FROM penalties WHERE id = :id');
    $statement->execute(['id'=>$id]);
    penaltyResponse(['success'=>true, 'message'=>'Penalty deleted successfully.']);
} catch (Throwable $error) {
    error_log('Penalty API error: ' . $error->getMessage());
    penaltyResponse(['success'=>false, 'message'=>'Unable to process penalty request.'], 500);
}
