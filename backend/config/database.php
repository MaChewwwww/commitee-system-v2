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

    $dbUrl = committeeEnv('DATABASE_URL', '');
    if ($dbUrl !== '') {
        $parsed = parse_url($dbUrl);
        if (is_array($parsed)) {
            $host = $parsed['host'] ?? '127.0.0.1';
            $port = (string) ($parsed['port'] ?? '3306');
            $user = isset($parsed['user']) ? urldecode($parsed['user']) : 'root';
            $password = isset($parsed['pass']) ? urldecode($parsed['pass']) : '';
            $name = ltrim($parsed['path'] ?? 'committee_management', '/');
        }
    }

    if (!isset($host)) {
        $host = committeeEnv('COMMITTEE_DB_HOST', committeeEnv('DB_HOST', '127.0.0.1'));
        $port = committeeEnv('COMMITTEE_DB_PORT', committeeEnv('DB_PORT', '3306'));
        $name = committeeEnv('COMMITTEE_DB_NAME', committeeEnv('DB_DATABASE', 'committee_management'));
        $user = committeeEnv('COMMITTEE_DB_USER', committeeEnv('DB_USERNAME', 'root'));
        $password = committeeEnv('COMMITTEE_DB_PASSWORD', committeeEnv('DB_PASSWORD', 'root'));
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
