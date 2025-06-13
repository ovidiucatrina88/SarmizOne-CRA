# Changelog

## [Unreleased]

### Added
- **IRIS 2025 Actuarial Data Integration**: Enhanced FAIR risk calculations with empirically-derived parameters from Cyentia IRIS 2025 report
  - Log-normal distribution for loss magnitude sampling based on industry data (μ=14.88, σ=1.95 for global; μ=12.79, σ=1.77 for SMB)
  - Beta-PERT distribution for Threat Event Frequency with webapp-specific scaling (0.009-0.046 annual frequency)
  - Automatic parameter selection based on organization size (SMB vs Enterprise)
  - Maintains backward compatibility with existing triangular distributions when IRIS parameters not provided

### Enhanced
- Monte Carlo simulation engine now supports both traditional triangular and IRIS actuarial sampling methods
- Risk calculation adapter automatically populates IRIS 2025 parameters for enhanced accuracy
- Added new utility functions: `logNormal()` and `betaPert()` for actuarial sampling

### Technical Details
- Extended `MonteCarloInput` interface with optional `tefMin`, `tefMode`, `tefMax`, `plMu`, and `plSigma` parameters
- IRIS parameters applied automatically in risk calculations without requiring UI changes
- All existing dashboards render with identical structure while using updated empirical data

## Previous Releases
[Previous changelog entries would go here]