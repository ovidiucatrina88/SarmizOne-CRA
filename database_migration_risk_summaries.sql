-- Database Migration Script for Risk Summaries Enhanced Percentiles
-- This script adds missing percentile columns to the risk_summaries table
-- for enhanced FAIR-CAM methodology support

-- Add missing percentile columns if they don't exist
DO $$ 
BEGIN
    -- Add percentile_10_exposure if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'risk_summaries' 
                   AND column_name = 'percentile_10_exposure') THEN
        ALTER TABLE risk_summaries ADD COLUMN percentile_10_exposure REAL DEFAULT 0;
    END IF;

    -- Add percentile_25_exposure if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'risk_summaries' 
                   AND column_name = 'percentile_25_exposure') THEN
        ALTER TABLE risk_summaries ADD COLUMN percentile_25_exposure REAL DEFAULT 0;
    END IF;

    -- Add percentile_50_exposure if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'risk_summaries' 
                   AND column_name = 'percentile_50_exposure') THEN
        ALTER TABLE risk_summaries ADD COLUMN percentile_50_exposure REAL DEFAULT 0;
    END IF;

    -- Add percentile_75_exposure if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'risk_summaries' 
                   AND column_name = 'percentile_75_exposure') THEN
        ALTER TABLE risk_summaries ADD COLUMN percentile_75_exposure REAL DEFAULT 0;
    END IF;

    -- Add percentile_90_exposure if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'risk_summaries' 
                   AND column_name = 'percentile_90_exposure') THEN
        ALTER TABLE risk_summaries ADD COLUMN percentile_90_exposure REAL DEFAULT 0;
    END IF;

    -- Add percentile_95_exposure if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'risk_summaries' 
                   AND column_name = 'percentile_95_exposure') THEN
        ALTER TABLE risk_summaries ADD COLUMN percentile_95_exposure REAL DEFAULT 0;
    END IF;

    -- Add percentile_99_exposure if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'risk_summaries' 
                   AND column_name = 'percentile_99_exposure') THEN
        ALTER TABLE risk_summaries ADD COLUMN percentile_99_exposure REAL DEFAULT 0;
    END IF;

    RAISE NOTICE 'Enhanced percentile columns added to risk_summaries table';
END $$;

