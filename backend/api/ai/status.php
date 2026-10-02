<?php
/**
 * Safe AI configuration status (no secrets).
 * GET → { success, config_status: CONFIGURED|NOT CONFIGURED, default_model }
 */
ob_start();
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../config/auth.php';
require_once __DIR__ . '/../../config/rbac.php';
require_once __DIR__ . '/../../config/ai.php';

corsHeaders();
ob_clean();
requirePermission('ai.use');

echo json_encode([
    'success' => true,
    'config_status' => geminiConfigStatus(),
    'default_model' => GEMINI_DEFAULT_MODEL,
    'key_configured' => geminiIsConfigured(),
    'key_length' => strlen(geminiApiKey()),
    'curl_available' => extension_loaded('curl'),
    'gemini_host' => 'generativelanguage.googleapis.com',
    'sapi' => PHP_SAPI,
    'php_version' => PHP_VERSION,
]);
