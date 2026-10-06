-- Jurisdiction metadata and a shared penalty matrix. No sample legal rules are seeded.
SET @jurisdiction_matrix_ddl = IF(
  EXISTS(SELECT 1 FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'jurisdictions' AND COLUMN_NAME = 'level'),
  'DO 0',
  'ALTER TABLE jurisdictions ADD COLUMN level VARCHAR(100) NULL AFTER category'
);
PREPARE jurisdiction_matrix_statement FROM @jurisdiction_matrix_ddl;
EXECUTE jurisdiction_matrix_statement;
DEALLOCATE PREPARE jurisdiction_matrix_statement;

SET @jurisdiction_matrix_ddl = IF(
  EXISTS(SELECT 1 FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'jurisdictions' AND COLUMN_NAME = 'legal_basis'),
  'DO 0',
  'ALTER TABLE jurisdictions ADD COLUMN legal_basis VARCHAR(1000) NULL AFTER level'
);
PREPARE jurisdiction_matrix_statement FROM @jurisdiction_matrix_ddl;
EXECUTE jurisdiction_matrix_statement;
DEALLOCATE PREPARE jurisdiction_matrix_statement;

SET @jurisdiction_matrix_ddl = IF(
  EXISTS(SELECT 1 FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'jurisdictions' AND COLUMN_NAME = 'effectivity_date'),
  'DO 0',
  'ALTER TABLE jurisdictions ADD COLUMN effectivity_date DATE NULL AFTER legal_basis'
);
PREPARE jurisdiction_matrix_statement FROM @jurisdiction_matrix_ddl;
EXECUTE jurisdiction_matrix_statement;
DEALLOCATE PREPARE jurisdiction_matrix_statement;

CREATE TABLE IF NOT EXISTS penalties (
  id CHAR(36) NOT NULL,
  violation VARCHAR(255) NOT NULL,
  first_offense VARCHAR(255) NOT NULL,
  second_offense VARCHAR(255) NOT NULL,
  third_offense VARCHAR(255) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_penalties_created_at (created_at)
) ENGINE=InnoDB;
