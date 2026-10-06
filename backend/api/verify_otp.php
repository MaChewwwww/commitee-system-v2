<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/auth.php';
require_once __DIR__ . '/../config/otp.php';
corsHeaders();

$data  = json_decode(file_get_contents('php://input'), true);
$email = is_array($data) ? otpNormalizeEmail((string) ($data['email'] ?? '')) : '';
$otp   = is_array($data) ? otpNormalizeCode((string) ($data['otp'] ?? '')) : '';
$diag  = otpSafeDiagEnabled(is_array($data) ? $data : null);

function verifyFail(string $userMessage, string $reason, bool $diag): void {
    error_log('verify_otp fail reason=' . $reason);
    $payload = ['success' => false, 'message' => $userMessage];
    if ($diag) {
        $payload['fail_reason'] = $reason;
    }
    echo json_encode($payload);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL) || !preg_match('/^\d{6}$/D', $otp)) {
    echo json_encode(['success' => false, 'message' => 'Email and OTP required']);
    exit;
}

try {
    $pdo = localPdo();

    // Newest CURRENT VALID OTP only. Ignore used/expired rows even if their
    // created_at sorts higher (production has historical timestamp anomalies).
    $otpStatement = $pdo->prepare(
        'SELECT id, otp_code, expires_at, used, created_at
         FROM otp_codes
         WHERE LOWER(TRIM(email)) = :email
           AND used = 0
           AND expires_at >= NOW()
         ORDER BY created_at DESC, id DESC
         LIMIT 1'
    );
    $otpStatement->execute(['email' => $email]);
    $otpRecord = $otpStatement->fetch();

    if ($otpRecord === false) {
        verifyFail('Invalid or expired OTP', 'otp_no_valid_row', $diag);
    }

    $storedCode = (string) ($otpRecord['otp_code'] ?? '');
    if (!otpCodesMatch($storedCode, $otp)) {
        verifyFail('Invalid or expired OTP', 'otp_mismatch', $diag);
    }

    $userStatement = $pdo->prepare(
        'SELECT u.id, u.email, u.role_id, u.member_id, u.is_active,
                r.code AS role_code, r.label AS role_label
         FROM users u
         LEFT JOIN roles r ON r.id = u.role_id
         WHERE LOWER(TRIM(u.email)) = :email
         LIMIT 1'
    );
    $userStatement->execute(['email' => $email]);
    $userData = $userStatement->fetch();

    if ($userData === false) {
        echo json_encode(['success' => false, 'message' => 'User account not found']);
        exit;
    }

    if (otpDbFlag($userData['is_active'] ?? 0) !== 1) {
        echo json_encode(['success' => false, 'message' => 'Account is inactive']);
        exit;
    }

    if (empty($userData['role_id']) || empty($userData['role_code'])) {
        echo json_encode(['success' => false, 'message' => 'No role assigned to this account']);
        exit;
    }

    // Mark used only after successful comparison. Confirm via SELECT + otpDbFlag
    // (do not trust PDO::rowCount on MySQL/MariaDB).
    $markUsedStatement = $pdo->prepare(
        'UPDATE otp_codes
         SET used = 1
         WHERE id = :id
           AND used = 0
           AND expires_at >= NOW()'
    );
    $markUsedStatement->execute(['id' => $otpRecord['id']]);

    $confirm = $pdo->prepare(
        'SELECT used FROM otp_codes WHERE id = :id LIMIT 1'
    );
    $confirm->execute(['id' => $otpRecord['id']]);
    $usedFlag = $confirm->fetchColumn();
    if (otpDbFlag($usedFlag) !== 1) {
        verifyFail('Invalid or expired OTP', 'otp_consume_failed', $diag);
    }
} catch (Throwable $exception) {
    error_log('verify_otp exception: ' . otpRedactError($exception));
    http_response_code(500);
    $payload = ['success' => false, 'message' => 'Unable to verify OTP. Please try again later.'];
    if ($diag) {
        $payload['fail_reason'] = 'exception';
        $payload['error_safe'] = otpRedactError($exception);
    }
    echo json_encode($payload);
    exit;
}

startAppSession();
session_regenerate_id(true);
$_SESSION['email'] = (string) $userData['email'];
$_SESSION['user_id'] = (string) $userData['id'];
$_SESSION['role_code'] = (string) $userData['role_code'];

echo json_encode([
    'success' => true,
    'message' => 'Login successful',
    'user' => [
        'id' => $userData['id'],
        'email' => $userData['email'],
        'role' => $userData['role_code'],
        'role_label' => $userData['role_label'],
        'member_id' => !empty($userData['member_id']) ? $userData['member_id'] : null,
    ],
]);
?>