-- Add enhanced percentile columns to risks table if they don't exist
DO $$ 
BEGIN
    -- ALE Percentiles (Annual Loss Expectancy)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'risks' AND column_name = 'ale_p10') THEN
        ALTER TABLE risks ADD COLUMN ale_p10 NUMERIC(38,2) DEFAULT 0;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'risks' AND column_name = 'ale_p25') THEN
        ALTER TABLE risks ADD COLUMN ale_p25 NUMERIC(38,2) DEFAULT 0;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'risks' AND column_name = 'ale_p50') THEN
        ALTER TABLE risks ADD COLUMN ale_p50 NUMERIC(38,2) DEFAULT 0;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'risks' AND column_name = 'ale_p75') THEN
        ALTER TABLE risks ADD COLUMN ale_p75 NUMERIC(38,2) DEFAULT 0;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'risks' AND column_name = 'ale_p90') THEN
        ALTER TABLE risks ADD COLUMN ale_p90 NUMERIC(38,2) DEFAULT 0;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'risks' AND column_name = 'ale_p95') THEN
        ALTER TABLE risks ADD COLUMN ale_p95 NUMERIC(38,2) DEFAULT 0;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'risks' AND column_name = 'ale_p99') THEN
        ALTER TABLE risks ADD COLUMN ale_p99 NUMERIC(38,2) DEFAULT 0;
    END IF;

    -- Inherent Risk Percentiles (before controls)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'risks' AND column_name = 'inherent_p10') THEN
        ALTER TABLE risks ADD COLUMN inherent_p10 NUMERIC(38,2) DEFAULT 0;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'risks' AND column_name = 'inherent_p25') THEN
        ALTER TABLE risks ADD COLUMN inherent_p25 NUMERIC(38,2) DEFAULT 0;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'risks' AND column_name = 'inherent_p50') THEN
        ALTER TABLE risks ADD COLUMN inherent_p50 NUMERIC(38,2) DEFAULT 0;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'risks' AND column_name = 'inherent_p75') THEN
        ALTER TABLE risks ADD COLUMN inherent_p75 NUMERIC(38,2) DEFAULT 0;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'risks' AND column_name = 'inherent_p90') THEN
        ALTER TABLE risks ADD COLUMN inherent_p90 NUMERIC(38,2) DEFAULT 0;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'risks' AND column_name = 'inherent_p95') THEN
        ALTER TABLE risks ADD COLUMN inherent_p95 NUMERIC(38,2) DEFAULT 0;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'risks' AND column_name = 'inherent_p99') THEN
        ALTER TABLE risks ADD COLUMN inherent_p99 NUMERIC(38,2) DEFAULT 0;
    END IF;

    -- Residual Risk Percentiles (after controls)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'risks' AND column_name = 'residual_p10') THEN
        ALTER TABLE risks ADD COLUMN residual_p10 NUMERIC(38,2) DEFAULT 0;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'risks' AND column_name = 'residual_p25') THEN
        ALTER TABLE risks ADD COLUMN residual_p25 NUMERIC(38,2) DEFAULT 0;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'risks' AND column_name = 'residual_p50') THEN
        ALTER TABLE risks ADD COLUMN residual_p50 NUMERIC(38,2) DEFAULT 0;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'risks' AND column_name = 'residual_p75') THEN
        ALTER TABLE risks ADD COLUMN residual_p75 NUMERIC(38,2) DEFAULT 0;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'risks' AND column_name = 'residual_p90') THEN
        ALTER TABLE risks ADD COLUMN residual_p90 NUMERIC(38,2) DEFAULT 0;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'risks' AND column_name = 'residual_p95') THEN
        ALTER TABLE risks ADD COLUMN residual_p95 NUMERIC(38,2) DEFAULT 0;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'risks' AND column_name = 'residual_p99') THEN
        ALTER TABLE risks ADD COLUMN residual_p99 NUMERIC(38,2) DEFAULT 0;
    END IF;

    RAISE NOTICE 'Enhanced percentile columns added to risks table';
END $$;

-- Create indexes for better performance on percentile queries
CREATE INDEX IF NOT EXISTS idx_risk_summaries_percentiles 
ON risk_summaries (percentile_10_exposure, percentile_25_exposure, percentile_50_exposure, 
                   percentile_75_exposure, percentile_90_exposure, percentile_95_exposure, percentile_99_exposure);

CREATE INDEX IF NOT EXISTS idx_risks_ale_percentiles 
ON risks (ale_p10, ale_p25, ale_p50, ale_p75, ale_p90, ale_p95, ale_p99);

CREATE INDEX IF NOT EXISTS idx_risks_inherent_percentiles 
ON risks (inherent_p10, inherent_p25, inherent_p50, inherent_p75, inherent_p90, inherent_p95, inherent_p99);

CREATE INDEX IF NOT EXISTS idx_risks_residual_percentiles 
ON risks (residual_p10, residual_p25, residual_p50, residual_p75, residual_p90, residual_p95, residual_p99);

-- Update any existing risk summaries to populate new percentile columns from existing data
UPDATE risk_summaries SET
    percentile_10_exposure = COALESCE(tenth_percentile_exposure, 0),
    percentile_25_exposure = 0, -- Will be calculated by application
    percentile_50_exposure = COALESCE(most_likely_exposure, median_exposure, 0),
    percentile_75_exposure = 0, -- Will be calculated by application
    percentile_90_exposure = COALESCE(ninetieth_percentile_exposure, 0),
    percentile_95_exposure = COALESCE(percentile_95_exposure, 0),
    percentile_99_exposure = COALESCE(percentile_99_exposure, 0)
WHERE id IS NOT NULL;

COMMIT;

-- Verification queries to confirm the migration
SELECT 'Migration completed successfully. Verifying columns...' as status;

SELECT table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_name IN ('risk_summaries', 'risks') 
  AND column_name LIKE '%percentile%' OR column_name LIKE '%_p[0-9][0-9]'
ORDER BY table_name, column_name;