<?php
/**
 * Server-side Gemini helper.
 *
 * API key sources (never logged / never returned to clients):
 *   1. COMMITTEE_GEMINI_API_KEY (local.php or environment)
 *   2. GEMINI_API_KEY
 *
 * Default model: gemini-3.5-flash-lite (current stable; 1.5/2.0 Flash shut down).
 */
require_once __DIR__ . '/env.php';

const GEMINI_DEFAULT_MODEL = 'gemini-3.5-flash-lite';

/** Ordered fallbacks if the preferred model is unavailable (404/400) or capacity-limited (503/429). */
const GEMINI_MODEL_FALLBACKS = [
    'gemini-3.5-flash-lite',
    'gemini-3.5-flash',
    'gemini-3.8-flash',
    'gemini-3.1-flash-lite',
    'gemini-2.5-flash',
];

function geminiApiKey(): string {
    $key = committeeEnv('GEMINI_API_KEY', '');
    if ($key === '') {
        $key = committeeEnv('COMMITTEE_GEMINI_API_KEY', '');
    }
    return $key;
}

function geminiIsConfigured(): bool {
    return geminiApiKey() !== '';
}

/**
 * Configuration status safe for diagnostics (never exposes the key).
 */
function geminiConfigStatus(): string {
    return geminiIsConfigured() ? 'CONFIGURED' : 'NOT CONFIGURED';
}

/**
 * Extract a short, non-sensitive provider error detail.
 */
function geminiSanitizeProviderError(string $body, int $http): string {
    $decoded = json_decode($body, true);
    $message = '';
    if (is_array($decoded)) {
        $message = (string) ($decoded['error']['message'] ?? $decoded['message'] ?? '');
        // Strip anything that looks like a key fragment.
        $message = preg_replace('/key[=:\s]*[A-Za-z0-9_\-.]{8,}/i', 'key=[REDACTED]', $message) ?? $message;
        $message = preg_replace('/AIza[0-9A-Za-z_\-]{10,}/', '[REDACTED]', $message) ?? $message;
        $message = preg_replace('/AQ\.[0-9A-Za-z_\-]{10,}/', '[REDACTED]', $message) ?? $message;
    }

    if ($message === '') {
        return 'HTTP ' . $http;
    }

    // Keep detail short for clients.
    if (mb_strlen($message) > 180) {
        $message = mb_substr($message, 0, 177) . '...';
    }

    return 'HTTP ' . $http . ': ' . $message;
}

/**
 * Safely pull generated text from a Gemini generateContent response.
 */
function geminiExtractText(array $result): string {
    if (!isset($result['candidates']) || !is_array($result['candidates']) || $result['candidates'] === []) {
        // Prompt feedback / blocked
        $block = $result['promptFeedback']['blockReason'] ?? null;
        if (is_string($block) && $block !== '') {
            return '';
        }
        return '';
    }

    $candidate = $result['candidates'][0];
    if (!is_array($candidate)) {
        return '';
    }

    $finish = $candidate['finishReason'] ?? '';
    if (is_string($finish) && in_array(strtoupper($finish), ['SAFETY', 'RECITATION', 'BLOCKLIST', 'PROHIBITED_CONTENT'], true)) {
        return '';
    }

    $parts = $candidate['content']['parts'] ?? null;
    if (!is_array($parts)) {
        return '';
    }

    $chunks = [];
    foreach ($parts as $part) {
        if (is_array($part) && isset($part['text']) && is_string($part['text']) && $part['text'] !== '') {
            $chunks[] = $part['text'];
        }
    }

    return trim(implode("\n", $chunks));
}

/**
 * @return array{ok:bool,text?:string,json?:mixed,error?:string,details?:string,http?:int,model?:string,block_reason?:string}
 */
