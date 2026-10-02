<?php
require_once __DIR__ . '/env.php';

/**
 * Start PHP session with deployment-safe cookie flags.
 * Secure flag only when request is HTTPS (local HTTP still works).
 */
function startAppSession(): void {
    if (session_status() !== PHP_SESSION_NONE) {
        return;
    }

    $secure = function_exists('committeeIsHttps') ? committeeIsHttps() : false;
    session_set_cookie_params([
        'lifetime' => 0,
        'path' => '/',
        'secure' => $secure,
        'httponly' => true,
        'samesite' => 'Lax',
    ]);
    session_start();
}

function isAuthenticated(): bool {
    startAppSession();
    return !empty($_SESSION['email']);
}

function requireAuthenticatedApi(): void {
    if (!isAuthenticated()) {
        http_response_code(401);
        echo json_encode(['authenticated' => false, 'message' => 'Authentication required']);
        exit;
    }
}
