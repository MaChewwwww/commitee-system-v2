<?php
/**
 * Roles list (read-only) for user management forms.
 */
ob_start();
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../config/auth.php';
require_once __DIR__ . '/../../config/rbac.php';

corsHeaders();
ob_clean();
requirePermission('users.view');

$pdo = localPdo();
$rows = $pdo->query('SELECT id, code, label, description FROM roles ORDER BY label ASC')->fetchAll();
echo json_encode(['success' => true, 'data' => $rows]);
