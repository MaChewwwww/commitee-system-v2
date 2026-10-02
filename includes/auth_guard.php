<?php
/**
 * Session guard for protected pages. Reuses backend auth + RBAC.
 */
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/../backend/config/auth.php';
require_once __DIR__ . '/../backend/config/rbac.php';

startAppSession();

if (!isAuthenticated()) {
    header('Location: ' . page_url('login.php'));
    exit;
}

$currentUser = currentUserContext(false, true);
if ($currentUser === null) {
    // Clear broken session and force re-login
    $_SESSION = [];
    header('Location: ' . page_url('login.php'));
    exit;
}

$currentUserEmail = $currentUser['email'];
$currentUserInitial = strtoupper(substr($currentUserEmail, 0, 1) ?: 'A');
$currentUserRole = $currentUser['role_code'];
$currentUserRoleLabel = $currentUser['role_label'];
$currentUserPermissions = $currentUser['permissions'];

if (!empty($requiredPermission) && is_string($requiredPermission)) {
    if (!userHasPermission($requiredPermission)) {
        http_response_code(403);
        require_once __DIR__ . '/app_view.php';
        render_app('forbidden');
        exit;
    }
}

function userCan(string $permission): bool {
    return userHasPermission($permission);
}
