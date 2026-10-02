<?php
declare(strict_types=1);
if (PHP_SAPI !== 'cli') { http_response_code(403); exit("CLI only\n"); }
require_once __DIR__ . '/../backend/config/database.php';
$database = $argv[1] ?? '';
if (!preg_match('/^committee_seed_test_[a-z0-9_]+$/', $database)) { exit("Use an isolated seed-test database populated by seed_all.php.\n"); }
$pdo = localPdo();
$pdo->exec('USE `' . $database . '`');
$keys = [
    'roles' => ['code'], 'permissions' => ['code'], 'role_permissions' => ['role_id', 'permission_id'],
    'members' => ['email'], 'users' => ['email'], 'committees' => ['name'],
    'committee_members' => ['committee_id', 'member_id'], 'jurisdictions' => ['committee_id', 'area_name'],
    'tasks' => ['committee_id', 'member_id', 'title'], 'performance' => ['member_id', 'committee_id', 'period'],
    'reports' => ['committee_id', 'title', 'report_type'],
];
$references = ['role_id' => ['roles', 'code'], 'permission_id' => ['permissions', 'code'], 'member_id' => ['members', 'email'], 'committee_id' => ['committees', 'name']];
$data = [];
foreach ($keys as $table => $_) {
    $data[$table] = $pdo->query('SELECT * FROM `' . $table . '` ORDER BY id')->fetchAll();
}
$sql = "-- Generated development/demo seed. Source: database/seed_all.php.\n-- Includes all six committees, linked jurisdictions and memberships.\n-- Do not import demo data into a live Hostforge database.\nSET NAMES utf8mb4;\nSTART TRANSACTION;\n";
foreach ($keys as $table => $naturalKeys) {
    foreach ($data[$table] as $row) {
        unset($row['created_at'], $row['assigned_at']);
        $expressions = [];
        foreach ($row as $column => $value) {
            if ($column === 'id') { $expressions[$column] = 'UUID()'; continue; }
            if ($value === null) { $expressions[$column] = 'NULL'; continue; }
            if (isset($references[$column])) {
                [$refTable, $refKey] = $references[$column];
                $target = array_values(array_filter($data[$refTable], static fn($r) => $r['id'] === $value));
                if (count($target) !== 1) { throw new RuntimeException('Unresolved seed reference'); }
                $expressions[$column] = '(SELECT id FROM `' . $refTable . '` WHERE `' . $refKey . '` = ' . $pdo->quote($target[0][$refKey]) . ' LIMIT 1)';
            } else {
                $expressions[$column] = $pdo->quote((string) $value);
            }
        }
        $conditions = [];
        foreach ($naturalKeys as $column) { $conditions[] = '`' . $column . '` <=> ' . $expressions[$column]; }
        $sql .= 'INSERT INTO `' . $table . '` (`' . implode('`, `', array_keys($expressions)) . '`) SELECT ' . implode(', ', $expressions)
            . ' WHERE NOT EXISTS (SELECT 1 FROM `' . $table . '` WHERE ' . implode(' AND ', $conditions) . ");\n";
    }
}
$sql .= "COMMIT;\n";
file_put_contents(__DIR__ . '/seed_all.sql', $sql);
echo "Generated complete, repeatable seed_all.sql\n";
