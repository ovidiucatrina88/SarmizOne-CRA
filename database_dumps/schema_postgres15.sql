--
-- PostgreSQL database dump
--

-- Dumped from database version 16.9
-- Dumped by pg_dump version 16.5

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', 'public', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: asset_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.asset_status AS ENUM (
    'Active',
    'Decommissioned',
    'To Adopt'
);


--
-- Name: asset_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.asset_type AS ENUM (
    'data',
    'application',
    'device',
    'system',
    'network',
    'facility',
    'personnel',
    'other',
    'strategic_capability',
    'value_capability',
    'business_service',
    'product_service',
    'application_service',
    'technical_component'
);


--
-- Name: cia_rating; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.cia_rating AS ENUM (
    'low',
    'medium',
    'high'
);


--
-- Name: control_category; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.control_category AS ENUM (
    'technical',
    'administrative',
    'physical'
);


--
-- Name: control_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.control_type AS ENUM (
    'preventive',
    'detective',
    'corrective'
);


--
-- Name: currency; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.currency AS ENUM (
    'USD',
    'EUR'
);


--
-- Name: external_internal; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.external_internal AS ENUM (
    'external',
    'internal'
);


--
-- Name: hierarchy_level; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.hierarchy_level AS ENUM (
    'strategic_capability',
    'value_capability',
    'business_service',
    'application_service',
    'technical_component'
);


--
-- Name: implementation_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.implementation_status AS ENUM (
    'not_implemented',
    'in_progress',
    'fully_implemented',
    'planned'
);


--
-- Name: item_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.item_type AS ENUM (
    'template',
    'instance'
);


--
-- Name: relationship_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.relationship_type AS ENUM (
    'part_of',
    'depends_on',
    'contains'
);


--
-- Name: risk_category; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.risk_category AS ENUM (
    'operational',
    'strategic',
    'compliance',
    'financial'
);


--
-- Name: risk_response_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.risk_response_type AS ENUM (
    'accept',
    'avoid',
    'transfer',
    'mitigate'
);


--
-- Name: severity; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.severity AS ENUM (
    'low',
    'medium',
    'high',
    'critical'
);


--
-- Name: calculate_materiality_weighted_costs(integer); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.calculate_materiality_weighted_costs(p_risk_id integer) RETURNS TABLE(total_cost numeric, weighted_costs jsonb)
    LANGUAGE plpgsql
    AS $$
DECLARE
  risk_data RECORD;
  module_weights NUMERIC;
BEGIN
  -- Get risk data
  SELECT residual_risk_avg INTO risk_data
  FROM risks 
  WHERE id = p_risk_id;
  
  -- Calculate total weights for normalization
  SELECT COALESCE(SUM(weight), 0) INTO module_weights
  FROM risk_costs
  WHERE risk_id = p_risk_id;
  
  -- If no weights, return zero
  IF module_weights = 0 THEN
    RETURN QUERY SELECT 0::NUMERIC AS total_cost, '{}'::JSONB AS weighted_costs;
    RETURN;
  END IF;
  
  -- Calculate costs with materiality weights
  RETURN QUERY
  WITH module_costs AS (
    SELECT 
      cm.id,
      cm.name,
      cm.cost_type,
      cm.cost_factor,
      rc.weight,
      CASE
        WHEN cm.cost_type = 'fixed' THEN 
          cm.cost_factor * (rc.weight / module_weights)
        WHEN cm.cost_type = 'per_event' THEN 
          cm.cost_factor * 1 * (rc.weight / module_weights) -- Assuming 1 event
        WHEN cm.cost_type = 'per_hour' THEN 
          cm.cost_factor * 8 * (rc.weight / module_weights) -- Assuming 8 hours
        WHEN cm.cost_type = 'percentage' THEN 
          risk_data.residual_risk_avg * cm.cost_factor * (rc.weight / module_weights)
        ELSE 0
      END AS module_cost
    FROM 
      cost_modules cm
      JOIN risk_costs rc ON cm.id = rc.cost_module_id
    WHERE 
      rc.risk_id = p_risk_id
  )
  SELECT 
    COALESCE(SUM(module_cost), 0) AS total_cost,
    COALESCE(
      jsonb_object_agg(
        id, 
        jsonb_build_object(
          'name', name,
          'cost', module_cost,
          'weight', weight,
          'costType', cost_type
        )
      ),
      '{}'::JSONB
    ) AS weighted_costs
  FROM 
    module_costs;
END;
$$;


