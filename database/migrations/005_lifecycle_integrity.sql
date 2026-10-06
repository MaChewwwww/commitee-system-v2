-- Additive city/municipal committee workflow migration. Existing legal facts remain unfilled.
SET @workflow_ddl = IF(EXISTS(SELECT 1 FROM information_schema.COLUMNS WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME='committees' AND COLUMN_NAME='establishing_reference'), 'DO 0', 'ALTER TABLE committees ADD COLUMN establishing_reference VARCHAR(1000) NULL');
PREPARE workflow_statement FROM @workflow_ddl;
EXECUTE workflow_statement;
DEALLOCATE PREPARE workflow_statement;

SET @workflow_ddl = IF(EXISTS(SELECT 1 FROM information_schema.COLUMNS WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME='committees' AND COLUMN_NAME='effective_until'), 'DO 0', 'ALTER TABLE committees ADD COLUMN effective_until DATE NULL');
PREPARE workflow_statement FROM @workflow_ddl;
EXECUTE workflow_statement;
DEALLOCATE PREPARE workflow_statement;

SET @workflow_ddl = IF(EXISTS(SELECT 1 FROM information_schema.COLUMNS WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME='jurisdictions' AND COLUMN_NAME='effective_until'), 'DO 0', 'ALTER TABLE jurisdictions ADD COLUMN effective_until DATE NULL');
PREPARE workflow_statement FROM @workflow_ddl;
EXECUTE workflow_statement;
DEALLOCATE PREPARE workflow_statement;

SET @workflow_ddl = IF(EXISTS(SELECT 1 FROM information_schema.COLUMNS WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME='penalties' AND COLUMN_NAME='legal_basis'), 'DO 0', 'ALTER TABLE penalties ADD COLUMN legal_basis VARCHAR(1000) NULL');
PREPARE workflow_statement FROM @workflow_ddl;
EXECUTE workflow_statement;
DEALLOCATE PREPARE workflow_statement;

SET @workflow_ddl = IF(EXISTS(SELECT 1 FROM information_schema.COLUMNS WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME='tasks' AND COLUMN_NAME='submitted_at'), 'DO 0', 'ALTER TABLE tasks ADD COLUMN submitted_at DATETIME NULL');
PREPARE workflow_statement FROM @workflow_ddl;
EXECUTE workflow_statement;
DEALLOCATE PREPARE workflow_statement;

SET @workflow_ddl = IF(EXISTS(SELECT 1 FROM information_schema.COLUMNS WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME='tasks' AND COLUMN_NAME='approved_at'), 'DO 0', 'ALTER TABLE tasks ADD COLUMN approved_at DATETIME NULL');
PREPARE workflow_statement FROM @workflow_ddl;
EXECUTE workflow_statement;
DEALLOCATE PREPARE workflow_statement;

SET @workflow_ddl = IF(EXISTS(SELECT 1 FROM information_schema.COLUMNS WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME='tasks' AND COLUMN_NAME='approved_by_user_id'), 'DO 0', 'ALTER TABLE tasks ADD COLUMN approved_by_user_id CHAR(36) NULL');
PREPARE workflow_statement FROM @workflow_ddl;
EXECUTE workflow_statement;
DEALLOCATE PREPARE workflow_statement;

SET @workflow_ddl = IF(EXISTS(SELECT 1 FROM information_schema.COLUMNS WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME='reports' AND COLUMN_NAME='snapshot_json'), 'DO 0', 'ALTER TABLE reports ADD COLUMN snapshot_json LONGTEXT NULL');
PREPARE workflow_statement FROM @workflow_ddl;
EXECUTE workflow_statement;
DEALLOCATE PREPARE workflow_statement;

-- Keep existing role codes and permissions compatible, update their display labels.
UPDATE roles SET label='Sanggunian Chairperson' WHERE code='sk_chairperson';
UPDATE roles SET label='Committee Member' WHERE code='sk_member';
UPDATE roles SET label='Sanggunian Secretary' WHERE code='secretary';
UPDATE roles SET label='Treasurer' WHERE code='treasurer';
INSERT IGNORE INTO role_permissions (id, role_id, permission_id)
SELECT UUID(), r.id, p.id FROM roles r JOIN permissions p ON p.code IN ('assignments.view','members.view','committees.view','workload.view') WHERE r.code='sk_member';
