<?php
/**
 * TEMPORARY Gemini health probe for InfinityFree.
 * DELETE after debugging.
 *
 * GET /backend/api/ai_health.php?k=CM-AI-DIAG-2026
 * Or authenticated session with ai.use.
 *
 * Never returns API keys or full Gemini bodies.
 */
declare(strict_types=1);

ob_start();
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/auth.php';
require_once __DIR__ . '/../config/rbac.php';
require_once __DIR__ . '/../config/ai.php';

corsHeaders();
ob_clean();

$diagKey = (string) ($_GET['k'] ?? '');
if (!hash_equals('CM-AI-DIAG-2026', $diagKey)) {
    requirePermission('ai.use');
}

$keyConfigured = geminiIsConfigured();
$keyLength = strlen(geminiApiKey());

$out = [
    'success' => false,
    'endpoint' => 'ai_health.php',
    'temporary' => true,
    'php_version' => PHP_VERSION,
    'curl_available' => extension_loaded('curl'),
    'openssl' => extension_loaded('openssl'),
    'key_configured' => $keyConfigured,
    'key_length' => $keyLength,
    'model' => GEMINI_DEFAULT_MODEL,
    'fallback_models' => array_values(array_unique(array_merge([GEMINI_DEFAULT_MODEL], GEMINI_MODEL_FALLBACKS))),
    'gemini_host' => 'generativelanguage.googleapis.com',
    'http_status' => 0,
    'response_received' => false,
    'response_json_valid' => false,
    'text_received' => false,
    'model_used' => null,
    'attempts' => [],
    'error_category' => null,
    'stage' => null,
    'details_safe' => null,
];

if (!extension_loaded('curl')) {
    $out['stage'] = 'network';
    $out['error_category'] = 'curl_unavailable';
    echo json_encode($out, JSON_PRETTY_PRINT);
    exit;
}

if (!$keyConfigured) {
    $out['stage'] = 'key_missing';
    $out['error_category'] = 'key_missing';
    echo json_encode($out, JSON_PRETTY_PRINT);
    exit;
}

$ai = geminiGenerate('Reply with exactly: AI_OK');

$out['http_status'] = (int) ($ai['http'] ?? 0);
$out['model_used'] = $ai['model'] ?? null;
$out['response_received'] = array_key_exists('http', $ai);
$out['attempts'] = [];
if (!empty($ai['attempts']) && is_array($ai['attempts'])) {
    foreach ($ai['attempts'] as $attempt) {
        if (!is_array($attempt)) {
            continue;
        }
        $out['attempts'][] = [
            'model' => (string) ($attempt['model'] ?? ''),
            'http' => (int) ($attempt['http'] ?? 0),
            'category' => (string) ($attempt['category'] ?? ''),
        ];
    }
}

if (!empty($ai['ok'])) {
    $text = (string) ($ai['text'] ?? '');
    $out['success'] = true;
    $out['stage'] = 'ok';
    $out['response_json_valid'] = true;
    $out['text_received'] = ($text !== '');
    $out['text_contains_ai_ok'] = (stripos($text, 'AI_OK') !== false);
    echo json_encode($out, JSON_PRETTY_PRINT);
    exit;
}

$payload = geminiClientErrorPayload($ai);
$out['success'] = false;
$out['stage'] = $payload['stage'] ?? 'gemini_request';
$out['error_category'] = $payload['error_category'] ?? 'unknown_response';
$out['details_safe'] = $payload['details'] ?? null;
$out['message'] = $payload['message'] ?? $payload['error'] ?? null;

echo json_encode($out, JSON_PRETTY_PRINT);