function geminiGenerateOnce(string $prompt, string $model, string $key): array {
    $url = 'https://generativelanguage.googleapis.com/v1beta/models/'
        . rawurlencode($model)
        . ':generateContent';

    $payload = json_encode([
        'contents' => [
            [
                'role' => 'user',
                'parts' => [['text' => $prompt]],
            ],
        ],
        'generationConfig' => [
            'temperature' => 0.4,
        ],
    ], JSON_UNESCAPED_UNICODE);

    if ($payload === false) {
        return ['ok' => false, 'error' => 'AI request failed', 'details' => 'Unable to encode prompt.', 'http' => 0];
    }

    $ch = curl_init();
    curl_setopt_array($ch, [
        CURLOPT_URL => $url,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST => true,
        CURLOPT_HTTPHEADER => [
            'Content-Type: application/json',
            'x-goog-api-key: ' . $key,
        ],
        CURLOPT_POSTFIELDS => $payload,
        CURLOPT_TIMEOUT => 60,
        CURLOPT_CONNECTTIMEOUT => 15,
        CURLOPT_SSL_VERIFYPEER => true,
    ]);

    $response = curl_exec($ch);
    $errno = curl_errno($ch);
    $error = curl_error($ch);
    $http = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($errno !== 0 || $response === false) {
        error_log('Gemini curl error model=' . $model . ' errno=' . $errno);
        return [
            'ok' => false,
            'error' => 'AI request failed',
            'details' => 'Network error talking to AI provider.',
            'http' => 0,
            'model' => $model,
        ];
    }

    $body = is_string($response) ? $response : '';
    $result = json_decode($body, true);

    if ($http >= 400) {
        $details = geminiSanitizeProviderError($body, $http);
        error_log('Gemini HTTP ' . $http . ' model=' . $model . ' detail=' . $details);
        return [
            'ok' => false,
            'error' => 'AI request failed',
            'details' => $details,
            'http' => $http,
            'model' => $model,
        ];
    }

    if (!is_array($result)) {
        return [
            'ok' => false,
            'error' => 'AI provider returned an empty or error response.',
            'details' => 'HTTP ' . $http . ': malformed JSON',
            'http' => $http,
            'model' => $model,
        ];
    }

    $block = $result['promptFeedback']['blockReason'] ?? null;
    $text = geminiExtractText($result);
    if ($text === '') {
        $reason = is_string($block) && $block !== '' ? $block : 'empty_candidates';
        error_log('Gemini empty text model=' . $model . ' reason=' . $reason);
        return [
            'ok' => false,
            'error' => 'AI provider returned an empty or blocked response.',
            'details' => 'HTTP ' . $http . ': ' . $reason,
            'http' => $http,
            'model' => $model,
            'block_reason' => is_string($block) ? $block : null,
        ];
    }

    $cleaned = preg_replace('/```json\s*|\s*```/', '', $text);
    $cleaned = is_string($cleaned) ? trim($cleaned) : trim($text);
    $decoded = null;
    $jsonStart = strpos($cleaned, '{');
    $jsonEnd = strrpos($cleaned, '}');
    if ($jsonStart !== false && $jsonEnd !== false && $jsonEnd >= $jsonStart) {
        $maybe = json_decode(substr($cleaned, $jsonStart, $jsonEnd - $jsonStart + 1), true);
        if (is_array($maybe)) {
            $decoded = $maybe;
        }
    }

    return [
        'ok' => true,
        'text' => $text,
        'json' => $decoded,
        'http' => $http,
        'model' => $model,
    ];
}

/**
 * Generate content with model fallbacks.
 *
 * Retries next model on:
 * - HTTP 503 / 429 (temporary high demand / rate limit)
 * - HTTP 404 / 400 when the model appears unavailable/unsupported
 *
 * Does NOT fallback on auth/config failures (401/403) or unrelated 400s.
 *
 * @return array{ok:bool,text?:string,json?:mixed,error?:string,details?:string,http?:int,model?:string,block_reason?:string,attempts?:list<array{model:string,http:int,category:string}>}
 */
function geminiGenerate(string $prompt, ?string $preferredModel = null): array {
    if (!geminiIsConfigured()) {
        return [
            'ok' => false,
            'error' => 'AI is not configured on the server (missing GEMINI API key).',
            'details' => 'NOT CONFIGURED',
            'http' => 0,
        ];
    }

    if (!extension_loaded('curl')) {
        return [
            'ok' => false,
            'error' => 'AI service is temporarily unavailable. Please try again later.',
            'details' => 'curl_unavailable',
            'http' => 0,
        ];
    }

    $key = geminiApiKey();
    $models = [];
    $preferred = $preferredModel ?: GEMINI_DEFAULT_MODEL;
    $models[] = $preferred;
    foreach (GEMINI_MODEL_FALLBACKS as $fallback) {
        if (!in_array($fallback, $models, true)) {
            $models[] = $fallback;
        }
    }

    $attempts = [];
    $last = [
        'ok' => false,
        'error' => 'AI service is temporarily unavailable. Please try again later.',
        'details' => 'all_models_unavailable',
        'http' => 0,
    ];

    foreach ($models as $model) {
        error_log('AI_GEMINI_ATTEMPT model=' . $model);
        $last = geminiGenerateOnce($prompt, $model, $key);
        $http = (int) ($last['http'] ?? 0);
        $category = geminiErrorCategory($last);
        $attempts[] = [
            'model' => $model,
            'http' => $http,
            'category' => $last['ok'] ? 'ok' : $category,
        ];
        error_log('AI_GEMINI_RESULT model=' . $model . ' status=' . $http);

        if ($last['ok']) {
            $last['attempts'] = $attempts;
            return $last;
        }

        // Temporary capacity / rate-limit: try next model once.
        if (in_array($http, [503, 429], true)) {
            continue;
        }

        // Model missing / unsupported: try next model.
        $details = (string) ($last['details'] ?? '');
        $modelUnavailable = in_array($http, [404, 400], true)
            && (stripos($details, 'not found') !== false
                || stripos($details, 'is not supported') !== false
                || stripos($details, 'not supported for') !== false
                || stripos($details, 'invalid model') !== false
                || ($http === 404 && stripos($details, 'model') !== false));

        if ($modelUnavailable) {
            continue;
        }

        // Auth / hard failures: stop immediately (no fallback).
        $last['attempts'] = $attempts;
        return $last;
    }

    $last['attempts'] = $attempts;
    $last['error'] = 'AI service is temporarily unavailable. Please try again later.';
    $last['details'] = 'all_models_unavailable';
    $last['message'] = $last['error'];
    return $last;
}

