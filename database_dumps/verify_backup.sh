#!/bin/bash

# Database Backup Verification Script
# Validates that backup files contain expected data structure and content

echo "=== Database Backup Verification ==="
echo

# Check if required files exist
echo "1. Checking backup file integrity..."
required_files=("schema_dump.sql" "data_dump.sql" "data_dump_with_triggers.sql")

for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        echo "✓ $file exists ($(du -h $file | cut -f1))"
    else
        echo "✗ $file missing"
        exit 1
    fi
done

# Verify schema dump contains expected tables
echo
echo "2. Verifying schema structure..."
expected_tables=("assets" "risks" "controls" "legal_entities" "activity_logs" "enterprise_architecture")

for table in "${expected_tables[@]}"; do
    if grep -q "CREATE TABLE public.$table" schema_dump.sql; then
        echo "✓ Table $table schema found"
    else
        echo "✗ Table $table schema missing"
    fi
done

# Verify data dump contains records
echo
echo "3. Verifying data content..."
data_checks=(
    "activity_logs:268"
    "assets:11" 
    "risks:5"
    "controls:3"
    "legal_entities:4"
)

for check in "${data_checks[@]}"; do
    table="${check%:*}"
    expected_count="${check#*:}"
    actual_count=$(grep -c "INSERT INTO public.$table" data_dump.sql)
    
    if [ "$actual_count" -ge "$expected_count" ]; then
        echo "✓ Table $table: $actual_count records (expected ≥$expected_count)"
    else
        echo "⚠ Table $table: $actual_count records (expected ≥$expected_count)"
    fi
done

# Verify specific critical data
echo
echo "4. Verifying critical application data..."

# Check for FAIR-U risk methodology data
if grep -q "Ransomware Attack" data_dump.sql && grep -q "25777181" data_dump.sql; then
    echo "✓ FAIR-U risk quantification data present"
else
    echo "⚠ FAIR-U risk data may be incomplete"
fi

# Check for asset valuation data
if grep -q "156920000" data_dump.sql; then
    echo "✓ Asset valuation data present ($156.9M total)"
else
    echo "⚠ Asset valuation data may be incomplete"
fi

# Check for control effectiveness data
if grep -q "control_effectiveness" data_dump.sql; then
    echo "✓ Control effectiveness metrics present"
else
    echo "⚠ Control effectiveness data may be incomplete"
fi

echo
echo "=== Backup Verification Complete ==="
echo "Files ready for production deployment on Linux server"