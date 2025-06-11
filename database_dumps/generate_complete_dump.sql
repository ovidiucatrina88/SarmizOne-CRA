-- Script to generate complete INSERT statements for ALL data
-- This outputs a complete data dump with every record

\o /tmp/complete_database_dump.sql

-- Header
SELECT '-- Complete Database Data Dump - ALL Records';
SELECT '-- Generated on ' || NOW()::text;
SELECT '';
SELECT 'SET session_replication_role = replica;';
SELECT '';

-- Users (3 records)
SELECT '-- Insert ALL Users (' || COUNT(*) || ' records)' FROM users;
SELECT 'INSERT INTO users VALUES';
SELECT string_agg(
    '(' || quote_literal(ROW(u.*)) || ')',
    ',' || E'\n'
    ORDER BY id
) || ';'
FROM users u;
SELECT '';

-- Legal Entities (4 records)  
SELECT '-- Insert ALL Legal Entities (' || COUNT(*) || ' records)' FROM legal_entities;
SELECT 'INSERT INTO legal_entities VALUES';
SELECT string_agg(
    '(' || quote_literal(ROW(le.*)) || ')',
    ',' || E'\n'
    ORDER BY id
) || ';'
FROM legal_entities le;
SELECT '';

-- Assets (4 records)
SELECT '-- Insert ALL Assets (' || COUNT(*) || ' records)' FROM assets;
SELECT 'INSERT INTO assets VALUES';
SELECT string_agg(
    '(' || quote_literal(ROW(a.*)) || ')',
    ',' || E'\n'
    ORDER BY id
) || ';'
FROM assets a;
SELECT '';

-- Auth Config (1 record)
SELECT '-- Insert ALL Auth Config (' || COUNT(*) || ' records)' FROM auth_config;
SELECT 'INSERT INTO auth_config VALUES';
SELECT string_agg(
    '(' || quote_literal(ROW(ac.*)) || ')',
    ',' || E'\n'
    ORDER BY id
) || ';'
FROM auth_config ac;
SELECT '';

-- Cost Modules (10 records)
SELECT '-- Insert ALL Cost Modules (' || COUNT(*) || ' records)' FROM cost_modules;
SELECT 'INSERT INTO cost_modules VALUES';
SELECT string_agg(
    '(' || quote_literal(ROW(cm.*)) || ')',
    ',' || E'\n'
    ORDER BY id
) || ';'
FROM cost_modules cm;
SELECT '';

-- Control Library (133 records)
SELECT '-- Insert ALL Control Library (' || COUNT(*) || ' records)' FROM control_library;
SELECT 'INSERT INTO control_library VALUES';
SELECT string_agg(
    '(' || quote_literal(ROW(cl.*)) || ')',
    ',' || E'\n'
    ORDER BY id
) || ';'
FROM control_library cl;
SELECT '';

-- Risk Library (25 records)
SELECT '-- Insert ALL Risk Library (' || COUNT(*) || ' records)' FROM risk_library;
SELECT 'INSERT INTO risk_library VALUES';
SELECT string_agg(
    '(' || quote_literal(ROW(rl.*)) || ')',
    ',' || E'\n'
    ORDER BY id
) || ';'
FROM risk_library rl;
SELECT '';

-- Risks (4 records)
SELECT '-- Insert ALL Risks (' || COUNT(*) || ' records)' FROM risks;
SELECT 'INSERT INTO risks VALUES';
SELECT string_agg(
    '(' || quote_literal(ROW(r.*)) || ')',
    ',' || E'\n'
    ORDER BY id
) || ';'
FROM risks r;
SELECT '';

-- Controls (2 records)
SELECT '-- Insert ALL Controls (' || COUNT(*) || ' records)' FROM controls;
SELECT 'INSERT INTO controls VALUES';
SELECT string_agg(
    '(' || quote_literal(ROW(c.*)) || ')',
    ',' || E'\n'
    ORDER BY id
) || ';'
FROM controls c;
SELECT '';

-- Vulnerabilities (4 records)
SELECT '-- Insert ALL Vulnerabilities (' || COUNT(*) || ' records)' FROM vulnerabilities;
SELECT 'INSERT INTO vulnerabilities VALUES';
SELECT string_agg(
    '(' || quote_literal(ROW(v.*)) || ')',
    ',' || E'\n'
    ORDER BY id
) || ';'
FROM vulnerabilities v;
SELECT '';

-- Risk Summaries (838 records)
SELECT '-- Insert ALL Risk Summaries (' || COUNT(*) || ' records)' FROM risk_summaries;
SELECT 'INSERT INTO risk_summaries VALUES';
SELECT string_agg(
    '(' || quote_literal(ROW(rs.*)) || ')',
    ',' || E'\n'
    ORDER BY id
) || ';'
FROM risk_summaries rs;
SELECT '';

-- Activity Logs (289 records)
SELECT '-- Insert ALL Activity Logs (' || COUNT(*) || ' records)' FROM activity_logs;
SELECT 'INSERT INTO activity_logs VALUES';
SELECT string_agg(
    '(' || quote_literal(ROW(al.*)) || ')',
    ',' || E'\n'
    ORDER BY id
) || ';'
FROM activity_logs al;
SELECT '';

-- Remaining tables with data
SELECT 'SET session_replication_role = default;';

\o

\! echo "Complete data dump generated in /tmp/complete_database_dump.sql"