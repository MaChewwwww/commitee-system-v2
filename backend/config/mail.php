<?php
/**
 * SMTP settings for OTP mail (PHPMailer).
 * Credentials must come from local.php or environment — never hardcode secrets.
 */
require_once __DIR__ . '/env.php';

/**
 * @return array{host:string,port:int,user:string,password:string,from:string,from_name:string,secure:string}
 */
function committeeSmtpConfig(): array {
    return [
        'host' => committeeEnv('COMMITTEE_SMTP_HOST', 'smtp.gmail.com'),
        'port' => (int) committeeEnv('COMMITTEE_SMTP_PORT', '587'),
        'user' => committeeEnv('COMMITTEE_SMTP_USER', ''),
        'password' => committeeEnv('COMMITTEE_SMTP_PASSWORD', ''),
        'from' => committeeEnv('COMMITTEE_SMTP_FROM', ''),
        'from_name' => committeeEnv('COMMITTEE_SMTP_FROM_NAME', 'SP Committee System'),
        'secure' => committeeEnv('COMMITTEE_SMTP_SECURE', 'tls'),
    ];
}

function committeeSmtpIsConfigured(): bool {
    $c = committeeSmtpConfig();
    return $c['user'] !== '' && $c['password'] !== '' && ($c['from'] !== '' || $c['user'] !== '');
}
