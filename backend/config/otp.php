<?php
/**
 * Shared OTP helpers — email/code normalization and safe diagnostics.
 * Never log or return the OTP value.
 */
require_once __DIR__ . '/database.php';
require_once __DIR__ . '/auth.php';

/** OTP validity window in seconds (server/DB clock via NOW()). */
const OTP_EXPIRY_SECONDS = 300;

/**
 * SQL interval fragment for DATE_ADD(NOW(), INTERVAL …).
 * Always derived from OTP_EXPIRY_SECONDS.
 */
function otpExpirySqlInterval(): string {
    return OTP_EXPIRY_SECONDS . ' SECOND';
}

/** Human label for emails / UI copy. */
function otpExpiryHumanLabel(): string {
    if (OTP_EXPIRY_SECONDS === 60) {
        return '1 minute';
    }
    if (OTP_EXPIRY_SECONDS % 60 === 0) {
        $mins = (int) (OTP_EXPIRY_SECONDS / 60);
        return $mins === 1 ? '1 minute' : $mins . ' minutes';
    }
    return OTP_EXPIRY_SECONDS . ' seconds';
}

function otpNormalizeEmail(string $email): string {
    return strtolower(trim($email));
}

/**
 * Normalize a submitted or stored OTP to a 6-digit string (preserves leading zeros).
 */
function otpNormalizeCode(string $otp): string {
    $digits = preg_replace('/\D+/', '', trim($otp)) ?? '';
    if ($digits === '') {
        return '';
    }
    // Keep at most 6 digits from the right (handles accidental paste noise), then left-pad.
    if (strlen($digits) > 6) {
        $digits = substr($digits, -6);
    }
    return str_pad($digits, 6, '0', STR_PAD_LEFT);
}

function otpCodesMatch(string $stored, string $submitted): bool {
    $a = otpNormalizeCode($stored);
    $b = otpNormalizeCode($submitted);
    if ($a === '' || $b === '' || strlen($a) !== 6 || strlen($b) !== 6) {
        return false;
    }
    return hash_equals($a, $b);
}

function otpSafeDiagEnabled(?array $data): bool {
    return is_array($data) && (($data['diag'] ?? '') === 'CM-OTP-DIAG-2026');
}

function otpRedactError(Throwable $e): string {
    $safe = preg_replace('/password[=:]\s*\S+/i', 'password=[REDACTED]', $e->getMessage()) ?? 'error';
    $safe = preg_replace("/Access denied for user '[^']*'/", "Access denied for user '[REDACTED]'", $safe) ?? $safe;
    return $safe;
}

/**
 * PDO mysqlnd + native prepares often returns TINYINT(1) / boolean SQL
 * expressions as 1-byte binary strings "\x00" / "\x01".
 * (int)"\x01" === 0 in PHP — which falsely marks valid OTPs as expired/unused.
 */
function otpDbFlag(mixed $value): int {
    if ($value === true || $value === 1 || $value === '1') {
        return 1;
    }
    if ($value === false || $value === 0 || $value === '0' || $value === null || $value === '') {
        return 0;
    }
    if (is_string($value) && strlen($value) === 1) {
        $ord = ord($value);
        if ($ord === 0 || $ord === 1) {
            return $ord;
        }
    }
    return (int) $value;
}

