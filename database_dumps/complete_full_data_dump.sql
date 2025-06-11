-- Complete Full Data Dump - ALL Records from ALL Tables
-- Generated on 2025-06-11

-- Disable triggers and constraints for faster insertion
SET session_replication_role = replica;

-- Insert ALL Users
INSERT INTO users (id, username, email, display_name, password_hash, role, auth_type, is_active, failed_login_attempts, locked_until, last_login, created_at, updated_at, password_salt, password_iterations, account_locked_until, sso_subject, sso_provider, first_name, last_name, profile_image_url, created_by, updated_by, is_email_verified, email_verified_at, timezone, language, phone, department, job_title, manager_id, login_count, last_failed_login) VALUES
(1, 'admin', 'admin@company.com', 'System Administrator', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 'local', true, 0, NULL, '2025-06-10 17:48:16.863', '2025-05-23 11:42:24.459027', '2025-06-10 17:48:17.243', NULL, 100, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, NULL, 'UTC', 'en', NULL, NULL, NULL, NULL, 13, NULL),
(2, 'M-admin', 'm@admin.com', 'M-admin admin', '$2b$12$WKKV/3V0TeqXY/y3op4Ksurl1rQPmbovmvlxbpS8c1sUmKtiU4tKG', 'admin', 'local', true, 0, NULL, NULL, '2025-05-23 12:24:14.509455', '2025-05-23 12:24:14.509455', NULL, 100, NULL, NULL, NULL, 'M-admin', 'admin', NULL, 1, NULL, false, NULL, 'UTC', 'en', NULL, NULL, NULL, NULL, 0, NULL),
(4, 'testadmin', 'test@company.com', 'Test Administrator', '$2b$12$LQv3c1yqBWVHxkd0LQ1Gv.6BlTNXBVR9hoC/.MlO3pEXU.H96tHvW', 'admin', 'local', true, 1, NULL, NULL, '2025-05-23 12:45:49.838796', '2025-06-10 17:30:09.639', NULL, 100, NULL, NULL, NULL, 'Test', 'Admin', NULL, NULL, NULL, false, NULL, 'UTC', 'en', NULL, NULL, NULL, NULL, 0, '2025-05-23 12:45:57.139');
