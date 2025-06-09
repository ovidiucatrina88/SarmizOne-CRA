-- Fix the control_type column in control_library table
ALTER TABLE control_library 
ALTER COLUMN control_type TYPE control_type
USING control_type::text::control_type;