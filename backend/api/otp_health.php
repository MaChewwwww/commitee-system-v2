<?php
/**
 * TEMPORARY production health check for OTP/DB/SMTP.
 * DELETE this file after debugging.
 *
 * Browser URL:
 *   /backend/api/otp_health.php (administrator session and COMMITTEE_DIAGNOSTICS=1)
 *
 * Never prints passwords, API keys, or OTP codes.
 */
declare(strict_types=1);
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/auth.php';
require_once __DIR__ . '/../config/rbac.php';
if (committeeEnv('COMMITTEE_DIAGNOSTICS','0') !== '1') { http_response_code(404); exit; }
$diagnosticContext=currentUserContext();
if ($diagnosticContext['role_code'] !== 'super_admin') rbacForbidden('Administrator access required.');


header('Content-Type: application/json; charset=utf-8');
header('X-Robots-Tag: noindex');

function healthRedact(string $message): string {
    $message = preg_replace('/password[=:]\s*\S+/i', 'password=[REDACTED]', $message) ?? $message;
    $message = preg_replace("/Access denied for user '[^']*'/", "Access denied for user '[REDACTED]'", $message) ?? $message;
    $message = preg_replace('/using password:\s*(YES|NO)/i', 'using password:[MASKED]', $message) ?? $message;
    $message = preg_replace('/AIza[0-9A-Za-z_\-]{8,}/', '[REDACTED]', $message) ?? $message;
    return $message;
}

$report = [
    'timestamp' => gmdate('c'),
    'endpoint' => 'otp_health.php',
    'http_host' => $_SERVER['HTTP_HOST'] ?? '',
    'php_version' => PHP_VERSION,
    'pdo_mysql' => extension_loaded('pdo_mysql') ? 'YES' : 'NO',
];

