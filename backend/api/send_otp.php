<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/mail.php';
require_once __DIR__ . '/../config/otp.php';
require_once __DIR__ . '/../phpmailer/PHPMailer.php';
require_once __DIR__ . '/../phpmailer/SMTP.php';
require_once __DIR__ . '/../phpmailer/Exception.php';
corsHeaders();

$data = json_decode(file_get_contents('php://input'), true);
$email = is_array($data) ? otpNormalizeEmail((string) ($data['email'] ?? '')) : '';
$diag = otpSafeDiagEnabled(is_array($data) ? $data : null);

function sendOtpFail(string $userMessage, string $stage, Throwable $e, bool $diag, int $status = 500): void {
    error_log('send_otp stage=' . $stage . ' err=' . otpRedactError($e));
    http_response_code($status);
    $payload = ['success' => false, 'message' => $userMessage];
    if ($diag) {
        $payload['fail_stage'] = $stage;
        $payload['error_safe'] = otpRedactError($e);
    }
    echo json_encode($payload);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Valid email required']);
    exit;
}

try {
    $pdo = localPdo();
} catch (Throwable $exception) {
    sendOtpFail('Unable to create OTP. Please try again later.', 'db_connect', $exception, $diag);
}

try {
    $userStatement = $pdo->prepare(
        'SELECT id, is_active, email FROM users WHERE LOWER(TRIM(email)) = :email LIMIT 1'
    );
    $userStatement->execute(['email' => $email]);
    $user = $userStatement->fetch();
} catch (Throwable $exception) {
    sendOtpFail('Unable to create OTP. Please try again later.', 'user_lookup', $exception, $diag);
}

if ($user === false) {
    echo json_encode(['success' => false, 'message' => 'Email not registered in system']);
    exit;
}

if (array_key_exists('is_active', $user) && (int) $user['is_active'] !== 1) {
    echo json_encode(['success' => false, 'message' => 'Account is inactive']);
    exit;
}

// Persist against the canonical users.email value (case-consistent with verify).
$canonicalEmail = otpNormalizeEmail((string) $user['email']);

try {
    $otp = str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);

    $pdo->beginTransaction();

    // Invalidate prior unused OTPs so verify always targets the newest code.
    $invalidate = $pdo->prepare(
        'UPDATE otp_codes SET used = 1
         WHERE LOWER(TRIM(email)) = :email AND used = 0'
    );
    $invalidate->execute(['email' => $canonicalEmail]);

    $otpStatement = $pdo->prepare(
        'INSERT INTO otp_codes (email, otp_code, expires_at, used)
         VALUES (:email, :otp_code, DATE_ADD(NOW(), INTERVAL ' . OTP_EXPIRY_SECONDS . ' SECOND), 0)'
    );
    $otpStatement->execute([
        'email' => $canonicalEmail,
        'otp_code' => $otp,
    ]);

    $pdo->commit();
    error_log("[LOCAL OTP] Generated OTP for {$canonicalEmail}: {$otp}");
} catch (Throwable $exception) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    sendOtpFail('Unable to create OTP. Please try again later.', 'otp_insert', $exception, $diag);
}

if (!committeeSmtpIsConfigured()) {
    error_log('OTP email skipped: SMTP not configured (set COMMITTEE_SMTP_* in backend/config/local.php)');
    http_response_code(503);
    $payload = [
        'success' => false,
        'message' => 'Email delivery is not configured on this server.',
    ];
    if ($diag) {
        $payload['fail_stage'] = 'smtp_not_configured';
    }
    echo json_encode($payload);
    exit;
}

try {
    $smtp = committeeSmtpConfig();
    $from = $smtp['from'] !== '' ? $smtp['from'] : $smtp['user'];

    $mail = new PHPMailer\PHPMailer\PHPMailer(true);
    $mail->isSMTP();
    $mail->Host       = $smtp['host'];
    $mail->SMTPAuth   = true;
    $mail->Username   = $smtp['user'];
    $mail->Password   = $smtp['password'];
    $mail->SMTPSecure = $smtp['secure'];
    $mail->Port       = $smtp['port'];
    $mail->Timeout    = 20;
    $mail->setFrom($from, $smtp['from_name']);
    $mail->addAddress($canonicalEmail);
    $mail->Subject = 'Your OTP Code - SP Committee System';
    $mail->Body    = 'Your OTP code is: ' . $otp . "\n\nThis code expires in " . otpExpiryHumanLabel() . ".\n\nSP Committee Management System";
    $mail->send();
    $isLocal = (committeeEnv('APP_ENV') === 'local') || in_array($_SERVER['HTTP_HOST'] ?? '', ['localhost:8000', '127.0.0.1:8000', 'localhost', '127.0.0.1']);
    $msg = $isLocal ? "OTP sent to your email! (Local code: {$otp})" : 'OTP sent successfully';
    echo json_encode(['success' => true, 'message' => $msg, 'dev_otp' => $isLocal ? $otp : null]);
} catch (Exception $e) {
    error_log('OTP email delivery failed: ' . otpRedactError($e));
    $isLocal = (committeeEnv('APP_ENV') === 'local') || in_array($_SERVER['HTTP_HOST'] ?? '', ['localhost:8000', '127.0.0.1:8000', 'localhost', '127.0.0.1']);
    if ($isLocal) {
        error_log("[LOCAL OTP FALLBACK] Mail delivery failed, but OTP {$otp} was generated for {$canonicalEmail}");
        echo json_encode(['success' => true, 'message' => "OTP code: {$otp}", 'dev_otp' => $otp]);
        exit;
    }
    $payload = ['success' => false, 'message' => 'Email delivery failed. Please try again later.'];
    if ($diag) {
        $payload['fail_stage'] = 'smtp_send';
        $payload['error_safe'] = otpRedactError($e);
        $payload['smtp_host'] = $smtp['host'] ?? '';
        $payload['smtp_port'] = $smtp['port'] ?? '';
        $payload['smtp_user'] = !empty($smtp['user']) ? 'CONFIGURED' : 'NOT CONFIGURED';
        $payload['smtp_password'] = !empty($smtp['password']) ? 'CONFIGURED' : 'NOT CONFIGURED';
    }
    echo json_encode($payload);
}
?>
