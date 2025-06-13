# IRIS 2025 Implementation Guide

## Overview
The IRIS 2025 integration replaces basic triangular distributions with empirically-derived actuarial parameters from the Cyentia IRIS 2025 report. This provides industry-backed risk calculations using real incident data.

## Technical Implementation

### 1. Core Distribution Functions

**Log-Normal Distribution for Loss Magnitude**
```typescript
export function logNormal(mu: number, sigma: number): number {
  const u1 = Math.random();
  const u2 = Math.random();
  const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  return Math.exp(mu + sigma * z);
}
```

**Beta-PERT Distribution for Threat Event Frequency**
```typescript
export function betaPert(min: number, mode: number, max: number): number {
  const alpha = 1 + 4 * (mode - min) / (max - min);
  const beta = 1 + 4 * (max - mode) / (max - min);
  const u1 = Math.random();
  const u2 = Math.random();
  const y = Math.pow(u1, 1 / alpha) / (Math.pow(u1, 1 / alpha) + Math.pow(u2, 1 / beta));
  return min + y * (max - min);
}
```

### 2. IRIS Parameters Integration

**Enhanced MonteCarloInput Interface**
```typescript
export interface MonteCarloInput {
  // Traditional FAIR parameters
  cfMin: number;
  cfMode: number;
  cfMax: number;
  // ... other standard parameters
  
  // IRIS 2025 actuarial parameters
  tefMin?: number;    // Threat Event Frequency minimum
  tefMode?: number;   // Threat Event Frequency mode
  tefMax?: number;    // Threat Event Frequency maximum
  plMu?: number;      // Primary Loss log-mean
  plSigma?: number;   // Primary Loss log-standard deviation
}
```

### 3. Automatic Parameter Application

The system automatically applies IRIS parameters in the Monte Carlo simulation:

```typescript
// Frequency handling - use IRIS TEF if provided
if (params.tefMin !== undefined) {
  cf = 1;  // exactly one annual opportunity
  poa = betaPert(params.tefMin, params.tefMode!, params.tefMax!);
}

// Loss magnitude handling - use log-normal if IRIS parameters provided
const primaryLoss = params.plMu !== undefined
  ? logNormal(params.plMu, params.plSigma!)
  : triangular(plMin, plMode, plMax);
```

## IRIS 2025 Benchmarking Data

### Industry Parameters (stored in database)

**Threat Event Frequency (Web Applications)**
- Technology sector: TEF_WEBAPP_MIN = 0.009, TEF_WEBAPP_MODE = 0.035, TEF_WEBAPP_MAX = 0.046
- Annual frequency range: 0.9% to 4.6% per year

**Loss Magnitude Parameters**
- Global organizations: μ = 14.88, σ = 1.95 (geometric mean: $2.9M)
- SMB organizations: μ = 12.79, σ = 1.77 (geometric mean: $357K)

## How to Use for Benchmarking

### 1. API Endpoint Comparison

**Calculate with IRIS Parameters**
```bash
curl "http://localhost:5000/api/risks/RISK-DATA-299/calculate"
```

**Response includes Monte Carlo results with percentiles:**
```json
{
  "monteCarloResults": {
    "mean": 2258994.55,
    "p05": 677698.37,
    "p25": 1355396.73,
    "p50": 2258994.55,
    "p75": 3162592.38,
    "p95": 4517989.11,
    "max": 6776983.66
  }
}
```

### 2. Database Benchmarking Queries

**View IRIS Parameters**
```sql
SELECT sector, metric, value_numeric, unit 
FROM industry_insights 
WHERE source = 'IRIS 2025' 
ORDER BY sector, metric;
```

**Compare Organization Risk Levels**
```sql
-- Get risk exposure by organization size
SELECT 
  'SMB' as org_type,
  AVG(residual_risk) as avg_exposure,
  PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY residual_risk) as median_exposure
FROM risks 
WHERE organization_size = 'SMB'
UNION ALL
SELECT 
  'Enterprise' as org_type,
  AVG(residual_risk) as avg_exposure,
  PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY residual_risk) as median_exposure
FROM risks 
WHERE organization_size = 'Enterprise';
```

### 3. Risk Comparison Dashboard

**Traditional vs IRIS Calculations**
- Traditional: Uses triangular distributions for all parameters
- IRIS Enhanced: Uses log-normal (loss) + beta-PERT (frequency) distributions

**Key Metrics for Comparison:**
- P95 exposure levels (Value at Risk)
- Mean annual loss expectancy
- Loss exceedance curves
- Risk concentration by asset type

### 4. Benchmarking Scenarios

**Industry Peer Comparison**
1. Technology sector web applications: TEF 0.009-0.046 annually
2. SMB vs Enterprise loss magnitudes: $357K vs $2.9M geometric means
3. Percentile analysis against industry baselines

**Control Effectiveness Benchmarking**
- Compare residual risk reduction with/without controls
- ROI analysis using IRIS-calibrated baselines
- Control portfolio optimization against industry standards

### 5. API Usage Examples

**Get Industry Insights**
```bash
curl "http://localhost:5000/api/industry-insights/Technology/webapp"
```

**Risk Summary with IRIS Context**
```bash
curl "http://localhost:5000/api/dashboard/summary" | grep -A5 exposureCurveData
```

**Bulk Risk Assessment**
```bash
curl "http://localhost:5000/api/risks" | jq '.data[] | {riskId, inherentRisk, residualRisk}'
```

## Benefits of IRIS 2025 Integration

### 1. Empirical Accuracy
- Replaces subjective estimates with industry data
- Based on analysis of real security incidents
- Provides statistically validated parameters

### 2. Peer Benchmarking
- Compare against industry standards
- Identify outlier risks requiring attention
- Validate risk assessment assumptions

### 3. Regulatory Compliance
- Supports quantitative risk frameworks
- Provides audit-ready calculations
- Demonstrates due diligence in risk assessment

### 4. Decision Support
- More accurate loss forecasting
- Better informed risk treatment decisions
- Improved capital allocation for security investments

## Advanced Usage

### Custom Benchmarking Queries

**Risk Heat Map by Industry Sector**
```sql
WITH sector_risks AS (
  SELECT 
    'Technology' as sector,
    COUNT(*) as risk_count,
    AVG(residual_risk) as avg_exposure,
    MAX(residual_risk) as max_exposure
  FROM risks r
  JOIN assets a ON a.asset_id = ANY(r.associated_assets)
  WHERE a.type = 'application'
)
SELECT * FROM sector_risks;
```

**Control ROI Analysis**
```sql
SELECT 
  c.control_id,
  c.name,
  c.implementation_cost,
  SUM(r.inherent_risk - r.residual_risk) as total_risk_reduction,
  CASE 
    WHEN c.implementation_cost > 0 
    THEN (SUM(r.inherent_risk - r.residual_risk) / c.implementation_cost) 
    ELSE NULL 
  END as roi_ratio
FROM controls c
JOIN risk_controls rc ON rc.control_id = c.id
JOIN risks r ON r.id = rc.risk_id
GROUP BY c.id, c.control_id, c.name, c.implementation_cost
ORDER BY roi_ratio DESC NULLS LAST;
```

## Integration Points

The IRIS 2025 parameters integrate seamlessly with:
- Risk calculation engine
- Monte Carlo simulations  
- Dashboard visualizations
- Loss exceedance curves
- Risk summary aggregations

All existing UI components continue to work while benefiting from enhanced actuarial accuracy.