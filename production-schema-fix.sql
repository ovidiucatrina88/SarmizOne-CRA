-- Fix production database schema for user management
-- Make display_name nullable to allow user creation

ALTER TABLE users ALTER COLUMN display_name DROP NOT NULL;

-- Update existing users with null display_name
UPDATE users 
SET display_name = COALESCE(
  CASE 
    WHEN first_name IS NOT NULL AND last_name IS NOT NULL 
    THEN TRIM(first_name || ' ' || last_name)
    WHEN first_name IS NOT NULL 
    THEN first_name
    ELSE username
  END
)
WHERE display_name IS NULL;

-- Make display_name NOT NULL again after fixing data
ALTER TABLE users ALTER COLUMN display_name SET NOT NULL;