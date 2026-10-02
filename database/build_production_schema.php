<?php
declare(strict_types=1);
if (PHP_SAPI !== 'cli') {
    exit("CLI only\n");
}
$src = file_get_contents(__DIR__ . '/schema.sql');
$src = preg_replace('/^CREATE DATABASE.*?;\s*/ms', '', $src);
$src = preg_replace('/^USE\s+\w+\s*;\s*/mi', '', $src);
$header = <<<'SQL'
-- Production schema for InfinityFree (import into an EXISTING database).
-- Do NOT run CREATE DATABASE — select your hosted DB in phpMyAdmin first.
-- Next: import production_seed_rbac.sql
-- Do NOT import mock seed data into production.
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS=0;

SQL;
$out = $header . trim((string) $src) . "\n\nSET FOREIGN_KEY_CHECKS=1;\n";
file_put_contents(__DIR__ . '/production_schema.sql', $out);
echo 'Wrote production_schema.sql bytes=' . strlen($out) . PHP_EOL;