--
-- Name: generate_risk_id(text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.generate_risk_id(risk_name text) RETURNS text
    LANGUAGE plpgsql
    AS $$
DECLARE
    cleaned_name TEXT;
BEGIN
    -- Clean the name by removing special characters and taking first 15 characters
    cleaned_name := upper(regexp_replace(substring(risk_name, 1, 15), '[^a-zA-Z0-9]', '-', 'g'));
    -- Generate a random number between 100-999
    RETURN 'RISK-' || cleaned_name || '-' || (100 + floor(random() * 900)::int)::text;
END;
$$;


--
-- Name: link_vulnerabilities_to_risk(integer, text[]); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.link_vulnerabilities_to_risk(p_risk_id integer, p_asset_ids text[]) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_vuln_ids TEXT[];
  v_avg_e_detect NUMERIC(3,2);
  v_avg_e_resist NUMERIC(3,2);
BEGIN
  -- Get all CVE IDs for vulnerabilities affecting the specified assets
  SELECT array_agg(DISTINCT cve_id) INTO v_vuln_ids
  FROM vulnerabilities
  WHERE asset_id = ANY(p_asset_ids)
    AND status IN ('open', 'in_progress');
  
  -- Calculate average detection efficacy from vulnerabilities
  SELECT AVG(e_detect) INTO v_avg_e_detect
  FROM vulnerabilities
  WHERE asset_id = ANY(p_asset_ids)
    AND status IN ('open', 'in_progress')
    AND e_detect IS NOT NULL;
  
  -- Calculate average resistance efficacy from vulnerabilities
  SELECT AVG(e_resist) INTO v_avg_e_resist
  FROM vulnerabilities
  WHERE asset_id = ANY(p_asset_ids)
    AND status IN ('open', 'in_progress')
    AND e_resist IS NOT NULL;
  
  -- Update the risk record with vulnerability IDs and influence the FAIR parameters
  UPDATE risks SET
    vulnerability_ids = v_vuln_ids,
    -- Only update resistanceStrength values if we have vulnerability data
    resistance_strength_min = CASE WHEN v_avg_e_resist IS NOT NULL 
                             THEN LEAST(resistance_strength_min, v_avg_e_resist * 10) 
                             ELSE resistance_strength_min END,
    resistance_strength_avg = CASE WHEN v_avg_e_resist IS NOT NULL 
                             THEN (resistance_strength_avg + (v_avg_e_resist * 10))/2 
                             ELSE resistance_strength_avg END,
    updated_at = now()
  WHERE id = p_risk_id;
END;
$$;


--
-- Name: remediate_vulnerability(text, text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.remediate_vulnerability(p_asset_id text, p_cve_id text) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_discovery_date TIMESTAMP;
  v_variance_duration INTEGER;
BEGIN
  -- Get the discovery date to calculate variance duration
  SELECT discovery_date INTO v_discovery_date
  FROM vulnerabilities
  WHERE asset_id = p_asset_id AND cve_id = p_cve_id AND status = 'open';
  
  -- Calculate variance duration in days
  IF v_discovery_date IS NOT NULL THEN
    v_variance_duration := EXTRACT(EPOCH FROM (now() - v_discovery_date))/86400;
  ELSE
    v_variance_duration := 0;
  END IF;
  
  -- Update the vulnerability record
  UPDATE vulnerabilities SET
    status = 'remediated',
    remediation_date = now(),
    variance_duration = v_variance_duration,
    updated_at = now()
  WHERE asset_id = p_asset_id AND cve_id = p_cve_id AND status = 'open';
END;
$$;


--
-- Name: scheduled_vulnerability_updates(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.scheduled_vulnerability_updates() RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Step 1: Update vulnerability metrics from CVSS data
    PERFORM update_vulnerability_efficacy_metrics();
    
    -- Step 2: Update control effectiveness based on vulnerabilities
    PERFORM update_control_effectiveness();
    
    -- Step 3: Update risk parameters based on linked vulnerabilities
    PERFORM update_risk_parameters_from_linked_vulnerabilities();
    
    -- Log the update (using username instead of reserved word 'user')
    INSERT INTO activity_logs (activity, "user", entity, entity_type, entity_id)
    VALUES ('Scheduled vulnerability metrics update', 'system', 'vulnerability_metrics', 'system', 'scheduled');
END;
$$;


--
-- Name: update_control_effectiveness(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_control_effectiveness() RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_control RECORD;
    v_vulns_count INTEGER;
    v_avg_e_detect NUMERIC(3,2);
    v_avg_e_resist NUMERIC(3,2);
    v_avg_var_freq NUMERIC;
    v_avg_var_duration NUMERIC;
    v_total_efficacy NUMERIC(3,2);
BEGIN
    -- Process each control
    FOR v_control IN 
        SELECT c.id, c.control_id, c.asset_id
        FROM controls c
        WHERE c.asset_id IS NOT NULL
          AND c.implementation_status = 'implemented'
    LOOP
        -- Get vulnerability metrics for the associated asset
        SELECT 
            COUNT(*), 
            AVG(e_detect), 
            AVG(e_resist),
            AVG(variance_freq),
            AVG(variance_duration)
        INTO 
            v_vulns_count, 
            v_avg_e_detect, 
            v_avg_e_resist,
            v_avg_var_freq,
            v_avg_var_duration
        FROM vulnerabilities
        WHERE asset_id = v_control.asset_id
          AND status IN ('open', 'in_progress');
        
        -- Update control effectiveness metrics if we have vulnerability data
        IF v_vulns_count > 0 THEN
            -- Update FAIR-CAM parameters based on vulnerability metrics
            UPDATE controls SET
                -- Detection effectiveness is directly related to the scanner's ability to detect vulnerabilities
                e_detect = COALESCE(v_avg_e_detect, e_detect),
                
                -- Resistance effectiveness is related to the severity of unpatched vulnerabilities
                e_resist = COALESCE(v_avg_e_resist, e_resist),
                
                -- Variance metrics capture the reliability of the control
                var_freq = COALESCE(v_avg_var_freq, var_freq),
                var_duration = COALESCE(v_avg_var_duration, var_duration),
                
                -- Overall control effectiveness is recalculated
                -- Using a simplified weighted formula that considers all factors
                control_effectiveness = CASE
                    WHEN v_avg_e_detect IS NULL OR v_avg_e_resist IS NULL THEN
                        control_effectiveness -- Keep existing if missing data
                    ELSE
                        -- Calculate with reliability factor - controls with high variance are less effective
                        ROUND(
                            (
                                COALESCE(v_avg_e_detect, 0.5) * 0.25 + 
                                COALESCE(v_avg_e_resist, 0.5) * 0.5 +
                                COALESCE(e_avoid, 0) * 0.15 + 
                                COALESCE(e_deter, 0) * 0.1
                            ) * 
                            -- Apply reliability reduction factor
                            (1.0 - LEAST(0.5, (COALESCE(v_avg_var_freq, 0) * 0.05) + 
                                         (COALESCE(v_avg_var_duration, 0) * 0.001)))
                            * 100 -- Convert to percentage
                        , 2) -- Round to 2 decimal places
                    END,
                
                updated_at = now()
            WHERE id = v_control.id;
        END IF;
    END LOOP;
END;
$$;


--
-- Name: update_risk_parameters_from_linked_vulnerabilities(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_risk_parameters_from_linked_vulnerabilities() RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_risk RECORD;
    v_avg_e_resist NUMERIC(3,2);
    v_avg_e_detect NUMERIC(3,2);
    v_avg_var_freq INTEGER;
    v_avg_var_duration INTEGER;
    v_vuln_count INTEGER;
BEGIN
    -- Process each risk that has linked vulnerabilities
    FOR v_risk IN 
        SELECT r.id, r.risk_id, r.vulnerability_ids, r.associated_assets
        FROM risks r
        WHERE array_length(r.vulnerability_ids, 1) > 0
          AND array_length(r.associated_assets, 1) > 0
    LOOP
        -- Calculate the average metrics from linked vulnerabilities
        SELECT 
            COUNT(*),
            AVG(e_resist),
            AVG(e_detect),
            AVG(variance_freq),
            AVG(variance_duration)
        INTO
            v_vuln_count,
            v_avg_e_resist,
            v_avg_e_detect,
            v_avg_var_freq,
            v_avg_var_duration
        FROM vulnerabilities
        WHERE cve_id = ANY(v_risk.vulnerability_ids)
          AND asset_id = ANY(v_risk.associated_assets)
          AND status IN ('open', 'in_progress');
        
        -- Only update if we found relevant vulnerabilities
        IF v_vuln_count > 0 THEN
            -- Update risk parameters based on vulnerability metrics
            UPDATE risks SET
                -- Convert e_resist to resistanceStrength scale (0-10)
                resistance_strength_min = GREATEST(1, ROUND(v_avg_e_resist * 8)),
                resistance_strength_avg = ROUND(v_avg_e_resist * 10),
                resistance_strength_max = LEAST(10, ROUND(v_avg_e_resist * 12)),
                
                -- Update resistance strength confidence based on variance data
                resistance_strength_confidence = CASE
                    WHEN v_avg_var_freq > 5 OR v_avg_var_duration > 90 THEN 'low'
                    WHEN v_avg_var_freq > 2 OR v_avg_var_duration > 30 THEN 'medium'
                    ELSE 'high'
                END,
                
                -- Detection affects threat event frequency via LEF calculation
                -- Lower detection capability means higher threat frequency
                threat_event_frequency_min = CASE
                    WHEN v_avg_e_detect IS NOT NULL THEN
                        threat_event_frequency_min * (1 + (1 - v_avg_e_detect) * 0.5)
                    ELSE threat_event_frequency_min
                END,
                
                threat_event_frequency_avg = CASE
                    WHEN v_avg_e_detect IS NOT NULL THEN
                        threat_event_frequency_avg * (1 + (1 - v_avg_e_detect) * 0.3)
                    ELSE threat_event_frequency_avg
                END,
                
                threat_event_frequency_max = CASE
                    WHEN v_avg_e_detect IS NOT NULL THEN
                        threat_event_frequency_max * (1 + (1 - v_avg_e_detect) * 0.2)
                    ELSE threat_event_frequency_max
                END,
                
                threat_event_frequency_confidence = CASE
                    WHEN v_avg_var_freq > 5 OR v_avg_var_duration > 90 THEN 'low'
                    WHEN v_avg_var_freq > 2 OR v_avg_var_duration > 30 THEN 'medium'
                    ELSE 'high'
                END,
                
                -- Recalculate susceptibility values (vulnerability)
                -- This is typically threatCapability / resistanceStrength in FAIR
                susceptibility_min = CASE
                    WHEN v_avg_e_resist IS NOT NULL AND threat_capability_min > 0 THEN
                        ROUND((threat_capability_min / (v_avg_e_resist * 10.0)), 2)
                    ELSE susceptibility_min
                END,
                
                susceptibility_avg = CASE
                    WHEN v_avg_e_resist IS NOT NULL AND threat_capability_avg > 0 THEN
                        ROUND((threat_capability_avg / (v_avg_e_resist * 10.0)), 2)
                    ELSE susceptibility_avg
                END,
                
                susceptibility_max = CASE
                    WHEN v_avg_e_resist IS NOT NULL AND threat_capability_max > 0 THEN
                        ROUND((threat_capability_max / (v_avg_e_resist * 10.0)), 2)
                    ELSE susceptibility_max
                END,
                
                susceptibility_confidence = CASE
                    WHEN v_avg_var_freq > 5 OR v_avg_var_duration > 90 THEN 'low'
                    WHEN v_avg_var_freq > 2 OR v_avg_var_duration > 30 THEN 'medium'
                    ELSE 'high'
                END,
                
                -- Update timestamp
                updated_at = now()
            WHERE id = v_risk.id;
            
            -- Now recalculate loss event frequency (LEF = TEF * Susceptibility)
            UPDATE risks r
            SET
                loss_event_frequency_min = r.threat_event_frequency_min * r.susceptibility_min,
                loss_event_frequency_avg = r.threat_event_frequency_avg * r.susceptibility_avg,
                loss_event_frequency_max = r.threat_event_frequency_max * r.susceptibility_max,
                loss_event_frequency_confidence = LEAST(r.threat_event_frequency_confidence, r.susceptibility_confidence)
            WHERE id = v_risk.id;
            
            -- Finally, update the inherent and residual risk values
            -- This assumes your calculateRiskValues function has been converted to SQL
            -- In reality you might need to call an external function or API here
            
            -- Placeholder for risk calculation
            UPDATE risks r
            SET
                -- Simplified formula for inherent risk: LEF * Loss Magnitude
                inherent_risk = ROUND(
                    r.loss_event_frequency_avg * r.loss_magnitude_avg
                )::TEXT,
                
                -- Simplified formula for residual risk (applying control effectiveness)
                residual_risk = ROUND(
                    r.loss_event_frequency_avg * r.loss_magnitude_avg * 
                    -- Reduction factor based on controls
                    (1.0 - (
                        SELECT COALESCE(AVG(c.control_effectiveness), 0) / 100
                        FROM risk_controls rc
                        JOIN controls c ON rc.control_id = c.id
                        WHERE rc.risk_id = r.id
                    ))
                )::TEXT,
                
                updated_at = now()
            WHERE id = v_risk.id;
        END IF;
    END LOOP;
END;
$$;


--
-- Name: update_risk_parameters_from_vulnerabilities(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_risk_parameters_from_vulnerabilities() RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_risk RECORD;
    v_asset_ids TEXT[];
    v_vuln_ids TEXT[];
    v_avg_cvss NUMERIC;
    v_control_ids INTEGER[];
    v_control_e_detect NUMERIC;
    v_control_e_resist NUMERIC;
    v_control_e_deter NUMERIC;
    v_control_e_avoid NUMERIC;
    v_baseline_resistance NUMERIC;
BEGIN
    -- Process each risk
    FOR v_risk IN 
        SELECT r.id, r.risk_id, r.associated_assets
        FROM risks r
        WHERE r.item_type = 'instance' -- Only process actual risk instances, not templates
    LOOP
        -- Get the associated asset IDs for this risk
        v_asset_ids := r.associated_assets;
        
        -- Skip risks with no associated assets
        IF array_length(v_asset_ids, 1) > 0 THEN
            -- Get vulnerability IDs associated with these assets
            SELECT array_agg(DISTINCT cve_id) INTO v_vuln_ids
            FROM vulnerabilities
            WHERE asset_id = ANY(v_asset_ids)
              AND status IN ('open', 'in_progress');
            
            -- Get average CVSS score for these vulnerabilities
            SELECT AVG(severity_cvss3) INTO v_avg_cvss
            FROM vulnerabilities
            WHERE asset_id = ANY(v_asset_ids)
              AND status IN ('open', 'in_progress');
            
            -- Get control IDs associated with this risk
            SELECT array_agg(control_id) INTO v_control_ids
            FROM risk_controls
            WHERE risk_id = v_risk.id;
            
            -- Get average control efficacy values for these controls
            SELECT 
                AVG(e_detect),
                AVG(e_resist),
                AVG(e_deter),
                AVG(e_avoid)
            INTO
                v_control_e_detect,
                v_control_e_resist,
                v_control_e_deter,
                v_control_e_avoid
            FROM controls
            WHERE id = ANY(v_control_ids);
            
            -- Calculate baseline resistance strength based on CVSS scores
            IF v_avg_cvss IS NOT NULL THEN
                v_baseline_resistance := GREATEST(0, 10 - v_avg_cvss);
            ELSE
                v_baseline_resistance := NULL;
            END IF;
            
            -- Update the risk record with vulnerability IDs and adjusted parameters
            UPDATE risks SET
                -- Link vulnerabilities to the risk
                vulnerability_ids = v_vuln_ids,
                
                -- Adjust resistance strength based on vulnerability data
                -- Only update if we have vulnerability data
                resistance_strength_min = CASE 
                    WHEN v_baseline_resistance IS NOT NULL THEN 
                        LEAST(resistance_strength_min, v_baseline_resistance * 0.8)
                    ELSE resistance_strength_min 
                END,
                
                resistance_strength_avg = CASE 
                    WHEN v_baseline_resistance IS NOT NULL THEN
                        (resistance_strength_avg + v_baseline_resistance) / 2
                    ELSE resistance_strength_avg 
                END,
                
                resistance_strength_max = CASE 
                    WHEN v_baseline_resistance IS NOT NULL THEN
                        GREATEST(v_baseline_resistance * 1.2, resistance_strength_max * 0.8)
                    ELSE resistance_strength_max 
                END,
                
                updated_at = now()
            WHERE id = v_risk.id;
        END IF;
    END LOOP;
END;
$$;


--
-- Name: update_vulnerability_efficacy_metrics(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_vulnerability_efficacy_metrics() RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_rec RECORD;
    v_discovery_date TIMESTAMP;
    v_variance_duration INTEGER;
    v_total_scanner_runs INTEGER;
    v_scanner_hits INTEGER;
    v_scanner_hit_rate NUMERIC(3,2);
BEGIN
    -- Process each open vulnerability
    FOR v_rec IN 
        SELECT id, cve_id, discovery_date, severity_cvss3, source
        FROM vulnerabilities 
        WHERE status = 'open'
    LOOP
        -- Calculate days between discovery and now (variance_duration)
        v_discovery_date := v_rec.discovery_date;
        v_variance_duration := EXTRACT(EPOCH FROM (now() - v_discovery_date))/86400;
        
        -- For simplicity, calculate a mock scanner hit rate based on CVE ID
        -- In a real implementation, this would query historical scanner data
        -- For demonstration, we'll use a hash of the CVE ID as a pseudo-random number
        -- to simulate different detection rates for different vulnerabilities
        SELECT 
            100 as total_runs,
            GREATEST(40, LEAST(95, (ascii(substring(v_rec.cve_id, 5, 1)) * 919) % 100)) as hits
        INTO v_total_scanner_runs, v_scanner_hits;
        
        -- Calculate scanner hit rate (between 0.40 and 0.95)
        v_scanner_hit_rate := v_scanner_hits::NUMERIC / v_total_scanner_runs::NUMERIC;
        
        -- Update the vulnerability record
        UPDATE vulnerabilities SET
            -- Calculate e_resist as inverse of normalized CVSS score
            e_resist = CASE 
                WHEN v_rec.severity_cvss3 IS NOT NULL THEN 
                    ROUND(CAST(1.00 - (v_rec.severity_cvss3/10.0) AS NUMERIC), 2)
                ELSE 
                    0.50 -- Default middle value if no CVSS score
                END,
                
            -- Set e_detect based on scanner hit rate
            -- Higher for scanner sources, lower for manual sources
            e_detect = CASE
                WHEN v_rec.source = 'scanner' THEN
                    ROUND(CAST(v_scanner_hit_rate AS NUMERIC), 2) 
                WHEN v_rec.source = 'pen_test' THEN
                    ROUND(CAST(0.70 + (v_scanner_hit_rate - 0.50) * 0.20 AS NUMERIC), 2)
                WHEN v_rec.source = 'bug_bounty' THEN
                    ROUND(CAST(0.65 + (v_scanner_hit_rate - 0.50) * 0.20 AS NUMERIC), 2)
                WHEN v_rec.source = 'manual' THEN
                    ROUND(CAST(0.30 + (v_scanner_hit_rate - 0.50) * 0.40 AS NUMERIC), 2)
                ELSE
                    0.50 -- Default middle value
                END,
                
            -- Update variance metrics
            variance_duration = v_variance_duration,
            
            updated_at = now()
        WHERE id = v_rec.id;
        
    END LOOP;
    
    -- Update variance frequency for all vulnerabilities based on status
    -- This would normally track actual status changes in your audit logs
    -- For demonstration, we'll use a simplified approach
    UPDATE vulnerabilities v
    SET variance_freq = CASE
        WHEN v.status = 'open' AND v.variance_duration > 30 THEN 
            GREATEST(1, v.variance_duration::INTEGER / 30) -- Increase once per month if still open
        WHEN v.status = 'in_progress' THEN 
            COALESCE(v.variance_freq, 0) + 1 -- Increment for in-progress status
        ELSE 
            COALESCE(v.variance_freq, 0) -- Keep existing value
        END
    WHERE v.status IN ('open', 'in_progress');
    
END;
$$;


--
-- Name: upsert_vulnerability(text, text, numeric, numeric, numeric, numeric, boolean, text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.upsert_vulnerability(p_asset_id text, p_cve_id text, p_severity_cvss3 numeric, p_exploitability numeric, p_impact numeric, p_temporal numeric, p_patchable boolean, p_source text) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  -- Check if this vulnerability already exists for this asset
  IF EXISTS (
    SELECT 1 FROM vulnerabilities 
    WHERE asset_id = p_asset_id AND cve_id = p_cve_id
  ) THEN
    -- If it exists but was remediated, reopen it and increment variance frequency
    IF (
      SELECT status FROM vulnerabilities 
      WHERE asset_id = p_asset_id AND cve_id = p_cve_id
    ) = 'remediated' THEN
      UPDATE vulnerabilities SET
        status = 'open',
        discovery_date = now(),
        remediation_date = NULL,
        severity_cvss3 = COALESCE(p_severity_cvss3, severity_cvss3),
        exploitability_subscore = COALESCE(p_exploitability, exploitability_subscore),
        impact_subscore = COALESCE(p_impact, impact_subscore),
        temporal_score = COALESCE(p_temporal, temporal_score),
        patchable = COALESCE(p_patchable, patchable),
        variance_freq = COALESCE(variance_freq, 0) + 1,
        updated_at = now()
      WHERE asset_id = p_asset_id AND cve_id = p_cve_id;
    ELSE
      -- If it exists and is still open, just update the details
      UPDATE vulnerabilities SET
        severity_cvss3 = COALESCE(p_severity_cvss3, severity_cvss3),
        exploitability_subscore = COALESCE(p_exploitability, exploitability_subscore),
        impact_subscore = COALESCE(p_impact, impact_subscore),
        temporal_score = COALESCE(p_temporal, temporal_score),
        patchable = COALESCE(p_patchable, patchable),
        updated_at = now()
      WHERE asset_id = p_asset_id AND cve_id = p_cve_id;
    END IF;
  ELSE
    -- It's a new vulnerability
    INSERT INTO vulnerabilities (
      asset_id, 
      cve_id, 
      discovery_date,
      severity_cvss3,
      exploitability_subscore,
      impact_subscore,
      temporal_score,
      status,
      patchable,
      source,
      variance_freq,
      variance_duration,
      e_detect,
      e_resist
    ) VALUES (
      p_asset_id,
      p_cve_id,
      now(),
      p_severity_cvss3,
      p_exploitability,
      p_impact,
      p_temporal,
      'open',
      p_patchable,
      p_source,
      0,
      0,
      NULL, -- e_detect will be set based on scanner history
      CASE 
        WHEN p_severity_cvss3 IS NOT NULL THEN 
          GREATEST(0.00, 1.00 - (p_severity_cvss3/10))
        ELSE 
          NULL
      END  -- Default e_resist calculation
    );
  END IF;
END;
$$;


SET default_table_access_method = heap;

--
-- Name: activity_logs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.activity_logs (
    id integer NOT NULL,
    activity text NOT NULL,
    "user" text NOT NULL,
    entity text NOT NULL,
    entity_type text NOT NULL,
    entity_id text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: activity_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.activity_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: activity_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.activity_logs_id_seq OWNED BY public.activity_logs.id;


--
-- Name: asset_relationships; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.asset_relationships (
    id integer NOT NULL,
    source_asset_id integer NOT NULL,
    target_asset_id integer NOT NULL,
    relationship_type public.relationship_type NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: asset_relationships_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.asset_relationships_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: asset_relationships_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.asset_relationships_id_seq OWNED BY public.asset_relationships.id;


--
-- Name: assets; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.assets (
    id integer NOT NULL,
    asset_id text NOT NULL,
    name text NOT NULL,
    type public.asset_type NOT NULL,
    business_unit text NOT NULL,
    owner text NOT NULL,
    confidentiality public.cia_rating NOT NULL,
    integrity public.cia_rating NOT NULL,
    availability public.cia_rating NOT NULL,
    asset_value numeric(38,2) NOT NULL,
    regulatory_impact text[] DEFAULT '{none}'::text[] NOT NULL,
    external_internal public.external_internal NOT NULL,
    dependencies text[] DEFAULT '{}'::text[] NOT NULL,
    description text DEFAULT ''::text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    currency public.currency DEFAULT 'USD'::public.currency NOT NULL,
    agent_count integer DEFAULT 1 NOT NULL,
    legal_entity text DEFAULT 'Unknown'::text NOT NULL,
    status public.asset_status DEFAULT 'Active'::public.asset_status NOT NULL,
    parent_id integer,
    hierarchy_level public.hierarchy_level DEFAULT 'technical_component'::public.hierarchy_level NOT NULL,
    architecture_domain text
);


--
-- Name: assets_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.assets_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: assets_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.assets_id_seq OWNED BY public.assets.id;


--
-- Name: control_library; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.control_library (
    id integer NOT NULL,
    control_id text NOT NULL,
    name text NOT NULL,
    description text DEFAULT ''::text NOT NULL,
    control_type public.control_type NOT NULL,
    control_category public.control_category NOT NULL,
    implementation_status public.implementation_status DEFAULT 'planned'::public.implementation_status NOT NULL,
    control_effectiveness real DEFAULT 0 NOT NULL,
    implementation_cost numeric(38,2) DEFAULT 0 NOT NULL,
    cost_per_agent numeric(38,2) DEFAULT 0 NOT NULL,
    is_per_agent_pricing boolean DEFAULT false NOT NULL,
    notes text DEFAULT ''::text NOT NULL,
    nist_csf text[] DEFAULT '{}'::text[] NOT NULL,
    iso27001 text[] DEFAULT '{}'::text[] NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    associated_risks text[],
    library_item_id integer,
    item_type text,
    asset_id text,
    risk_id integer,
    legal_entity_id text,
    deployed_agent_count integer,
    CONSTRAINT control_library_item_type_check CHECK ((item_type = ANY (ARRAY['template'::text, 'instance'::text])))
);


--
-- Name: control_library_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.control_library_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: control_library_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.control_library_id_seq OWNED BY public.control_library.id;


--
-- Name: controls; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.controls (
    id integer NOT NULL,
    control_id text NOT NULL,
    name text NOT NULL,
    description text DEFAULT ''::text NOT NULL,
    associated_risks text[] DEFAULT '{}'::text[] NOT NULL,
    control_type public.control_type NOT NULL,
    control_category public.control_category NOT NULL,
    implementation_status public.implementation_status NOT NULL,
    control_effectiveness numeric(38,2) NOT NULL,
    implementation_cost numeric(38,2) DEFAULT 0 NOT NULL,
    notes text DEFAULT ''::text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    cost_per_agent numeric(38,2) DEFAULT 0 NOT NULL,
    is_per_agent_pricing boolean DEFAULT false NOT NULL,
    library_item_id integer,
    item_type public.item_type DEFAULT 'instance'::public.item_type,
    asset_id text,
    risk_id integer,
    legal_entity_id text,
    deployed_agent_count integer DEFAULT 0,
    e_avoid numeric(3,2) DEFAULT 0.00,
    e_deter numeric(3,2) DEFAULT 0.00,
    e_detect numeric(3,2) DEFAULT 0.00,
    e_resist numeric(3,2) DEFAULT 0.00,
    var_freq integer DEFAULT 0,
    var_duration integer DEFAULT 0
);


--
-- Name: controls_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.controls_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: controls_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.controls_id_seq OWNED BY public.controls.id;


--
-- Name: cost_modules; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cost_modules (
    id integer NOT NULL,
    name text NOT NULL,
    cis_control text[] NOT NULL,
    cost_factor numeric NOT NULL,
    cost_type text NOT NULL,
    description text,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: cost_modules_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.cost_modules_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: cost_modules_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.cost_modules_id_seq OWNED BY public.cost_modules.id;


--
-- Name: enterprise_architecture; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.enterprise_architecture (
    id integer NOT NULL,
    asset_id text NOT NULL,
    name text NOT NULL,
    description text DEFAULT ''::text,
    level text NOT NULL,
    type text NOT NULL,
    architecture_domain text,
    parent_id integer,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    CONSTRAINT enterprise_architecture_level_check CHECK ((level = ANY (ARRAY['L1'::text, 'L2'::text, 'L3'::text]))),
    CONSTRAINT enterprise_architecture_type_check CHECK ((type = ANY (ARRAY['strategic_capability'::text, 'value_capability'::text, 'business_service'::text, 'product_service'::text])))
);


--
-- Name: enterprise_architecture_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.enterprise_architecture_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: enterprise_architecture_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.enterprise_architecture_id_seq OWNED BY public.enterprise_architecture.id;


--
-- Name: legal_entities; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.legal_entities (
    id integer NOT NULL,
    entity_id text NOT NULL,
    name text NOT NULL,
    description text DEFAULT ''::text NOT NULL,
    parent_entity_id text,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: legal_entities_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.legal_entities_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: legal_entities_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.legal_entities_id_seq OWNED BY public.legal_entities.id;


--
-- Name: response_cost_modules; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.response_cost_modules (
    id integer NOT NULL,
    response_id integer NOT NULL,
    cost_module_id integer NOT NULL,
    multiplier numeric DEFAULT 1.0,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: response_cost_modules_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.response_cost_modules_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: response_cost_modules_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.response_cost_modules_id_seq OWNED BY public.response_cost_modules.id;


--
-- Name: risk_controls; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.risk_controls (
    id integer NOT NULL,
    risk_id integer NOT NULL,
    control_id integer NOT NULL,
    effectiveness real DEFAULT 0 NOT NULL,
    notes text DEFAULT ''::text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: risk_controls_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.risk_controls_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: risk_controls_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.risk_controls_id_seq OWNED BY public.risk_controls.id;


--
-- Name: risk_costs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.risk_costs (
    id integer NOT NULL,
    risk_id integer NOT NULL,
    cost_module_id integer NOT NULL,
    weight numeric DEFAULT 1.0 NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: risk_costs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.risk_costs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: risk_costs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.risk_costs_id_seq OWNED BY public.risk_costs.id;


--
-- Name: risk_library; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.risk_library (
    id integer NOT NULL,
    risk_id text NOT NULL,
    name text NOT NULL,
    description text DEFAULT ''::text NOT NULL,
    threat_community text DEFAULT ''::text NOT NULL,
    vulnerability text DEFAULT ''::text NOT NULL,
    risk_category public.risk_category NOT NULL,
    severity public.severity DEFAULT 'medium'::public.severity NOT NULL,
    contact_frequency_min real DEFAULT 0 NOT NULL,
    contact_frequency_avg real DEFAULT 0 NOT NULL,
    contact_frequency_max real DEFAULT 0 NOT NULL,
    contact_frequency_confidence text DEFAULT 'Medium'::text NOT NULL,
    probability_of_action_min real DEFAULT 0 NOT NULL,
    probability_of_action_avg real DEFAULT 0 NOT NULL,
    probability_of_action_max real DEFAULT 0 NOT NULL,
    probability_of_action_confidence text DEFAULT 'Medium'::text NOT NULL,
    threat_capability_min real DEFAULT 0 NOT NULL,
    threat_capability_avg real DEFAULT 0 NOT NULL,
    threat_capability_max real DEFAULT 0 NOT NULL,
    threat_capability_confidence text DEFAULT 'Medium'::text NOT NULL,
    resistance_strength_min real DEFAULT 0 NOT NULL,
    resistance_strength_avg real DEFAULT 0 NOT NULL,
    resistance_strength_max real DEFAULT 0 NOT NULL,
    resistance_strength_confidence text DEFAULT 'Medium'::text NOT NULL,
    primary_loss_magnitude_min real DEFAULT 0 NOT NULL,
    primary_loss_magnitude_avg real DEFAULT 0 NOT NULL,
    primary_loss_magnitude_max real DEFAULT 0 NOT NULL,
    primary_loss_magnitude_confidence text DEFAULT 'Medium'::text NOT NULL,
    secondary_loss_event_frequency_min real DEFAULT 0 NOT NULL,
    secondary_loss_event_frequency_avg real DEFAULT 0 NOT NULL,
    secondary_loss_event_frequency_max real DEFAULT 0 NOT NULL,
    secondary_loss_event_frequency_confidence text DEFAULT 'Medium'::text NOT NULL,
    secondary_loss_magnitude_min real DEFAULT 0 NOT NULL,
    secondary_loss_magnitude_avg real DEFAULT 0 NOT NULL,
    secondary_loss_magnitude_max real DEFAULT 0 NOT NULL,
    secondary_loss_magnitude_confidence text DEFAULT 'Medium'::text NOT NULL,
    recommended_controls text[] DEFAULT '{}'::text[] NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: risk_library_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.risk_library_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: risk_library_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.risk_library_id_seq OWNED BY public.risk_library.id;


--
-- Name: risk_responses; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.risk_responses (
    id integer NOT NULL,
    risk_id text NOT NULL,
    response_type public.risk_response_type NOT NULL,
    justification text DEFAULT ''::text NOT NULL,
    assigned_controls text[] DEFAULT '{}'::text[] NOT NULL,
    transfer_method text DEFAULT ''::text NOT NULL,
    avoidance_strategy text DEFAULT ''::text NOT NULL,
    acceptance_reason text DEFAULT ''::text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    cost_module_ids integer[] DEFAULT '{}'::integer[]
);


--
-- Name: risk_responses_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.risk_responses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: risk_responses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.risk_responses_id_seq OWNED BY public.risk_responses.id;


--
-- Name: risk_summaries; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.risk_summaries (
    id integer NOT NULL,
    year integer NOT NULL,
    month integer NOT NULL,
    legal_entity_id text,
    tenth_percentile_exposure double precision DEFAULT 0 NOT NULL,
    most_likely_exposure double precision DEFAULT 0 NOT NULL,
    ninetieth_percentile_exposure double precision DEFAULT 0 NOT NULL,
    minimum_exposure double precision DEFAULT 0 NOT NULL,
    maximum_exposure double precision DEFAULT 0 NOT NULL,
    average_exposure double precision DEFAULT 0 NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: risk_summaries_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.risk_summaries_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: risk_summaries_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.risk_summaries_id_seq OWNED BY public.risk_summaries.id;


--
-- Name: risks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.risks (
    id integer NOT NULL,
    risk_id text NOT NULL,
    name text NOT NULL,
    description text DEFAULT ''::text NOT NULL,
    associated_assets text[] NOT NULL,
    threat_community text NOT NULL,
    vulnerability text NOT NULL,
    risk_category public.risk_category NOT NULL,
    severity public.severity NOT NULL,
    contact_frequency real DEFAULT 0 NOT NULL,
    probability_of_action real DEFAULT 0 NOT NULL,
    threat_event_frequency real DEFAULT 0 NOT NULL,
    threat_capability real DEFAULT 0 NOT NULL,
    resistance_strength real DEFAULT 0 NOT NULL,
    susceptibility numeric(38,8) DEFAULT 0 NOT NULL,
    loss_event_frequency real DEFAULT 0 NOT NULL,
    primary_loss_magnitude real DEFAULT 0 NOT NULL,
    secondary_loss_event_frequency real DEFAULT 0 NOT NULL,
    secondary_loss_magnitude real DEFAULT 0 NOT NULL,
    probable_loss_magnitude real DEFAULT 0 NOT NULL,
    inherent_risk numeric(38,2) DEFAULT 0 NOT NULL,
    residual_risk numeric(38,2) DEFAULT 0 NOT NULL,
    rank_percentile real DEFAULT 0 NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    contact_frequency_min real DEFAULT 0 NOT NULL,
    contact_frequency_avg real DEFAULT 0 NOT NULL,
    contact_frequency_max real DEFAULT 0 NOT NULL,
    contact_frequency_confidence text DEFAULT 'Medium'::text NOT NULL,
    probability_of_action_min real DEFAULT 0 NOT NULL,
    probability_of_action_avg real DEFAULT 0 NOT NULL,
    probability_of_action_max real DEFAULT 0 NOT NULL,
    probability_of_action_confidence text DEFAULT 'Medium'::text NOT NULL,
    threat_event_frequency_min real DEFAULT 0 NOT NULL,
    threat_event_frequency_avg real DEFAULT 0 NOT NULL,
    threat_event_frequency_max real DEFAULT 0 NOT NULL,
    threat_event_frequency_confidence text DEFAULT 'Medium'::text NOT NULL,
    threat_capability_min real DEFAULT 0 NOT NULL,
    threat_capability_avg real DEFAULT 0 NOT NULL,
    threat_capability_max real DEFAULT 0 NOT NULL,
    threat_capability_confidence text DEFAULT 'Medium'::text NOT NULL,
    resistance_strength_min real DEFAULT 0 NOT NULL,
    resistance_strength_avg real DEFAULT 0 NOT NULL,
    resistance_strength_max real DEFAULT 0 NOT NULL,
    resistance_strength_confidence text DEFAULT 'Medium'::text NOT NULL,
    susceptibility_min real DEFAULT 0 NOT NULL,
    susceptibility_avg real DEFAULT 0 NOT NULL,
    susceptibility_max real DEFAULT 0 NOT NULL,
    susceptibility_confidence text DEFAULT 'Medium'::text NOT NULL,
    loss_event_frequency_min real DEFAULT 0 NOT NULL,
    loss_event_frequency_avg real DEFAULT 0 NOT NULL,
    loss_event_frequency_max real DEFAULT 0 NOT NULL,
    loss_event_frequency_confidence text DEFAULT 'Medium'::text NOT NULL,
    primary_loss_magnitude_min numeric(38,2) DEFAULT 0 NOT NULL,
    primary_loss_magnitude_avg numeric(38,2) DEFAULT 0 NOT NULL,
    primary_loss_magnitude_max numeric(38,2) DEFAULT 0 NOT NULL,
    primary_loss_magnitude_confidence text DEFAULT 'Medium'::text NOT NULL,
    secondary_loss_event_frequency_min real DEFAULT 0 NOT NULL,
    secondary_loss_event_frequency_avg real DEFAULT 0 NOT NULL,
    secondary_loss_event_frequency_max real DEFAULT 0 NOT NULL,
    secondary_loss_event_frequency_confidence text DEFAULT 'Medium'::text NOT NULL,
    secondary_loss_magnitude_min numeric(38,2) DEFAULT 0 NOT NULL,
    secondary_loss_magnitude_avg numeric(38,2) DEFAULT 0 NOT NULL,
    secondary_loss_magnitude_max numeric(38,2) DEFAULT 0 NOT NULL,
    secondary_loss_magnitude_confidence text DEFAULT 'Medium'::text NOT NULL,
    loss_magnitude_min numeric(38,2) DEFAULT 0 NOT NULL,
    loss_magnitude_avg numeric(38,2) DEFAULT 0 NOT NULL,
    loss_magnitude_max numeric(38,2) DEFAULT 0 NOT NULL,
    loss_magnitude_confidence text DEFAULT 'Medium'::text NOT NULL,
    notes text DEFAULT ''::text NOT NULL,
    library_item_id integer,
    item_type public.item_type DEFAULT 'instance'::public.item_type,
    vulnerability_ids text[],
    cis_controls text[] DEFAULT '{}'::text[],
    applicable_cost_modules integer[] DEFAULT '{}'::integer[]
);


--
-- Name: risks_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.risks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: risks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.risks_id_seq OWNED BY public.risks.id;


--
-- Name: sessions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sessions (
    sid character varying NOT NULL,
    sess json NOT NULL,
    expire timestamp(6) without time zone NOT NULL
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(50),
    email character varying(255),
    display_name character varying(255) NOT NULL,
    password_hash character varying(255),
    role character varying(10) DEFAULT 'user'::character varying NOT NULL,
    auth_type character varying(10) DEFAULT 'local'::character varying NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    failed_login_attempts integer DEFAULT 0,
    locked_until timestamp without time zone,
    last_login timestamp without time zone,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    password_salt character varying(255),
    password_iterations integer DEFAULT 100,
    account_locked_until timestamp without time zone,
    sso_subject character varying(255),
    sso_provider character varying(100),
    first_name character varying(255),
    last_name character varying(255),
    profile_image_url character varying(500),
    created_by integer,
    updated_by integer,
    is_email_verified boolean DEFAULT false,
    email_verified_at timestamp without time zone,
    timezone character varying(50) DEFAULT 'UTC'::character varying,
    language character varying(10) DEFAULT 'en'::character varying,
    phone character varying(20),
    department character varying(100),
    job_title character varying(100),
    manager_id integer,
    login_count integer DEFAULT 0,
    last_failed_login timestamp without time zone
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: vulnerabilities; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.vulnerabilities (
    id integer NOT NULL,
    asset_id text NOT NULL,
    cve_id text NOT NULL,
    discovery_date timestamp without time zone DEFAULT now() NOT NULL,
    severity_cvss3 numeric(4,2) NOT NULL,
    exploitability_subscore numeric(4,2),
    impact_subscore numeric(4,2),
    temporal_score numeric(4,2),
    status text NOT NULL,
    remediation_date timestamp without time zone,
    patchable boolean DEFAULT true NOT NULL,
    source text NOT NULL,
    e_detect numeric(3,2),
    e_resist numeric(3,2),
    variance_freq integer,
    variance_duration integer,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    CONSTRAINT vulnerabilities_source_check CHECK ((source = ANY (ARRAY['scanner'::text, 'pen_test'::text, 'bug_bounty'::text, 'manual'::text]))),
    CONSTRAINT vulnerabilities_status_check CHECK ((status = ANY (ARRAY['open'::text, 'in_progress'::text, 'remediated'::text, 'exception'::text])))
);


--
-- Name: vulnerabilities_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.vulnerabilities_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: vulnerabilities_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.vulnerabilities_id_seq OWNED BY public.vulnerabilities.id;


--
-- Name: activity_logs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.activity_logs ALTER COLUMN id SET DEFAULT nextval('public.activity_logs_id_seq'::regclass);


--
-- Name: asset_relationships id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.asset_relationships ALTER COLUMN id SET DEFAULT nextval('public.asset_relationships_id_seq'::regclass);


--
-- Name: assets id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.assets ALTER COLUMN id SET DEFAULT nextval('public.assets_id_seq'::regclass);


--
-- Name: control_library id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.control_library ALTER COLUMN id SET DEFAULT nextval('public.control_library_id_seq'::regclass);


--
-- Name: controls id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.controls ALTER COLUMN id SET DEFAULT nextval('public.controls_id_seq'::regclass);


--
-- Name: cost_modules id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cost_modules ALTER COLUMN id SET DEFAULT nextval('public.cost_modules_id_seq'::regclass);


--
-- Name: enterprise_architecture id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.enterprise_architecture ALTER COLUMN id SET DEFAULT nextval('public.enterprise_architecture_id_seq'::regclass);


--
-- Name: legal_entities id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.legal_entities ALTER COLUMN id SET DEFAULT nextval('public.legal_entities_id_seq'::regclass);


--
-- Name: response_cost_modules id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.response_cost_modules ALTER COLUMN id SET DEFAULT nextval('public.response_cost_modules_id_seq'::regclass);


--
-- Name: risk_controls id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.risk_controls ALTER COLUMN id SET DEFAULT nextval('public.risk_controls_id_seq'::regclass);


--
-- Name: risk_costs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.risk_costs ALTER COLUMN id SET DEFAULT nextval('public.risk_costs_id_seq'::regclass);


--
-- Name: risk_library id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.risk_library ALTER COLUMN id SET DEFAULT nextval('public.risk_library_id_seq'::regclass);


--
-- Name: risk_responses id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.risk_responses ALTER COLUMN id SET DEFAULT nextval('public.risk_responses_id_seq'::regclass);


--
-- Name: risk_summaries id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.risk_summaries ALTER COLUMN id SET DEFAULT nextval('public.risk_summaries_id_seq'::regclass);


--
-- Name: risks id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.risks ALTER COLUMN id SET DEFAULT nextval('public.risks_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: vulnerabilities id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.vulnerabilities ALTER COLUMN id SET DEFAULT nextval('public.vulnerabilities_id_seq'::regclass);


--
-- Name: activity_logs activity_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.activity_logs
    ADD CONSTRAINT activity_logs_pkey PRIMARY KEY (id);


--
-- Name: asset_relationships asset_relationships_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.asset_relationships
    ADD CONSTRAINT asset_relationships_pkey PRIMARY KEY (id);


--
-- Name: asset_relationships asset_relationships_source_asset_id_target_asset_id_relatio_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.asset_relationships
    ADD CONSTRAINT asset_relationships_source_asset_id_target_asset_id_relatio_key UNIQUE (source_asset_id, target_asset_id, relationship_type);


--
-- Name: assets assets_asset_id_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.assets
    ADD CONSTRAINT assets_asset_id_unique UNIQUE (asset_id);


--
-- Name: assets assets_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.assets
    ADD CONSTRAINT assets_pkey PRIMARY KEY (id);


--
-- Name: control_library control_library_control_id_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.control_library
    ADD CONSTRAINT control_library_control_id_unique UNIQUE (control_id);


--
-- Name: control_library control_library_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.control_library
    ADD CONSTRAINT control_library_pkey PRIMARY KEY (id);


--
-- Name: controls controls_control_id_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.controls
    ADD CONSTRAINT controls_control_id_unique UNIQUE (control_id);


--
-- Name: controls controls_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.controls
    ADD CONSTRAINT controls_pkey PRIMARY KEY (id);


--
-- Name: cost_modules cost_modules_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cost_modules
    ADD CONSTRAINT cost_modules_pkey PRIMARY KEY (id);


--
-- Name: enterprise_architecture enterprise_architecture_asset_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.enterprise_architecture
    ADD CONSTRAINT enterprise_architecture_asset_id_key UNIQUE (asset_id);


--
-- Name: enterprise_architecture enterprise_architecture_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.enterprise_architecture
    ADD CONSTRAINT enterprise_architecture_pkey PRIMARY KEY (id);


--
-- Name: legal_entities legal_entities_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.legal_entities
    ADD CONSTRAINT legal_entities_pkey PRIMARY KEY (id);


--
-- Name: response_cost_modules response_cost_modules_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.response_cost_modules
    ADD CONSTRAINT response_cost_modules_pkey PRIMARY KEY (id);


--
-- Name: response_cost_modules response_cost_modules_response_id_cost_module_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.response_cost_modules
    ADD CONSTRAINT response_cost_modules_response_id_cost_module_id_key UNIQUE (response_id, cost_module_id);


--
-- Name: risk_controls risk_controls_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.risk_controls
    ADD CONSTRAINT risk_controls_pkey PRIMARY KEY (id);


--
-- Name: risk_costs risk_costs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.risk_costs
    ADD CONSTRAINT risk_costs_pkey PRIMARY KEY (id);


--
-- Name: risk_costs risk_costs_risk_id_cost_module_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.risk_costs
    ADD CONSTRAINT risk_costs_risk_id_cost_module_id_key UNIQUE (risk_id, cost_module_id);


--
-- Name: risk_library risk_library_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.risk_library
    ADD CONSTRAINT risk_library_pkey PRIMARY KEY (id);


--
-- Name: risk_library risk_library_risk_id_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.risk_library
    ADD CONSTRAINT risk_library_risk_id_unique UNIQUE (risk_id);


--
-- Name: risk_responses risk_responses_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.risk_responses
    ADD CONSTRAINT risk_responses_pkey PRIMARY KEY (id);


--
-- Name: risk_summaries risk_summaries_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.risk_summaries
    ADD CONSTRAINT risk_summaries_pkey PRIMARY KEY (id);


--
-- Name: risks risks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.risks
    ADD CONSTRAINT risks_pkey PRIMARY KEY (id);


--
-- Name: risks risks_risk_id_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.risks
    ADD CONSTRAINT risks_risk_id_unique UNIQUE (risk_id);


--
-- Name: sessions session_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT session_pkey PRIMARY KEY (sid);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: vulnerabilities vulnerabilities_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.vulnerabilities
    ADD CONSTRAINT vulnerabilities_pkey PRIMARY KEY (id);


--
-- Name: IDX_session_expire; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_session_expire" ON public.sessions USING btree (expire);


--
-- Name: idx_assets_parent_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_assets_parent_id ON public.assets USING btree (parent_id);


--
-- Name: idx_cost_modules_cis_control; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_cost_modules_cis_control ON public.cost_modules USING gin (cis_control);


--
-- Name: idx_risk_costs_cost_module_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_risk_costs_cost_module_id ON public.risk_costs USING btree (cost_module_id);


--
-- Name: idx_risk_costs_risk_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_risk_costs_risk_id ON public.risk_costs USING btree (risk_id);


--
-- Name: risk_summaries_legal_entity_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX risk_summaries_legal_entity_id_idx ON public.risk_summaries USING btree (legal_entity_id);


--
-- Name: risk_summaries_year_month_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX risk_summaries_year_month_idx ON public.risk_summaries USING btree (year, month);


--
-- Name: asset_relationships asset_relationships_source_asset_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.asset_relationships
    ADD CONSTRAINT asset_relationships_source_asset_id_fkey FOREIGN KEY (source_asset_id) REFERENCES public.assets(id) ON DELETE CASCADE;


--
-- Name: asset_relationships asset_relationships_target_asset_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.asset_relationships
    ADD CONSTRAINT asset_relationships_target_asset_id_fkey FOREIGN KEY (target_asset_id) REFERENCES public.assets(id) ON DELETE CASCADE;


--
-- Name: assets assets_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.assets
    ADD CONSTRAINT assets_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.assets(id) ON DELETE SET NULL;


--
-- Name: controls controls_library_item_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.controls
    ADD CONSTRAINT controls_library_item_id_fkey FOREIGN KEY (library_item_id) REFERENCES public.control_library(id);


--
-- Name: enterprise_architecture enterprise_architecture_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.enterprise_architecture
    ADD CONSTRAINT enterprise_architecture_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.enterprise_architecture(id);


--
-- Name: vulnerabilities fk_asset; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.vulnerabilities
    ADD CONSTRAINT fk_asset FOREIGN KEY (asset_id) REFERENCES public.assets(asset_id);


--
-- Name: response_cost_modules response_cost_modules_cost_module_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.response_cost_modules
    ADD CONSTRAINT response_cost_modules_cost_module_id_fkey FOREIGN KEY (cost_module_id) REFERENCES public.cost_modules(id) ON DELETE CASCADE;


--
-- Name: response_cost_modules response_cost_modules_response_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.response_cost_modules
    ADD CONSTRAINT response_cost_modules_response_id_fkey FOREIGN KEY (response_id) REFERENCES public.risk_responses(id) ON DELETE CASCADE;


--
-- Name: risk_controls risk_controls_control_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.risk_controls
    ADD CONSTRAINT risk_controls_control_id_fkey FOREIGN KEY (control_id) REFERENCES public.controls(id) ON DELETE CASCADE;


--
-- Name: risk_controls risk_controls_risk_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.risk_controls
    ADD CONSTRAINT risk_controls_risk_id_fkey FOREIGN KEY (risk_id) REFERENCES public.risks(id) ON DELETE CASCADE;


--
-- Name: risk_costs risk_costs_cost_module_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.risk_costs
    ADD CONSTRAINT risk_costs_cost_module_id_fkey FOREIGN KEY (cost_module_id) REFERENCES public.cost_modules(id) ON DELETE CASCADE;


--
-- Name: risk_costs risk_costs_risk_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.risk_costs
    ADD CONSTRAINT risk_costs_risk_id_fkey FOREIGN KEY (risk_id) REFERENCES public.risks(id) ON DELETE CASCADE;


--
-- Name: risk_responses risk_responses_risk_id_risks_risk_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.risk_responses
    ADD CONSTRAINT risk_responses_risk_id_risks_risk_id_fk FOREIGN KEY (risk_id) REFERENCES public.risks(risk_id);


--
-- Name: risks risks_library_item_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.risks
    ADD CONSTRAINT risks_library_item_id_fkey FOREIGN KEY (library_item_id) REFERENCES public.risk_library(id);


--
-- PostgreSQL database dump complete
--

