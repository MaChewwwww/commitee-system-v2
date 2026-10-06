<?php
/** PHP owns routes and access checks; React owns the rendered interface. */
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/ui_assets.php';

function app_page_metadata(): array {
    return [
        'dashboard' => ['Dashboard', 'A clear view of your people, priorities, and progress.', 'Overview', 'dashboard.view'],
        'members' => ['Members', 'The people and strengths behind your community.', 'Management', 'members.view'],
        'committees' => ['Committees', 'Purposeful teams. Shared responsibilities.', 'Management', 'committees.view'],
        'assignments' => ['Assignments', 'Connect the right people to the right opportunities.', 'Management', 'assignments.view'],
        'jurisdiction' => ['Jurisdiction', 'Clear coverage for a connected community.', 'Management', 'jurisdictions.view'],
        'workload' => ['Workload', 'A balanced team starts with a clear picture of the work.', 'Monitoring', 'workload.view'],
        'performance' => ['Performance', 'Understand contributions. Recognize progress.', 'Monitoring', 'performance.view'],
        'reports' => ['Reports', 'Turn your community work into a clear, useful record.', 'Monitoring', 'reports.view'],
        'users' => ['Users', 'Manage workspace access with clarity and care.', 'Administration', 'users.view'],
    ];
}

function render_app(string $page): void {
    global $currentUserEmail, $currentUserRole, $currentUserRoleLabel, $currentUserPermissions;
    $metadata = app_page_metadata();
    $navigation = [];
    foreach ($metadata as $key => $item) {
        $navigation[] = ['key' => $key, 'label' => $item[0], 'href' => page_url($key . '.php'), 'group' => $item[2], 'permission' => $item[3]];
    }
    $details = $metadata[$page] ?? ($page === 'login' ? ['Sign in', 'Welcome to your committee workspace.'] : ['Access restricted', 'Your account needs permission to view this page.']);
    $config = [
        'page' => $page, 'title' => $details[0], 'description' => $details[1],
        'base' => APP_BASE, 'pages' => APP_PAGES, 'api' => APP_API, 'assets' => APP_ASSETS,
        'login' => page_url('login.php'), 'navigation' => $navigation,
        'userEmail' => $currentUserEmail ?? '', 'role' => $currentUserRole ?? '',
        'memberId' => $page === 'login' ? null : (currentUserContext(false, true)['member_id'] ?? null),
        'roleLabel' => $currentUserRoleLabel ?? '',
        'permissions' => array_values($currentUserPermissions ?? []),
    ];
    $json = json_encode($config, JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_THROW_ON_ERROR);
    $title = htmlspecialchars($details[0], ENT_QUOTES, 'UTF-8');
    echo '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">';
    echo '<title>' . $title . ' — SP Committee System</title>';
    render_ui_styles();
    echo '</head><body class="ui-body"><div id="ui-root" class="ui-scope" data-ui-component="app">';
    echo '<div class="ui-startup"><h1>SP Committee Workspace</h1><p id="ui-startup-message">Loading your workspace…</p>';
    echo '<a class="ui-reload" href="">Reload page</a><noscript><p>Enable JavaScript to use this workspace.</p></noscript></div></div>';
    echo '<div id="ui-portal-root" class="ui-scope"></div>';
    echo '<script>window.APP_CONFIG=' . $json . ';setTimeout(function(){var root=document.getElementById("ui-root"),message=document.getElementById("ui-startup-message");if(root&&!root.dataset.uiReady&&message){message.textContent="The interface is taking longer than expected. Reload this page, or check that the complete frontend build is available.";}},15000);</script>';
    render_ui_script();
    echo '</body></html>';
}
