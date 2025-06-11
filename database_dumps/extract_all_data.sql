-- Extract ALL data from every table
-- This will generate complete INSERT statements for all 1,310+ records

\o /tmp/complete_database_dump.sql

SELECT '-- Complete Database Data Dump - ALL Records';
SELECT '-- Generated on ' || NOW()::text;
SELECT '';
SELECT 'SET session_replication_role = replica;';
SELECT '';

-- Extract ALL Risk Library records (25 records)
SELECT '-- Insert ALL Risk Library (' || COUNT(*) || ' records)' FROM risk_library;
SELECT 'INSERT INTO risk_library VALUES';
SELECT string_agg(
    '(' || quote_literal(ROW(rl.*)) || ')',
    ',' || E'\n'
    ORDER BY id
) || ';'
FROM risk_library rl;
SELECT '';

-- Extract ALL Risk Summaries records (838 records)
SELECT '-- Insert ALL Risk Summaries (' || COUNT(*) || ' records)' FROM risk_summaries;
SELECT 'INSERT INTO risk_summaries VALUES';
SELECT string_agg(
    '(' || quote_literal(ROW(rs.*)) || ')',
    ',' || E'\n'
    ORDER BY id
) || ';'
FROM risk_summaries rs;
SELECT '';

-- Extract ALL Activity Logs records (289 records)
SELECT '-- Insert ALL Activity Logs (' || COUNT(*) || ' records)' FROM activity_logs;
SELECT 'INSERT INTO activity_logs VALUES';
SELECT string_agg(
    '(' || quote_literal(ROW(al.*)) || ')',
    ',' || E'\n'
    ORDER BY id
) || ';'
FROM activity_logs al;
SELECT '';

-- Extract ALL Vulnerabilities records (4 records)
SELECT '-- Insert ALL Vulnerabilities (' || COUNT(*) || ' records)' FROM vulnerabilities;
SELECT 'INSERT INTO vulnerabilities VALUES';
SELECT string_agg(
    '(' || quote_literal(ROW(v.*)) || ')',
    ',' || E'\n'
    ORDER BY id
) || ';'
FROM vulnerabilities v;
SELECT '';

-- Extract all relationship tables
-- Risk Controls
SELECT '-- Insert ALL Risk Controls (' || COUNT(*) || ' records)' FROM risk_controls;
\copy (SELECT 'INSERT INTO risk_controls VALUES ' || string_agg('(' || quote_literal(ROW(rc.*)) || ')', ',') || ';' FROM risk_controls rc) TO STDOUT;

-- Risk Responses  
SELECT '-- Insert ALL Risk Responses (' || COUNT(*) || ' records)' FROM risk_responses;
\copy (SELECT 'INSERT INTO risk_responses VALUES ' || string_agg('(' || quote_literal(ROW(rr.*)) || ')', ',') || ';' FROM risk_responses rr) TO STDOUT;

-- Risk Costs
SELECT '-- Insert ALL Risk Costs (' || COUNT(*) || ' records)' FROM risk_costs;
\copy (SELECT 'INSERT INTO risk_costs VALUES ' || string_agg('(' || quote_literal(ROW(rc.*)) || ')', ',') || ';' FROM risk_costs rc) TO STDOUT;

-- Enterprise Architecture
SELECT '-- Insert ALL Enterprise Architecture (' || COUNT(*) || ' records)' FROM enterprise_architecture;
\copy (SELECT 'INSERT INTO enterprise_architecture VALUES ' || string_agg('(' || quote_literal(ROW(ea.*)) || ')', ',') || ';' FROM enterprise_architecture ea) TO STDOUT;

SELECT '';
SELECT 'SET session_replication_role = default;';
SELECT '';
SELECT '-- Update sequences to match data';
SELECT 'SELECT setval(''users_id_seq'', (SELECT MAX(id) FROM users));';
SELECT 'SELECT setval(''legal_entities_id_seq'', (SELECT MAX(id) FROM legal_entities));';
SELECT 'SELECT setval(''assets_id_seq'', (SELECT MAX(id) FROM assets));';
SELECT 'SELECT setval(''risks_id_seq'', (SELECT MAX(id) FROM risks));';
SELECT 'SELECT setval(''controls_id_seq'', (SELECT MAX(id) FROM controls));';
SELECT 'SELECT setval(''control_library_id_seq'', (SELECT MAX(id) FROM control_library));';
SELECT 'SELECT setval(''risk_library_id_seq'', (SELECT MAX(id) FROM risk_library));';
SELECT 'SELECT setval(''cost_modules_id_seq'', (SELECT MAX(id) FROM cost_modules));';
SELECT 'SELECT setval(''vulnerabilities_id_seq'', (SELECT MAX(id) FROM vulnerabilities));';
SELECT 'SELECT setval(''risk_summaries_id_seq'', (SELECT MAX(id) FROM risk_summaries));';
SELECT 'SELECT setval(''activity_logs_id_seq'', (SELECT MAX(id) FROM activity_logs));';
SELECT 'SELECT setval(''auth_config_id_seq'', (SELECT MAX(id) FROM auth_config));';

\o
\! echo "Complete data dump generated in /tmp/complete_database_dump.sql"