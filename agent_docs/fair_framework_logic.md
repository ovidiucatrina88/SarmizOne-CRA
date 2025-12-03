# FAIR Framework Logic

This document outlines the logic of the FAIR (Factor Analysis of Information Risk) Framework, integrating the core FAIR Model with FAIR-CAM (Controls Analytics Model) and FAIR-MAM (Materiality Assessment Model).

## 1. Framework Overview

The FAIR Framework provides a comprehensive approach to cyber risk management by combining three standards:

-   **FAIR Model (v3.0)**: The foundation for quantifying risk, decomposing it into Loss Event Frequency (LEF) and Loss Magnitude (LM).
-   **FAIR-CAM (v1.0)**: Describes the "physiology" of controls—how they function individually and as a system to affect risk factors.
-   **FAIR-MAM (v1.0)**: Provides a granular taxonomy for Loss Magnitude, breaking down financial losses into specific cost modules.

Together, they enable a data-driven, quantitative approach to managing cyber risk, aligning security efforts with business objectives.

## 2. FAIR Model (The Foundation)

The FAIR Model quantifies risk as:
**Risk = Loss Event Frequency (LEF) × Loss Magnitude (LM)**

-   **Loss Event Frequency (LEF)**: How often a loss event is expected to occur.
    -   Driven by **Threat Event Frequency (TEF)** and **Vulnerability (Susceptibility)**.
-   **Loss Magnitude (LM)**: The financial impact of a loss event.
    -   Driven by **Primary Loss** and **Secondary Loss**.

## 3. FAIR-CAM (Controls Analytics Model)

FAIR-CAM explains *how* controls reduce risk. It categorizes controls into three functional domains:

### A. Loss Event Controls
Directly affect the frequency or magnitude of loss.
1.  **Avoidance**: Reduce frequency of contact between threats and assets (e.g., firewall, IP filtering). -> *Reduces Contact Frequency*.
2.  **Deterrence**: Reduce probability of action after contact (e.g., warning banners, legal threats). -> *Reduces Probability of Action*.
3.  **Resistance**: Reduce probability that an action results in a loss (e.g., MFA, encryption, patching). -> *Reduces Susceptibility*.
4.  **Visibility**: Provide evidence of anomalous activity (e.g., logging).
5.  **Monitoring**: Review data from visibility controls (e.g., SIEM, SOC).
6.  **Recognition**: Differentiate normal from abnormal activity (e.g., threat hunting).
7.  **Containment**: Stop the threat (e.g., incident response, isolation). -> *Reduces Loss Magnitude*.
8.  **Resilience**: Restore operations (e.g., backups). -> *Reduces Loss Magnitude*.
9.  **Loss Reduction**: Minimize realized losses (e.g., insurance, legal defense). -> *Reduces Loss Magnitude*.

**Boolean Logic**:
-   **Prevention** (Avoidance, Deterrence, Resistance) often follows **OR** logic (if any works, event is prevented).
-   **Detection** (Visibility, Monitoring, Recognition) often follows **AND** logic (all must work for detection to succeed).

### B. Variance Management Controls (VMCs)
Ensure the reliability of Loss Event Controls.
-   **Variance Prevention**: Reduce frequency of control failures (e.g., change management, automated config).
-   **Variance Identification**: Detect failures (e.g., vulnerability scanning, audit).
-   **Variance Correction**: Fix failures (e.g., patching, remediation).

**Key Concept**: **Operational Efficacy** = Intended Efficacy × Reliability (Time in intended state).

### C. Decision Support Controls (DSCs)
Ensure decisions align with organizational objectives.
-   **Expectations**: Policies, standards.
-   **Situational Awareness**: Risk analysis, reporting, threat intel.
-   **Incentives**: MBOs, accountability.

## 4. FAIR-MAM (Materiality Assessment Model)

FAIR-MAM provides a detailed cost breakdown for Loss Magnitude, essential for SEC reporting and accurate quantification.

### 10 Primary Cost Modules
1.  **Information Privacy**: PCI, PFI, PHI, PII breach costs.
2.  **Proprietary Data Loss**: IP, trade secrets, corporate info.
3.  **Business Interruption**: Revenue loss, operating expenses.
4.  **Cyber Extortion**: Ransom payments, negotiation costs.
5.  **Network Security**: Forensics, remediation, data restoration.
6.  **Financial Fraud**: Theft of cash/monetary instruments.
7.  **Media Content**: Fraudulent use of brand/content.
8.  **Hardware Bricking**: Replacement of destroyed systems.
9.  **Post-Breach Security**: Mandated improvements.
10. **Reputational Damage**: Future revenue loss, increased costs.

### Usage
-   **Proactive**: Model potential losses for top risk scenarios to prioritize investments.
-   **Reactive**: Assess actual financial impact during/after an incident for materiality disclosure (e.g., SEC Form 8-K).

## Integration Logic for the Agent

When analyzing risk or recommending controls:
1.  **Identify the Scenario**: Asset + Threat.
2.  **Map Controls**: Use FAIR-CAM to map controls to the specific risk factor they influence (e.g., MFA -> Resistance -> Susceptibility).
3.  **Assess Efficacy**: Consider not just intended efficacy but also reliability (VMCs).
4.  **Quantify Loss**: Use FAIR-MAM categories to estimate potential financial impact, ensuring no cost category is overlooked.
5.  **Determine Materiality**: Compare total estimated loss against organizational thresholds.
