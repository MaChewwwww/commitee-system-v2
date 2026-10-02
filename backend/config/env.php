<?php
/**
 * Shared environment lookup for deployment (local XAMPP + shared hosting).
 *
 * Priority:
 *   1. backend/config/local.php (array return) — preferred on InfinityFree
 *   2. getenv / $_SERVER / $_ENV / apache_getenv
 *
 * Never commit local.php with real secrets.
 */
/**
 * Parse and load .env file from workspace root if present.
 */
function committeeLoadEnvFile(): array {
    static $env = null;
    if ($env !== null) {
        return $env;
    }
    $env = [];
    $locations = [
        __DIR__ . '/../../.env',
        __DIR__ . '/.env',
    ];
    foreach ($locations as $path) {
        if (is_file($path)) {
            $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
            if (is_array($lines)) {
                foreach ($lines as $line) {
                    $line = trim($line);
                    if ($line === '' || str_starts_with($line, '#')) {
                        continue;
                    }
                    $eq = strpos($line, '=');
                    if ($eq !== false) {
                        $key = trim(substr($line, 0, $eq));
                        $val = trim(substr($line, $eq + 1));
                        if ((str_starts_with($val, '"') && str_ends_with($val, '"')) ||
                            (str_starts_with($val, "'") && str_ends_with($val, "'"))) {
                            $val = substr($val, 1, -1);
                        }
                        $env[$key] = $val;
                        if (!isset($_ENV[$key])) {
                            $_ENV[$key] = $val;
                        }
                        if (!isset($_SERVER[$key])) {
                            $_SERVER[$key] = $val;
                        }
                        putenv("{$key}={$val}");
                    }
                }
            }
            break;
        }
    }
    return $env;
}

function committeeLoadLocalConfig(): array {
    static $local = null;
    if ($local !== null) {
        return $local;
    }
    $path = __DIR__ . '/local.php';
    if (is_file($path)) {
        $data = require $path;
        $local = is_array($data) ? $data : [];
    } else {
        $local = [];
    }
    return $local;
}

/**
 * @param string|null $default Returned when unset/empty (null means truly unset → caller decides).
 */
function committeeEnv(string $name, ?string $default = ''): string {
    // 1. .env file
    $dotEnv = committeeLoadEnvFile();
    if (array_key_exists($name, $dotEnv) && is_scalar($dotEnv[$name])) {
        return (string) $dotEnv[$name];
    }

    // 2. local.php
    $local = committeeLoadLocalConfig();
    // isset: allow empty string (e.g. local XAMPP DB password, APP_BASE = site root)
    if (array_key_exists($name, $local) && is_scalar($local[$name])) {
        return (string) $local[$name];
    }

    $fromGetenv = getenv($name);
    if (is_string($fromGetenv) && $fromGetenv !== '') {
        return $fromGetenv;
    }
    if (isset($_SERVER[$name]) && is_string($_SERVER[$name]) && $_SERVER[$name] !== '') {
        return $_SERVER[$name];
    }
    if (isset($_ENV[$name]) && is_string($_ENV[$name]) && $_ENV[$name] !== '') {
        return $_ENV[$name];
    }
    if (function_exists('apache_getenv')) {
        $fromApache = apache_getenv($name);
        if (is_string($fromApache) && $fromApache !== '') {
            return $fromApache;
        }
    }

    return $default === null ? '' : (string) $default;
}

function committeeIsHttps(): bool {
    if (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') {
        return true;
    }
    if (isset($_SERVER['SERVER_PORT']) && (string) $_SERVER['SERVER_PORT'] === '443') {
        return true;
    }
    if (!empty($_SERVER['HTTP_X_FORWARDED_PROTO'])
        && strtolower((string) $_SERVER['HTTP_X_FORWARDED_PROTO']) === 'https') {
        return true;
    }
    return false;
}
