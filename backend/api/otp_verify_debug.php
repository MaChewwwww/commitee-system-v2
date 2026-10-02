<?php
/**
 * TEMPORARY read-only OTP verification diagnostic for InfinityFree.
 * DELETE this file after debugging.
 *
 * POST JSON: { "email": "...", "otp": "......" }
 *
 * Does NOT:
 * - authenticate
 * - mark OTP used
 * - modify any row
 * - send email
 * - return OTP values, passwords, or keys
 *
 * URL: /backend/api/otp_verify_debug.php
 */
declare(strict_types=1);

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/otp.php';

corsHeaders();

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
    http_response_code(405);
    header('Allow: POST');
    echo json_encode(['success' => false, 'message' => 'POST required']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
if (!is_array($data)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'JSON body required']);
    exit;
}

$emailRaw = (string) ($data['email'] ?? '');
$otpRaw = (string) ($data['otp'] ?? '');

$email = otpNormalizeEmail($emailRaw);
$otp = otpNormalizeCode($otpRaw);

$out = [
    'success' => false,
    'endpoint' => 'otp_verify_debug.php',
    'temporary' => true,
    'php_version' => PHP_VERSION,
    'php_timezone' => date_default_timezone_get(),
    'php_now' => date('Y-m-d H:i:s'),
    'email_valid' => (bool) filter_var($email, FILTER_VALIDATE_EMAIL),
    // Hash only — never echo the email (still identifies which account was tested without dumping PII in logs accidentally; use short hash).
    'normalized_email_hash' => $email !== '' ? substr(hash('sha256', $email), 0, 12) : '',
    'submitted_otp_length' => strlen($otp),
    'submitted_otp_format_ok' => (bool) preg_match('/^\d{6}$/D', $otp),
];

try {
    $pdo = localPdo();

    $tz = $pdo->query(
        'SELECT NOW() AS db_now,
                @@session.time_zone AS session_timezone,
                @@global.time_zone AS global_timezone'
    )->fetch();

    $out['db_now'] = $tz['db_now'] ?? null;
    $out['db_timezone'] = [
        'session' => $tz['session_timezone'] ?? null,
        'global' => $tz['global_timezone'] ?? null,
    ];

    // Same newest-row query shape as verify_otp.php (read-only).
    $otpStatement = $pdo->prepare(
        'SELECT id, otp_code, expires_at, used, created_at
         FROM otp_codes
         WHERE LOWER(TRIM(email)) = :email
         ORDER BY created_at DESC, id DESC
         LIMIT 1'
    );
    $otpStatement->execute(['email' => $email]);
    $otpRecord = $otpStatement->fetch();

    if ($otpRecord === false) {
        $out['otp_row_exists'] = false;
        $out['otp_created_at'] = null;
        $out['otp_expires_at'] = null;
        $out['otp_used_raw_type'] = null;
        $out['otp_used_normalized'] = null;
        $out['otp_expired'] = null;
        $out['stored_otp_length'] = null;
        $out['otp_matches'] = false;
        $out['fail_hint'] = 'otp_row_not_found';
    } else {
        $usedRaw = $otpRecord['used'] ?? null;
        $stored = (string) ($otpRecord['otp_code'] ?? '');
        $submitted = (string) $otp;

        $unexpired = $pdo->prepare(
            'SELECT id FROM otp_codes
             WHERE id = :id AND expires_at >= NOW()
             LIMIT 1'
        );
        $unexpired->execute(['id' => $otpRecord['id']]);
        $isUnexpired = $unexpired->fetch() !== false;

        $out['otp_row_exists'] = true;
        $out['otp_created_at'] = $otpRecord['created_at'] ?? null;
        $out['otp_expires_at'] = $otpRecord['expires_at'] ?? null;
        $out['otp_used_raw_type'] = gettype($usedRaw);
        if (is_string($usedRaw)) {
            $out['otp_used_raw_strlen'] = strlen($usedRaw);
            $out['otp_used_raw_ord'] = strlen($usedRaw) === 1 ? ord($usedRaw) : null;
        } else {
            $out['otp_used_raw_strlen'] = null;
            $out['otp_used_raw_ord'] = null;
        }
        $out['otp_used_normalized'] = otpDbFlag($usedRaw);
        $out['otp_expired'] = !$isUnexpired;
        $out['stored_otp_length'] = strlen($stored);
        $out['submitted_otp_length_for_compare'] = strlen($submitted);
        $out['otp_matches'] = otpCodesMatch($stored, $submitted);

        if (otpDbFlag($usedRaw) !== 0) {
            $out['fail_hint'] = 'otp_already_used';
        } elseif (!$isUnexpired) {
            $out['fail_hint'] = 'otp_expired';
        } elseif (!$out['otp_matches']) {
            $out['fail_hint'] = 'otp_mismatch';
        } else {
            $out['fail_hint'] = 'otp_would_pass_code_checks';
        }
    }

    $userStatement = $pdo->prepare(
        'SELECT u.id, u.is_active, u.role_id, r.code AS role_code
         FROM users u
         LEFT JOIN roles r ON r.id = u.role_id
         WHERE LOWER(TRIM(u.email)) = :email
         LIMIT 1'
    );
    $userStatement->execute(['email' => $email]);
    $user = $userStatement->fetch();

    if ($user === false) {
        $out['user_exists'] = false;
        $out['user_active'] = false;
        $out['user_has_role'] = false;
    } else {
        $out['user_exists'] = true;
        $out['user_active'] = otpDbFlag($user['is_active'] ?? 0) === 1;
        $out['user_has_role'] = !empty($user['role_id']) && !empty($user['role_code']);
        $out['user_role_code'] = $user['role_code'] ?? null;
    }

    $out['success'] = true;
    echo json_encode($out, JSON_PRETTY_PRINT);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Diagnostic failed',
        'error_safe' => otpRedactError($e),
        'php_version' => PHP_VERSION,
        'php_timezone' => date_default_timezone_get(),
        'php_now' => date('Y-m-d H:i:s'),
    ], JSON_PRETTY_PRINT);
}
