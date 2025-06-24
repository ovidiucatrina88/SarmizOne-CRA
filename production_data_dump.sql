-- Production Data Dump - Essential Reference Data
-- Contains users, legal entities, and critical system data

-- Insert admin user (encrypted password: admin123)
INSERT INTO users (id, username, email, display_name, password_hash, role, auth_type, is_active, created_at, updated_at)
VALUES (1, 'admin', 'admin@company.com', 'System Administrator', 
        '$2b$12$63xy/AYqsPn/23xqbq6hge63AfkpQjxINHswJiJYXeYNYlePo5x7m', 
        'admin', 'local', true, NOW(), NOW())
ON CONFLICT (username) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  role = EXCLUDED.role,
  updated_at = NOW();

-- Insert legal entities
INSERT INTO legal_entities (id, entity_id, name, description, parent_entity_id, created_at, updated_at)
VALUES 
  (1, 'ENT-001', 'Company X Emea', '', 'ENT-003', NOW(), NOW()),
  (2, 'ENT-002', 'Company Y US', '', 'ENT-003', NOW(), NOW()),
  (3, 'ENT-003', 'Company Group', '', NULL, NOW(), NOW()),
  (4, 'ENT-004', 'another-company', '0', 'ENT-001', NOW(), NOW()),
  (11, 'ENT-005', 'group-entity', '', NULL, NOW(), NOW())
ON CONFLICT (entity_id) DO UPDATE SET
  name = EXCLUDED.name,
  updated_at = NOW();

-- Reset sequences to proper values
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users), true);
SELECT setval('legal_entities_id_seq', (SELECT MAX(id) FROM legal_entities), true);

-- Insert sample auth configuration
INSERT INTO auth_config (auth_type, config, is_enabled)
VALUES ('local', '{"password_policy": {"min_length": 8}}', true)
ON CONFLICT DO NOTHING;