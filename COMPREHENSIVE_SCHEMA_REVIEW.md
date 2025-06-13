# Comprehensive Schema Alignment Review

## Database Tables Analysis

### 1. Assets Table
**Schema Fields**: id, asset_id, name, type, business_unit, owner, confidentiality, integrity, availability, asset_value, regulatory_impact, external_internal, dependencies, description, created_at, currency, agent_count, legal_entity, status, parent_id, hierarchy_level, architecture_domain

**Pages/Forms**:
- ✅ `/assets` - Asset management page
- ✅ `/asset-hierarchy` - Asset hierarchy management
- ✅ Asset creation/edit forms

**Issues Found**:
- Missing architecture_domain field in some forms
- hierarchy_level enum validation needed

### 2. Controls Table
**Schema Fields**: id, control_id, name, description, associated_risks, control_type, control_category, implementation_status, control_effectiveness, implementation_cost, notes, created_at, updated_at, cost_per_agent, is_per_agent_pricing, library_item_id, item_type, asset_id, risk_id, legal_entity_id, deployed_agent_count, e_avoid, e_deter, e_detect, e_resist, var_freq, var_duration, compliance_framework

**Pages/Forms**:
- ✅ `/controls` - Control instances page
- ✅ Control form with enhanced fields
- ⚠️ Missing: e_avoid, e_deter, e_detect, e_resist, var_freq, var_duration fields in forms

### 3. Control Library Table
**Schema Fields**: id, control_id, name, description, control_type, control_category, implementation_status, control_effectiveness, implementation_cost, cost_per_agent, is_per_agent_pricing, notes, nist_csf, iso27001, created_at, updated_at, associated_risks, library_item_id, item_type, asset_id, risk_id, legal_entity_id, deployed_agent_count, compliance_framework, cloud_domain, nist_mappings, pci_mappings, cis_mappings, gap_level, implementation_guidance, architectural_relevance, organizational_relevance, ownership_model, cloud_service_model

**Pages/Forms**:
- ✅ `/control-library` - Control library management
- ⚠️ Missing: nist_csf, iso27001 arrays in forms
- ⚠️ Missing: gap_level, implementation_guidance, ownership_model, cloud_service_model fields

### 4. Risks Table
**Schema Fields**: Extensive FAIR methodology fields including contact_frequency_min/avg/max, probability_of_action_min/avg/max, threat_capability_min/avg/max, resistance_strength_min/avg/max, susceptibility_min/avg/max, loss_event_frequency_min/avg/max, primary_loss_magnitude_min/avg/max, secondary_loss_magnitude_min/avg/max, etc.

**Pages/Forms**:
- ✅ `/risks` - Risk management page
- ✅ Risk form with FAIR methodology fields
- ✅ Triangular distribution inputs

### 5. Vulnerabilities Table
**Schema Fields**: id, cve_id, title, description, cvss_score, cvss_vector, status, severity, published_date, last_modified, created_at, updated_at

**Pages/Forms**:
- ✅ `/vulnerabilities` - Vulnerability management page
- ⚠️ Need to verify all CVSS fields are properly handled

### 6. Risk Summaries Table
**Schema Fields**: Complex percentile exposure fields, curve data, legal entity tracking

**Pages/Forms**:
- ✅ Dashboard with risk summary display
- ✅ Loss Exceedance Curve visualization

## Critical Issues to Fix

### High Priority
1. **Control Form Enhancement Needed**:
   - Add e_avoid, e_deter, e_detect, e_resist fields
   - Add var_freq, var_duration fields
   - Add nist_csf, iso27001 arrays for control library

2. **Control Library Form Missing Fields**:
   - gap_level dropdown
   - implementation_guidance textarea
   - ownership_model (CSP-Owned, CSC-Owned, Shared)
   - cloud_service_model array (IaaS, PaaS, SaaS)

3. **Asset Form Validation**:
   - hierarchy_level enum validation
   - architecture_domain field consistency

### Medium Priority
1. **API Response Type Safety**: Fix TypeScript errors for API responses
2. **Form Validation**: Ensure all enum fields have proper validation
3. **Missing Field UI**: Add UI components for all database fields

### Low Priority
1. **Performance**: Optimize form rendering
2. **UX**: Improve field descriptions and help text

## Action Plan

1. **Immediate Fixes**:
   - Fix SelectItem empty value error
   - Add missing control effectiveness fields
   - Enhance control library form

2. **Schema Alignment**:
   - Update all forms to include missing database fields
   - Add proper validation for all enum fields
   - Ensure type safety for all API calls

3. **Testing**:
   - Test all forms with database constraints
   - Verify API endpoints handle all fields
   - Check data persistence and retrieval