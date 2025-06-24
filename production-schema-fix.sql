-- Production Schema Alignment Script
-- Ensures production database matches development schema

-- Add missing columns that might be causing API failures
ALTER TABLE controls ADD COLUMN IF NOT EXISTS is_per_agent BOOLEAN DEFAULT false;
ALTER TABLE controls ADD COLUMN IF NOT EXISTS is_per_agent_pricing BOOLEAN DEFAULT false;
ALTER TABLE controls ADD COLUMN IF NOT EXISTS cost_per_agent NUMERIC(10,2) DEFAULT 0;
ALTER TABLE controls ADD COLUMN IF NOT EXISTS deployed_agent_count INTEGER DEFAULT 0;

-- Add missing columns to control_library if they don't exist
ALTER TABLE control_library ADD COLUMN IF NOT EXISTS is_per_agent_pricing BOOLEAN DEFAULT false;
ALTER TABLE control_library ADD COLUMN IF NOT EXISTS cost_per_agent NUMERIC(10,2) DEFAULT 0;
ALTER TABLE control_library ADD COLUMN IF NOT EXISTS deployed_agent_count INTEGER DEFAULT 0;

-- Ensure all required columns exist in both tables
-- This prevents the "column does not exist" errors

-- Update schema version
INSERT INTO production_schema_version (version, description) 
VALUES (2, 'Fixed missing per-agent pricing columns') 
ON CONFLICT (version) DO UPDATE SET 
  applied_at = CURRENT_TIMESTAMP,
  description = EXCLUDED.description;

-- Verify schema alignment
SELECT 'Schema alignment complete' as status;