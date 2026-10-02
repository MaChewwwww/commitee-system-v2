<?php
/**
 * Shared app path helpers. No framework.
 * APP_BASE auto-detects from document root (Hostforge site root or subfolder).
 * Override with COMMITTEE_APP_BASE in backend/config/local.php ('' = site root).
 */
require_once __DIR__ . '/../backend/config/env.php';

if (!defined('APP_BASE')) {
    $local = committeeLoadLocalConfig();
    if (array_key_exists('COMMITTEE_APP_BASE', $local)) {
        $base = '/' . trim(str_replace('\\', '/', (string) $local['COMMITTEE_APP_BASE']), '/');
        if ($base === '/') {
            $base = '';
        }
    } else {
        $base = committeeDetectAppBase();
    }
    define('APP_BASE', $base);
    define('APP_PAGES', APP_BASE . '/pages');
    define('APP_ASSETS', APP_BASE . '/assets');
    define('APP_API', APP_BASE . '/backend/api');
}

/**
 * Detect URL path from filesystem relative to DOCUMENT_ROOT.
 * Falls back to /committee-management for typical local XAMPP layout.
 */
function committeeDetectAppBase(): string {
    $docRoot = isset($_SERVER['DOCUMENT_ROOT']) ? realpath((string) $_SERVER['DOCUMENT_ROOT']) : false;
    $appRoot = realpath(__DIR__ . '/..');
    if ($docRoot && $appRoot) {
        $docRoot = str_replace('\\', '/', $docRoot);
        $appRoot = str_replace('\\', '/', $appRoot);
        if (str_starts_with($appRoot, $docRoot)) {
            $rel = substr($appRoot, strlen($docRoot));
            $rel = '/' . trim($rel, '/');
            return $rel === '/' ? '' : $rel;
        }
    }
    return '/committee-management';
}

function app_url(string $path = ''): string {
    $path = ltrim($path, '/');
    return $path === '' ? (APP_BASE === '' ? '/' : APP_BASE . '/') : APP_BASE . '/' . $path;
}

function page_url(string $page): string {
    return APP_PAGES . '/' . ltrim($page, '/');
}

function asset_url(string $path): string {
    return APP_ASSETS . '/' . ltrim($path, '/');
}

function api_url(string $path = ''): string {
    $path = ltrim($path, '/');
    return $path === '' ? APP_API : APP_API . '/' . $path;
}
