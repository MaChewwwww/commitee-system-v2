<?php
/** Static frontend assets. Build locally or in Docker before deploying to Hostforge. */
require_once __DIR__ . '/config.php';

function ui_asset_url(string $file): string {
    $path = __DIR__ . '/../assets/build/' . $file;
    $version = is_file($path) ? (string) filemtime($path) : 'missing';
    return asset_url('build/' . $file) . '?v=' . $version;
}

function render_ui_styles(): void {
    echo '<link rel="stylesheet" href="' . htmlspecialchars(ui_asset_url('ui.css'), ENT_QUOTES, 'UTF-8') . '">' . PHP_EOL;
}

function render_ui_script(): void {
    echo '<script type="module" src="' . htmlspecialchars(ui_asset_url('ui.js'), ENT_QUOTES, 'UTF-8') . '"></script>' . PHP_EOL;
}
