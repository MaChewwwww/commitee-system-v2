<?php
$requiredPermission = 'dashboard.view';
require_once __DIR__ . '/../includes/auth_guard.php';
require_once __DIR__ . '/../includes/app_view.php';
render_app('dashboard');