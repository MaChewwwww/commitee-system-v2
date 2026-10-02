<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/auth.php';
require_once __DIR__ . '/../config/rbac.php';

corsHeaders();
startAppSession();

if (!isAuthenticated()) {
    echo json_encode(['authenticated' => false]);
    exit;
}

try {
    echo json_encode(rbacSessionPayload());
} catch (Throwable $e) {
    // Authenticated session but RBAC context unavailable (inactive / no role)
    http_response_code(403);
    echo json_encode([
        'authenticated' => true,
        'success' => false,
        'message' => $e->getMessage() ?: 'Access denied',
        'error' => 'FORBIDDEN',
    ]);
}