try {
    require_once __DIR__ . '/../config/env.php';
    require_once __DIR__ . '/../config/database.php';
    require_once __DIR__ . '/../config/mail.php';

    $localPresent = is_file(__DIR__ . '/../config/local.php');
    $report['local_php_present'] = $localPresent ? 'YES' : 'NO';

    $dbHost = committeeEnv('COMMITTEE_DB_HOST', '127.0.0.1');
    $dbPort = committeeEnv('COMMITTEE_DB_PORT', '3306');
    $dbName = committeeEnv('COMMITTEE_DB_NAME', 'committee_management');
    $dbUser = committeeEnv('COMMITTEE_DB_USER', 'root');
    $dbPass = committeeEnv('COMMITTEE_DB_PASSWORD', '');

    $report['db_host'] = $dbHost;
    $report['db_port'] = $dbPort;
    $report['db_name_set'] = $dbName !== '' ? 'YES' : 'NO';
    $report['db_user_set'] = $dbUser !== '' ? 'YES' : 'NO';
    $report['db_password'] = $dbPass !== '' ? 'CONFIGURED' : 'NOT CONFIGURED';
    $report['db_using_localhost'] = in_array($dbHost, ['127.0.0.1', 'localhost'], true) ? 'YES' : 'NO';

    $smtp = committeeSmtpConfig();
    $report['smtp_host'] = $smtp['host'];
    $report['smtp_port'] = (string) $smtp['port'];
    $report['smtp_secure'] = $smtp['secure'];
    $report['smtp_user'] = $smtp['user'] !== '' ? 'CONFIGURED' : 'NOT CONFIGURED';
    $report['smtp_password'] = $smtp['password'] !== '' ? 'CONFIGURED' : 'NOT CONFIGURED';
    $report['smtp_configured'] = committeeSmtpIsConfigured() ? 'YES' : 'NO';

    try {
        $pdo = localPdo();
        $report['db_connection'] = 'OK';

        $cols = $pdo->query('SHOW COLUMNS FROM users')->fetchAll(PDO::FETCH_COLUMN);
        $report['users_has_is_active'] = in_array('is_active', $cols, true) ? 'YES' : 'NO';
        $report['users_has_role_id'] = in_array('role_id', $cols, true) ? 'YES' : 'NO';

        $tables = $pdo->query('SHOW TABLES')->fetchAll(PDO::FETCH_COLUMN);
        $report['table_otp_codes'] = in_array('otp_codes', $tables, true) ? 'YES' : 'NO';

        if (in_array('otp_codes', $tables, true)) {
            $colRows = $pdo->query('SHOW COLUMNS FROM otp_codes')->fetchAll();
            $report['otp_columns'] = array_map(static function (array $c): array {
                return [
                    'field' => $c['Field'] ?? '',
                    'type' => $c['Type'] ?? '',
                    'null' => $c['Null'] ?? '',
                    'default' => $c['Default'] ?? null,
                ];
            }, $colRows);

            $nowRow = $pdo->query('SELECT NOW() AS db_now')->fetch();
            $report['db_now'] = $nowRow['db_now'] ?? null;
            $report['php_now'] = date('Y-m-d H:i:s');
            $report['php_timezone'] = date_default_timezone_get();

            // Latest OTP meta for known accounts — never return otp_code.
            $latestStmt = $pdo->prepare(
                'SELECT email, used, expires_at, created_at,
                        (expires_at >= NOW()) AS is_unexpired,
                        (created_at >= DATE_SUB(NOW(), INTERVAL 15 MINUTE)) AS is_recent,
                        CHAR_LENGTH(otp_code) AS code_len
                 FROM otp_codes
                 WHERE LOWER(TRIM(email)) = :email
                 ORDER BY created_at DESC, id DESC
                 LIMIT 1'
            );
            $latest = [];
            foreach (['waniwangerald13@gmail.com', 'caranyagan.johnpaul.bueno@gmail.com'] as $email) {
                $latestStmt->execute(['email' => strtolower($email)]);
                $row = $latestStmt->fetch();
                if ($row === false) {
                    $latest[$email] = ['row_exists' => 'NO'];
                } else {
                    $latest[$email] = [
                        'row_exists' => 'YES',
                        'email_matches' => strtolower((string) $row['email']) === strtolower($email) ? 'YES' : 'NO',
                        'used' => ((int) $row['used'] === 1) ? 'YES' : 'NO',
                        'expires_at' => $row['expires_at'],
                        'created_at' => $row['created_at'],
                        'expired' => ((int) $row['is_unexpired'] === 1) ? 'NO' : 'YES',
                        'row_created_recently' => ((int) $row['is_recent'] === 1) ? 'YES' : 'NO',
                        'code_length' => (int) $row['code_len'],
                    ];
                }
            }
            $report['latest_otp_meta'] = $latest;
        }

        $usersOut = [];
        $stmt = $pdo->prepare(
            'SELECT u.is_active, (u.role_id IS NOT NULL) AS has_role, r.code AS role_code
             FROM users u LEFT JOIN roles r ON r.id = u.role_id
             WHERE u.email = :email LIMIT 1'
        );
        foreach (['waniwangerald13@gmail.com', 'caranyagan.johnpaul.bueno@gmail.com'] as $email) {
            $stmt->execute(['email' => $email]);
            $row = $stmt->fetch();
            $usersOut[$email] = $row === false
                ? ['exists' => 'NO']
                : [
                    'exists' => 'YES',
                    'is_active' => ((int) ($row['is_active'] ?? 0) === 1) ? 'YES' : 'NO',
                    'has_role' => ((int) ($row['has_role'] ?? 0) === 1) ? 'YES' : 'NO',
                    'role_code' => $row['role_code'] ?? null,
                ];
        }
        $report['users'] = $usersOut;

        if (in_array('otp_codes', $tables, true)) {
            try {
                $probe = 'otp.health.probe@example.test';
                $pdo->prepare(
                    'INSERT INTO otp_codes (email, otp_code, expires_at, used)
                     VALUES (:email, :otp, DATE_ADD(NOW(), INTERVAL 10 MINUTE), 0)'
                )->execute(['email' => $probe, 'otp' => '000000']);
                $pdo->prepare('DELETE FROM otp_codes WHERE email = :email')->execute(['email' => $probe]);
                $report['otp_insert'] = 'OK';
            } catch (Throwable $e) {
                $report['otp_insert'] = 'FAIL';
                $report['otp_insert_error'] = healthRedact($e->getMessage());
            }
        } else {
            $report['otp_insert'] = 'SKIPPED_NO_TABLE';
        }
    } catch (Throwable $e) {
        $report['db_connection'] = 'FAIL';
        $report['db_error'] = healthRedact($e->getMessage());
        if ($e->getPrevious() instanceof Throwable) {
            $report['db_error_detail'] = healthRedact($e->getPrevious()->getMessage());
        }
    }

    if (committeeSmtpIsConfigured()) {
        try {
            require_once __DIR__ . '/../phpmailer/PHPMailer.php';
            require_once __DIR__ . '/../phpmailer/SMTP.php';
            require_once __DIR__ . '/../phpmailer/Exception.php';
            $mail = new PHPMailer\PHPMailer\PHPMailer(true);
            $mail->isSMTP();
            $mail->Host = $smtp['host'];
            $mail->SMTPAuth = true;
            $mail->Username = $smtp['user'];
            $mail->Password = $smtp['password'];
            $mail->SMTPSecure = $smtp['secure'];
            $mail->Port = $smtp['port'];
            $mail->Timeout = 12;
            if ($mail->smtpConnect()) {
                $report['smtp_connect'] = 'OK';
                $mail->smtpClose();
            } else {
                $report['smtp_connect'] = 'FAIL';
                $report['smtp_error'] = healthRedact($mail->ErrorInfo ?: 'connect false');
            }
        } catch (Throwable $e) {
            $report['smtp_connect'] = 'FAIL';
            $report['smtp_error'] = healthRedact($e->getMessage());
        }
    } else {
        $report['smtp_connect'] = 'SKIPPED_NOT_CONFIGURED';
    }

    if (($report['db_using_localhost'] ?? '') === 'YES') {
        $report['likely_cause'] = 'PRODUCTION_STILL_USING_LOCALHOST_DB';
    } elseif (($report['db_connection'] ?? '') !== 'OK') {
        $report['likely_cause'] = 'DATABASE_CONNECTION_FAILURE';
    } elseif (($report['otp_insert'] ?? '') !== 'OK') {
        $report['likely_cause'] = 'OTP_INSERT_FAILURE';
    } elseif (($report['smtp_configured'] ?? '') !== 'YES') {
        $report['likely_cause'] = 'SMTP_NOT_CONFIGURED';
    } elseif (($report['smtp_connect'] ?? '') === 'FAIL') {
        $report['likely_cause'] = 'SMTP_CONNECTION_OR_AUTH_OR_HOST_BLOCK';
    } else {
        $report['likely_cause'] = 'DB_AND_SMTP_OK';
    }

    $report['ok'] = true;
    echo json_encode($report, JSON_PRETTY_PRINT);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'ok' => false,
        'bootstrap_error' => healthRedact($e->getMessage()),
        'local_php_present' => is_file(__DIR__ . '/../config/local.php') ? 'YES' : 'NO',
    ], JSON_PRETTY_PRINT);
}