/**
 * Map Gemini failure to a safe error category (no secrets).
 *
 * @param array{ok?:bool,error?:string,details?:string,http?:int,block_reason?:string} $ai
 */
function geminiErrorCategory(array $ai): string {
    $details = (string) ($ai['details'] ?? '');
    if ($details === 'NOT CONFIGURED' || stripos((string) ($ai['error'] ?? ''), 'not configured') !== false) {
        return 'key_missing';
    }
    if ($details === 'all_models_unavailable' || stripos((string) ($ai['error'] ?? ''), 'temporarily unavailable') !== false) {
        return 'all_models_unavailable';
    }
    if (!extension_loaded('curl') || $details === 'curl_unavailable') {
        return 'curl_unavailable';
    }
    $http = (int) ($ai['http'] ?? 0);
    if ($http === 0 && stripos($details, 'Network') !== false) {
        return 'network_error';
    }
    if ($http === 400) {
        return 'http_400';
    }
    if ($http === 401) {
        return 'http_401';
    }
    if ($http === 403) {
        return 'http_403';
    }
    if ($http === 404) {
        return 'http_404';
    }
    if ($http === 429) {
        return 'http_429';
    }
    if ($http === 503) {
        return 'http_503';
    }
    if ($http >= 500) {
        return 'http_500';
    }
    if (stripos($details, 'malformed JSON') !== false) {
        return 'invalid_json';
    }
    if (stripos($details, 'empty_candidates') !== false) {
        return 'missing_candidates';
    }
    if (!empty($ai['block_reason'])) {
        return 'blocked_' . strtolower((string) $ai['block_reason']);
    }
    if (stripos((string) ($ai['error'] ?? ''), 'empty') !== false) {
        return 'missing_text';
    }
    return 'unknown_response';
}

/**
 * Build a client-safe AI failure payload (no secrets).
 *
 * @param array{ok?:bool,error?:string,details?:string,http?:int,block_reason?:string,model?:string} $ai
 */
function geminiClientErrorPayload(array $ai): array {
    $http = (int) ($ai['http'] ?? 0);
    $category = geminiErrorCategory($ai);
    $error = $ai['error'] ?? 'AI request failed';
    if ($category === 'all_models_unavailable') {
        $error = 'AI service is temporarily unavailable. Please try again later.';
    }
    $payload = [
        'success' => false,
        'error' => $error,
        'message' => $error,
        'details' => $ai['details'] ?? ('HTTP ' . ($http > 0 ? $http : '0')),
        'stage' => 'gemini_request',
        'error_category' => $category,
    ];
    if (stripos($category, 'missing_') === 0 || $category === 'invalid_json') {
        $payload['stage'] = 'gemini_parse';
    }
    if ($category === 'key_missing') {
        $payload['stage'] = 'key_missing';
    }
    if ($category === 'curl_unavailable' || $category === 'network_error') {
        $payload['stage'] = 'network';
    }
    if ($category === 'all_models_unavailable') {
        $payload['stage'] = 'gemini_request';
    }
    if ($http > 0) {
        $payload['provider_http'] = $http;
        $payload['http_status'] = $http;
    }
    if (!empty($ai['model'])) {
        $payload['model'] = $ai['model'];
    }
    if (!empty($ai['block_reason'])) {
        $payload['block_reason'] = $ai['block_reason'];
    }
    if (!empty($ai['attempts']) && is_array($ai['attempts'])) {
        $safeAttempts = [];
        foreach ($ai['attempts'] as $attempt) {
            if (!is_array($attempt)) {
                continue;
            }
            $safeAttempts[] = [
                'model' => (string) ($attempt['model'] ?? ''),
                'http' => (int) ($attempt['http'] ?? 0),
                'category' => (string) ($attempt['category'] ?? ''),
            ];
        }
        $payload['attempts'] = $safeAttempts;
    }
    return $payload;
}

function memberSkillsToString(mixed $skills): string {
    if (is_array($skills)) {
        return implode(', ', $skills);
    }
    if (is_string($skills) && $skills !== '') {
        $decoded = json_decode($skills, true);
        if (is_array($decoded)) {
            return implode(', ', $decoded);
        }
        return $skills;
    }
    return 'None';
}
