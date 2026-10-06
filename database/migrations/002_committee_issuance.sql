-- Add issuance details without inventing dates or issuers for existing committees.
-- Run against an existing MySQL/MariaDB application database before deploying the API.
SET @committee_issuance_ddl = IF(
  EXISTS(SELECT 1 FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'committees' AND COLUMN_NAME = 'issued_date'),
  'DO 0',
  'ALTER TABLE committees ADD COLUMN issued_date DATE NULL AFTER type'
);
PREPARE committee_issuance_statement FROM @committee_issuance_ddl;
EXECUTE committee_issuance_statement;
DEALLOCATE PREPARE committee_issuance_statement;

SET @committee_issuance_ddl = IF(
  EXISTS(SELECT 1 FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'committees' AND COLUMN_NAME = 'issued_by'),
  'DO 0',
  'ALTER TABLE committees ADD COLUMN issued_by VARCHAR(255) NULL AFTER issued_date'
);
PREPARE committee_issuance_statement FROM @committee_issuance_ddl;
EXECUTE committee_issuance_statement;
DEALLOCATE PREPARE committee_issuance_statement;
