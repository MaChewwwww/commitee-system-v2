<?php
declare(strict_types=1);
/** Back up and clear only application data; schema and triggers remain intact. */
function backupSeedDatabase(PDO $pdo, string $path): array {
    $tables = ['committee_members', 'committees', 'jurisdictions', 'legislative_archives', 'members', 'module_integration_log', 'otp_codes', 'performance', 'permissions', 'reports', 'role_permissions', 'roles', 'session_performance_logs', 'tasks', 'users'];
    $actual = $pdo->query('SHOW TABLES')->fetchAll(PDO::FETCH_COLUMN);
    sort($actual); sort($tables);
    if ($actual !== $tables) { throw new RuntimeException('Reset stopped: unexpected or missing tables in the configured database.'); }
    $file = fopen($path, 'x');
    if (!$file) { throw new RuntimeException('Cannot create backup. Reset was not started.'); }
    try {
        fwrite($file, "-- Application data backup before reset; restore into the same application schema.\nSET NAMES utf8mb4;\nSET FOREIGN_KEY_CHECKS=0;\nSTART TRANSACTION;\n");
        foreach ($tables as $table) { fwrite($file, 'DELETE FROM `' . $table . "`;\n"); }
        foreach ($tables as $table) {
            foreach ($pdo->query('SELECT * FROM `' . $table . '`') as $row) {
                $values = array_map(static fn($value) => $value === null ? 'NULL' : $pdo->quote((string) $value), array_values($row));
                fwrite($file, 'INSERT INTO `' . $table . '` (`' . implode('`, `', array_keys($row)) . '`) VALUES (' . implode(', ', $values) . ");\n");
            }
        }
        fwrite($file, "COMMIT;\nSET FOREIGN_KEY_CHECKS=1;\n");
    } finally { fclose($file); }
    echo 'Backup saved: ' . $path . PHP_EOL;
    return $tables;
}
