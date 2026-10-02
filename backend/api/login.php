<?php
/**
 * Legacy Supabase OTP login — disabled.
 * Active auth path: send_otp.php + verify_otp.php (local MariaDB).
 */
require_once '../../config/database.php';
corsHeaders();

http_response_code(410);
echo json_encode([
    'success' => false,
    'message' => 'This endpoint is retired. Use local OTP login (send_otp / verify_otp).',
    'error' => 'SUPABASE_AUTH_DISABLED',
]);
