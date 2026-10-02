<?php
require_once __DIR__ . '/includes/config.php';
require_once __DIR__ . '/backend/config/auth.php';

startAppSession();

if (!isAuthenticated()) {
    header('Location: ' . page_url('login.php'));
    exit;
}

header('Location: ' . page_url('dashboard.php'));
exit;
