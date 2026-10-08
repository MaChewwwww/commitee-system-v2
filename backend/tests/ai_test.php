<?php
/** Offline regression checks: no database, server, or provider requests. */
require_once __DIR__ . '/../config/ai.php';

function aiCheck(bool $condition, string $label): void {
    if (!$condition) {
        throw new RuntimeException($label);
    }
}

$missingCurl = geminiClientErrorPayload([
    'ok' => false,
    'error' => 'AI service is temporarily unavailable. Please try again later.',
    'details' => 'curl_unavailable',
    'http' => 0,
]);
aiCheck($missingCurl['error_category'] === 'curl_unavailable', 'Missing cURL must retain its diagnostic category');
aiCheck($missingCurl['stage'] === 'network', 'Missing cURL must identify the network stage');
aiCheck(geminiErrorCategory(['details' => 'all_models_unavailable']) === 'all_models_unavailable', 'Exhausted model fallbacks');
aiCheck(geminiErrorCategory(['details' => 'NOT CONFIGURED']) === 'key_missing', 'Missing API key');
aiCheck(geminiErrorCategory(['http' => 403]) === 'http_403', 'Provider authorization failure');
aiCheck(geminiErrorCategory(['http' => 429]) === 'http_429', 'Provider quota failure');
$invalidKey = geminiClientErrorPayload(['ok' => false, 'http' => 400, 'details' => 'HTTP 400: API key not valid. Please pass a valid API key.']);
aiCheck($invalidKey['error_category'] === 'key_invalid' && $invalidKey['stage'] === 'key_invalid', 'Invalid deployed key must identify the configuration failure');
aiCheck(str_contains($invalidKey['message'], 'Update the server AI key'), 'Invalid key must show an actionable error');
aiCheck(geminiErrorCategory(['http' => 400, 'details' => 'HTTP 400: API key expired. Please renew the API key.']) === 'key_invalid', 'Expired key');
aiCheck(geminiExtractText(['candidates' => [['content' => ['parts' => [['text' => 'Report summary']]], 'finishReason' => 'STOP']]]) === 'Report summary', 'Report text extraction');
aiCheck(geminiExtractText(['candidates' => [['content' => ['parts' => [['text' => 'Blocked']]], 'finishReason' => 'SAFETY']]]) === '', 'Blocked response');
echo "AI diagnostics and report response checks passed.\n";
