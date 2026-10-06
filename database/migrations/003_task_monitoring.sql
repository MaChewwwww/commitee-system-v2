-- Add monitoring metadata. Historical completion dates/approvers remain unknown.
SET @task_monitoring_ddl = IF(
  EXISTS(SELECT 1 FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'tasks' AND COLUMN_NAME = 'completed_at'),
  'DO 0',
  'ALTER TABLE tasks ADD COLUMN completed_at DATETIME NULL AFTER due_date'
);
PREPARE task_monitoring_statement FROM @task_monitoring_ddl;
EXECUTE task_monitoring_statement;
DEALLOCATE PREPARE task_monitoring_statement;

SET @task_monitoring_ddl = IF(
  EXISTS(SELECT 1 FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'tasks' AND COLUMN_NAME = 'approved_by'),
  'DO 0',
  'ALTER TABLE tasks ADD COLUMN approved_by VARCHAR(255) NULL AFTER completed_at'
);
PREPARE task_monitoring_statement FROM @task_monitoring_ddl;
EXECUTE task_monitoring_statement;
DEALLOCATE PREPARE task_monitoring_statement;
