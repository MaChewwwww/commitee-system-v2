<?php
ob_start();

require_once __DIR__ . '/env.php';

/**
 * Legacy Supabase stubs — runtime disabled. No live credentials.
 * Active application APIs use localPdo() only.
 */
if (!defined('SUPABASE_RUNTIME_DISABLED')) {
    define('SUPABASE_RUNTIME_DISABLED', true);
}
if (!defined('SUPABASE_URL')) {
    define('SUPABASE_URL', '');
}
if (!defined('SUPABASE_ANON_KEY')) {
    define('SUPABASE_ANON_KEY', '');
}
if (!defined('SUPABASE_API')) {
    define('SUPABASE_API', '');
}

/**
 * @deprecated Supabase runtime is disabled. All modules use local MariaDB via localPdo().
 */
function supabaseRequest($endpoint, $method = 'GET', $data = null) {
    error_log('Blocked supabaseRequest call to: ' . $endpoint . ' (' . $method . ')');
    return [
        'success' => false,
        'message' => 'Supabase runtime is disabled. Use the local MariaDB APIs.',
        'error' => 'SUPABASE_DISABLED',
    ];
}

/**
 * MariaDB/MySQL PDO connection.
 * Credentials: COMMITTEE_DB_* via backend/config/local.php or environment.
 * Local XAMPP defaults: 127.0.0.1 / committee_management / root / (empty password).
 */
function localPdo(): PDO {
    static $pdo = null;

    if ($pdo instanceof PDO) {
        return $pdo;
    }

    $host = committeeEnv('COMMITTEE_DB_HOST', 'sql312.infinityfree.com');
    $port = committeeEnv('COMMITTEE_DB_PORT', '3306');
    $name = committeeEnv('COMMITTEE_DB_NAME', 'if0_43029446_committee_management');
    $user = committeeEnv('COMMITTEE_DB_USER', 'if0_43029446');
    $password = committeeEnv('COMMITTEE_DB_PASSWORD', 'ClEtJTtYinYqm');

    // Warn when a public host is using XAMPP localhost defaults (common InfinityFree misconfig).
    $httpHost = (string) ($_SERVER['HTTP_HOST'] ?? '');
    if ($httpHost !== ''
        && !preg_match('/^(localhost|127\.0\.0\.1)(:\d+)?$/i', $httpHost)
        && in_array($host, ['127.0.0.1', 'localhost'], true)
    ) {
        error_log(
            'DB misconfiguration: HTTP host is remote but COMMITTEE_DB_HOST is localhost. '
            . 'Create backend/config/local.php with the InfinityFree MySQL hostname from the control panel.'
        );
    }

    try {
        $pdo = new PDO(
            "mysql:host={$host};port={$port};dbname={$name};charset=utf8mb4",
            $user,
            $password,
            [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ]
        );
    } catch (PDOException $exception) {
        error_log('Database connection failed: ' . $exception->getMessage());
        throw new RuntimeException('Local database connection failed.', 0, $exception);
    }

    return $pdo;
}

function corsHeaders() {
    ob_clean();
    // Same-origin app: do not reflect arbitrary Origin. Keep JSON Content-Type.
    header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    header('Content-Type: application/json');
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(204);
        exit(0);
    }
}
?>
