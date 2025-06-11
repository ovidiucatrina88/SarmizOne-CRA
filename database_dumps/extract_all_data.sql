-- Script to generate complete INSERT statements for all tables
-- This will output the complete data dump

\o complete_all_data_dump.sql

-- Generate complete INSERT statements for each table
SELECT 'SET session_replication_role = replica;';
SELECT '';

-- Users table
SELECT 'INSERT INTO users (id, username, email, display_name, password_hash, role, auth_type, is_active, failed_login_attempts, locked_until, last_login, created_at, updated_at, password_salt, password_iterations, account_locked_until, sso_subject, sso_provider, first_name, last_name, profile_image_url, created_by, updated_by, is_email_verified, email_verified_at, timezone, language, phone, department, job_title, manager_id, login_count, last_failed_login) VALUES';
SELECT string_agg(
    '(' || 
    COALESCE(id::text, 'NULL') || ', ' ||
    COALESCE(quote_literal(username), 'NULL') || ', ' ||
    COALESCE(quote_literal(email), 'NULL') || ', ' ||
    COALESCE(quote_literal(display_name), 'NULL') || ', ' ||
    COALESCE(quote_literal(password_hash), 'NULL') || ', ' ||
    COALESCE(quote_literal(role), 'NULL') || ', ' ||
    COALESCE(quote_literal(auth_type), 'NULL') || ', ' ||
    COALESCE(is_active::text, 'NULL') || ', ' ||
    COALESCE(failed_login_attempts::text, 'NULL') || ', ' ||
    COALESCE(quote_literal(locked_until::text), 'NULL') || ', ' ||
    COALESCE(quote_literal(last_login::text), 'NULL') || ', ' ||
    COALESCE(quote_literal(created_at::text), 'NULL') || ', ' ||
    COALESCE(quote_literal(updated_at::text), 'NULL') || ', ' ||
    COALESCE(quote_literal(password_salt), 'NULL') || ', ' ||
    COALESCE(password_iterations::text, 'NULL') || ', ' ||
    COALESCE(quote_literal(account_locked_until::text), 'NULL') || ', ' ||
    COALESCE(quote_literal(sso_subject), 'NULL') || ', ' ||
    COALESCE(quote_literal(sso_provider), 'NULL') || ', ' ||
    COALESCE(quote_literal(first_name), 'NULL') || ', ' ||
    COALESCE(quote_literal(last_name), 'NULL') || ', ' ||
    COALESCE(quote_literal(profile_image_url), 'NULL') || ', ' ||
    COALESCE(created_by::text, 'NULL') || ', ' ||
    COALESCE(updated_by::text, 'NULL') || ', ' ||
    COALESCE(is_email_verified::text, 'NULL') || ', ' ||
    COALESCE(quote_literal(email_verified_at::text), 'NULL') || ', ' ||
    COALESCE(quote_literal(timezone), 'NULL') || ', ' ||
    COALESCE(quote_literal(language), 'NULL') || ', ' ||
    COALESCE(quote_literal(phone), 'NULL') || ', ' ||
    COALESCE(quote_literal(department), 'NULL') || ', ' ||
    COALESCE(quote_literal(job_title), 'NULL') || ', ' ||
    COALESCE(manager_id::text, 'NULL') || ', ' ||
    COALESCE(login_count::text, 'NULL') || ', ' ||
    COALESCE(quote_literal(last_failed_login::text), 'NULL') ||
    ')',
    E',\n'
    ORDER BY id
) || ';'
FROM users;

SELECT '';
SELECT '';

-- Legal Entities table  
SELECT 'INSERT INTO legal_entities (id, entity_id, name, description, parent_entity_id, created_at) VALUES';
SELECT string_agg(
    '(' || 
    COALESCE(id::text, 'NULL') || ', ' ||
    COALESCE(quote_literal(entity_id), 'NULL') || ', ' ||
    COALESCE(quote_literal(name), 'NULL') || ', ' ||
    COALESCE(quote_literal(description), 'NULL') || ', ' ||
    COALESCE(quote_literal(parent_entity_id), 'NULL') || ', ' ||
    COALESCE(quote_literal(created_at::text), 'NULL') ||
    ')',
    E',\n'
    ORDER BY id
) || ';'
FROM legal_entities;

\o