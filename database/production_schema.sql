-- Production schema for InfinityFree (import into an EXISTING database).
-- Do NOT run CREATE DATABASE — select your hosted DB in phpMyAdmin first.
-- Next: import production_seed_rbac.sql
-- Do NOT import mock seed data into production.
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS=0;
-- LOCAL DEVELOPMENT DATABASE — reconstructed from application code because original Supabase schema is unavailable.
-- UUID-string identifiers preserve the existing browser's strict ID comparisons.
-- Target: MySQL 5.7+ / MariaDB 10.2+ (XAMPP)
-- This file creates no production data and makes no connection to Supabase.

-- RBAC catalog (seed via database/seed_rbac.php).
CREATE TABLE IF NOT EXISTS roles (
  id CHAR(36) NOT NULL DEFAULT '',
  code VARCHAR(50) NOT NULL,
  label VARCHAR(100) NOT NULL,
  description VARCHAR(255) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_roles_code (code)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS permissions (
  id CHAR(36) NOT NULL DEFAULT '',
  code VARCHAR(100) NOT NULL,
  label VARCHAR(150) NOT NULL,
  module VARCHAR(50) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_permissions_code (code),
  KEY idx_permissions_module (module)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS role_permissions (
  id CHAR(36) NOT NULL DEFAULT '',
  role_id CHAR(36) NOT NULL,
  permission_id CHAR(36) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_role_permission (role_id, permission_id),
  CONSTRAINT fk_role_permissions_role
    FOREIGN KEY (role_id) REFERENCES roles (id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_role_permissions_permission
    FOREIGN KEY (permission_id) REFERENCES permissions (id)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS members (
  id CHAR(36) NOT NULL DEFAULT '',
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(254) NULL,
  phone VARCHAR(100) NULL,
  position VARCHAR(255) NULL,
  skills JSON NULL,
  availability VARCHAR(50) NOT NULL DEFAULT 'available',
  workload_score DECIMAL(10,2) NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_members_created_at (created_at),
  KEY idx_members_availability (availability)
) ENGINE=InnoDB;

-- Login accounts (OTP); users ≠ members; optional member_id for scoped roles.
CREATE TABLE IF NOT EXISTS users (
  id CHAR(36) NOT NULL DEFAULT '',
  email VARCHAR(254) NOT NULL,
  role_id CHAR(36) NULL,
  member_id CHAR(36) NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_email (email),
  KEY idx_users_role (role_id),
  KEY idx_users_member (member_id),
  CONSTRAINT fk_users_role FOREIGN KEY (role_id) REFERENCES roles (id) ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_users_member FOREIGN KEY (member_id) REFERENCES members (id) ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS committees (
  id CHAR(36) NOT NULL DEFAULT '',
  name VARCHAR(255) NOT NULL,
  type VARCHAR(100) NULL,
  purpose TEXT NULL,
  mandate TEXT NULL,
  qualification_requirements TEXT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'active',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_committees_created_at (created_at),
  KEY idx_committees_status (status)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS otp_codes (
  id CHAR(36) NOT NULL DEFAULT '',
  email VARCHAR(254) NOT NULL,
  otp_code VARCHAR(6) NOT NULL,
  expires_at DATETIME NOT NULL,
  used TINYINT(1) NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_otp_lookup (email, otp_code, used, created_at),
  KEY idx_otp_expiry (expires_at)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS tasks (
  id CHAR(36) NOT NULL DEFAULT '',
  committee_id CHAR(36) NULL,
  member_id CHAR(36) NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  due_date DATE NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_tasks_created_at (created_at),
  KEY idx_tasks_committee_id (committee_id),
  KEY idx_tasks_member_id (member_id),
  KEY idx_tasks_status (status),
  CONSTRAINT fk_tasks_committee
    FOREIGN KEY (committee_id) REFERENCES committees (id)
    ON UPDATE CASCADE ON DELETE SET NULL,
  CONSTRAINT fk_tasks_member
    FOREIGN KEY (member_id) REFERENCES members (id)
    ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS jurisdictions (
  id CHAR(36) NOT NULL DEFAULT '',
  committee_id CHAR(36) NOT NULL,
  area_name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_jurisdictions_created_at (created_at),
  KEY idx_jurisdictions_committee_id (committee_id),
  CONSTRAINT fk_jurisdictions_committee
    FOREIGN KEY (committee_id) REFERENCES committees (id)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS committee_members (
  id CHAR(36) NOT NULL DEFAULT '',
  committee_id CHAR(36) NOT NULL,
  member_id CHAR(36) NOT NULL,
  role VARCHAR(100) NOT NULL DEFAULT 'Member',
  assigned_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_committee_members_assignment (committee_id, member_id),
  KEY idx_committee_members_assigned_at (assigned_at),
  KEY idx_committee_members_member_id (member_id),
  CONSTRAINT fk_committee_members_committee
    FOREIGN KEY (committee_id) REFERENCES committees (id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_committee_members_member
    FOREIGN KEY (member_id) REFERENCES members (id)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS performance (
  id CHAR(36) NOT NULL DEFAULT '',
  member_id CHAR(36) NOT NULL,
  committee_id CHAR(36) NULL,
  attendance_rate DECIMAL(5,2) NOT NULL DEFAULT 0,
  task_completion_rate DECIMAL(5,2) NOT NULL DEFAULT 0,
  performance_score DECIMAL(5,2) NOT NULL DEFAULT 0,
  period VARCHAR(50) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_performance_created_at (created_at),
  KEY idx_performance_member_id (member_id),
  KEY idx_performance_committee_id (committee_id),
  CONSTRAINT fk_performance_member
    FOREIGN KEY (member_id) REFERENCES members (id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_performance_committee
    FOREIGN KEY (committee_id) REFERENCES committees (id)
    ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS reports (
  id CHAR(36) NOT NULL DEFAULT '',
  title VARCHAR(255) NOT NULL,
  committee_id CHAR(36) NULL,
  report_type VARCHAR(100) NOT NULL,
  date_from DATE NULL,
  date_to DATE NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_reports_created_at (created_at),
  KEY idx_reports_committee_id (committee_id),
  CONSTRAINT fk_reports_committee
    FOREIGN KEY (committee_id) REFERENCES committees (id)
    ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS legislative_archives (
  id CHAR(36) NOT NULL DEFAULT '',
  report_id CHAR(36) NOT NULL,
  report_title VARCHAR(255) NOT NULL,
  report_type VARCHAR(100) NOT NULL,
  committee_id CHAR(36) NULL,
  compiled_data JSON NOT NULL,
  archive_reference VARCHAR(100) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'archived',
  exported_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_archives_exported_at (exported_at),
  KEY idx_archives_report_id (report_id),
  KEY idx_archives_committee_id (committee_id),
  CONSTRAINT fk_archives_report
    FOREIGN KEY (report_id) REFERENCES reports (id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_archives_committee
    FOREIGN KEY (committee_id) REFERENCES committees (id)
    ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS module_integration_log (
  id CHAR(36) NOT NULL DEFAULT '',
  source_module VARCHAR(100) NOT NULL,
  target_module VARCHAR(100) NOT NULL,
  data_type VARCHAR(100) NOT NULL,
  record_id CHAR(36) NULL,
  status VARCHAR(50) NOT NULL,
  PRIMARY KEY (id),
  KEY idx_integration_log_record (record_id)
  -- TODO: SCHEMA INFORMATION NEEDED: record_id is polymorphic in the code,
  -- so it cannot safely use one foreign-key constraint.
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS session_performance_logs (
  id CHAR(36) NOT NULL DEFAULT '',
  committee_id CHAR(36) NULL,
  member_id CHAR(36) NULL,
  performance_score DECIMAL(5,2) NOT NULL DEFAULT 0,
  attendance_rate DECIMAL(5,2) NOT NULL DEFAULT 0,
  task_completion DECIMAL(5,2) NOT NULL DEFAULT 0,
  analytics_data JSON NOT NULL,
  sent_to_session TINYINT(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  KEY idx_session_performance_committee_id (committee_id),
  KEY idx_session_performance_member_id (member_id),
  CONSTRAINT fk_session_performance_committee
    FOREIGN KEY (committee_id) REFERENCES committees (id)
    ON UPDATE CASCADE ON DELETE SET NULL,
  CONSTRAINT fk_session_performance_member
    FOREIGN KEY (member_id) REFERENCES members (id)
    ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB;

-- Generate UUID strings at the database boundary so PHP and JavaScript receive
-- string IDs without requiring frontend normalization.
CREATE TRIGGER trg_users_uuid_before_insert
BEFORE INSERT ON users
FOR EACH ROW SET NEW.id = IF(NEW.id IS NULL OR NEW.id = '', UUID(), NEW.id);

CREATE TRIGGER trg_members_uuid_before_insert
BEFORE INSERT ON members
FOR EACH ROW SET NEW.id = IF(NEW.id IS NULL OR NEW.id = '', UUID(), NEW.id);

CREATE TRIGGER trg_committees_uuid_before_insert
BEFORE INSERT ON committees
FOR EACH ROW SET NEW.id = IF(NEW.id IS NULL OR NEW.id = '', UUID(), NEW.id);

CREATE TRIGGER trg_otp_codes_uuid_before_insert
BEFORE INSERT ON otp_codes
FOR EACH ROW SET NEW.id = IF(NEW.id IS NULL OR NEW.id = '', UUID(), NEW.id);

CREATE TRIGGER trg_tasks_uuid_before_insert
BEFORE INSERT ON tasks
FOR EACH ROW SET NEW.id = IF(NEW.id IS NULL OR NEW.id = '', UUID(), NEW.id);

CREATE TRIGGER trg_jurisdictions_uuid_before_insert
BEFORE INSERT ON jurisdictions
FOR EACH ROW SET NEW.id = IF(NEW.id IS NULL OR NEW.id = '', UUID(), NEW.id);

CREATE TRIGGER trg_committee_members_uuid_before_insert
BEFORE INSERT ON committee_members
FOR EACH ROW SET NEW.id = IF(NEW.id IS NULL OR NEW.id = '', UUID(), NEW.id);

CREATE TRIGGER trg_performance_uuid_before_insert
BEFORE INSERT ON performance
FOR EACH ROW SET NEW.id = IF(NEW.id IS NULL OR NEW.id = '', UUID(), NEW.id);

CREATE TRIGGER trg_reports_uuid_before_insert
BEFORE INSERT ON reports
FOR EACH ROW SET NEW.id = IF(NEW.id IS NULL OR NEW.id = '', UUID(), NEW.id);

CREATE TRIGGER trg_legislative_archives_uuid_before_insert
BEFORE INSERT ON legislative_archives
FOR EACH ROW SET NEW.id = IF(NEW.id IS NULL OR NEW.id = '', UUID(), NEW.id);

CREATE TRIGGER trg_module_integration_log_uuid_before_insert
BEFORE INSERT ON module_integration_log
FOR EACH ROW SET NEW.id = IF(NEW.id IS NULL OR NEW.id = '', UUID(), NEW.id);

CREATE TRIGGER trg_session_performance_logs_uuid_before_insert
BEFORE INSERT ON session_performance_logs
FOR EACH ROW SET NEW.id = IF(NEW.id IS NULL OR NEW.id = '', UUID(), NEW.id);

CREATE TRIGGER trg_roles_uuid_before_insert
BEFORE INSERT ON roles
FOR EACH ROW SET NEW.id = IF(NEW.id IS NULL OR NEW.id = '', UUID(), NEW.id);

CREATE TRIGGER trg_permissions_uuid_before_insert
BEFORE INSERT ON permissions
FOR EACH ROW SET NEW.id = IF(NEW.id IS NULL OR NEW.id = '', UUID(), NEW.id);

CREATE TRIGGER trg_role_permissions_uuid_before_insert
BEFORE INSERT ON role_permissions
FOR EACH ROW SET NEW.id = IF(NEW.id IS NULL OR NEW.id = '', UUID(), NEW.id);

-- Compatibility decisions for the controlled PHP migration:
-- 1. performance_score is the only persisted performance score. final_score is
--    a calculated API/UI result and later readers must use performance_score.
-- 2. report_type is the only persisted report classification. Archive export
--    must later replace report['type'] with report['report_type'].
-- 3. report and integration-log IDs are UUID strings. Archive export must later
--    remove integer casts and preserve the original report ID string.
-- 4. users.email is unique (uq_users_email); otp_codes.email remains a logical,
--    application-level link. Upgraded DBs: database/migrations/001_rbac.sql.

SET FOREIGN_KEY_CHECKS=1;
