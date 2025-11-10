-- ============================================================================
-- FUNCTIONAL HEALTH LAB ANALYSIS APP - COMPLETE DATABASE SCHEMA
-- ============================================================================
-- Version: 1.0
-- Database: PostgreSQL 15+
-- Created: November 10, 2025
-- Author: Zach Salyers
-- ============================================================================

-- Enable UUID extension for generating unique identifiers
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable pgcrypto for password hashing
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- SECTION 1: USER MANAGEMENT
-- ============================================================================

-- Users table - stores user accounts
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    date_of_birth DATE,
    biological_sex VARCHAR(20), -- male, female, other
    
    -- Account status
    email_verified BOOLEAN DEFAULT FALSE,
    account_status VARCHAR(20) DEFAULT 'active', -- active, suspended, deleted
    
    -- Subscription
    subscription_tier VARCHAR(50) DEFAULT 'free', -- free, pay_per_upload, monthly, annual
    subscription_status VARCHAR(20), -- active, cancelled, past_due
    stripe_customer_id VARCHAR(100),
    stripe_subscription_id VARCHAR(100),
    subscription_started_at TIMESTAMP,
    subscription_ends_at TIMESTAMP,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    last_login_at TIMESTAMP,
    
    -- Soft delete
    deleted_at TIMESTAMP
);

-- User sessions table (if not using JWT)
CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    ip_address INET,
    user_agent TEXT
);

-- User preferences
CREATE TABLE user_preferences (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    email_notifications BOOLEAN DEFAULT TRUE,
    retest_reminders BOOLEAN DEFAULT TRUE,
    marketing_emails BOOLEAN DEFAULT FALSE,
    units_preference VARCHAR(20) DEFAULT 'imperial', -- imperial, metric
    timezone VARCHAR(50) DEFAULT 'America/New_York',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- SECTION 2: REFERENCE DATA - BIOMARKERS
-- ============================================================================

-- Biomarkers table - defines all biomarkers the app can interpret
CREATE TABLE biomarkers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    category VARCHAR(50) NOT NULL,
    
    -- Units and ranges
    standard_unit VARCHAR(20),
    alternative_units JSONB, -- {mmol/L: 5.6, mg/dL: 100}
    
    -- Optimal (functional) range
    optimal_range_min DECIMAL(10,3),
    optimal_range_max DECIMAL(10,3),
    
    -- Clinical reference range (typical lab ranges)
    clinical_low DECIMAL(10,3),
    clinical_high DECIMAL(10,3),
    
    -- Descriptions
    short_description TEXT,
    why_it_matters TEXT,
    how_to_test TEXT,
    
    -- Display settings
    display_order INTEGER,
    is_active BOOLEAN DEFAULT TRUE,
    requires_fasting BOOLEAN DEFAULT FALSE,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Biomarker categories enum
CREATE TYPE biomarker_category AS ENUM (
    'metabolic',
    'lipids',
    'thyroid',
    'vitamins',
    'minerals',
    'inflammation',
    'hormones',
    'kidney',
    'liver',
    'blood_count',
    'other'
);

-- Biomarker conditions - defines health status based on biomarker ranges
CREATE TABLE biomarker_conditions (
    id SERIAL PRIMARY KEY,
    biomarker_id INTEGER NOT NULL REFERENCES biomarkers(id) ON DELETE CASCADE,
    condition_name VARCHAR(100) NOT NULL,
    severity VARCHAR(20) NOT NULL, -- optimal, suboptimal, concerning, clinical
    
    -- Value range for this condition
    min_value DECIMAL(10,3),
    max_value DECIMAL(10,3),
    
    -- Description and priority
    description TEXT,
    clinical_significance TEXT,
    priority_score INTEGER, -- 1-10, higher = more urgent
    
    -- Metadata
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(biomarker_id, condition_name)
);

-- ============================================================================
-- SECTION 3: REFERENCE DATA - INTERVENTIONS & RESEARCH
-- ============================================================================

-- Interventions table - all possible recommendations
CREATE TABLE interventions (
    id SERIAL PRIMARY KEY,
    intervention_type VARCHAR(50) NOT NULL, -- dietary, supplement, lifestyle, exercise, sleep, stress, testing
    name VARCHAR(200) NOT NULL,
    short_description TEXT,
    detailed_description TEXT,
    
    -- Implementation details
    how_to_implement TEXT,
    dosage_info TEXT, -- for supplements
    frequency TEXT,
    timing TEXT,
    brand_recommendations TEXT,
    
    -- Expected outcomes
    expected_outcome TEXT,
    typical_duration_days INTEGER,
    expected_improvement_percentage INTEGER,
    
    -- Practical info
    difficulty_level VARCHAR(20), -- easy, moderate, advanced
    estimated_cost VARCHAR(50), -- free, low (<$30/mo), medium ($30-100/mo), high (>$100/mo)
    contraindications TEXT,
    warnings TEXT,
    
    -- Shopping/tracking
    amazon_affiliate_link TEXT,
    tracking_metrics TEXT,
    
    -- Metadata
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Research studies table - scientific evidence
CREATE TABLE research_studies (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    authors TEXT,
    journal VARCHAR(200),
    publication_year INTEGER,
    
    -- Identifiers
    pubmed_id VARCHAR(20),
    doi VARCHAR(100),
    url TEXT,
    
    -- Study characteristics
    study_type VARCHAR(50), -- RCT, meta-analysis, systematic_review, cohort, case-control, observational
    quality_score INTEGER, -- 1-10
    sample_size INTEGER,
    duration_weeks INTEGER,
    population_description TEXT,
    
    -- Findings
    key_findings TEXT,
    statistical_significance TEXT,
    limitations TEXT,
    conflict_of_interest TEXT,
    
    -- Categorization
    relevant_biomarkers INTEGER[], -- array of biomarker IDs
    relevant_interventions INTEGER[], -- array of intervention IDs
    
    -- Metadata
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Protocol rules - decision logic connecting conditions to interventions
CREATE TABLE protocol_rules (
    id SERIAL PRIMARY KEY,
    biomarker_condition_id INTEGER NOT NULL REFERENCES biomarker_conditions(id) ON DELETE CASCADE,
    intervention_id INTEGER NOT NULL REFERENCES interventions(id) ON DELETE CASCADE,
    
    -- Recommendation strength
    recommendation_strength VARCHAR(20) NOT NULL, -- primary, secondary, optional
    priority_order INTEGER, -- within the recommendation_strength category
    
    -- Logic and reasoning
    rationale TEXT,
    expected_outcome TEXT,
    timeframe_days INTEGER,
    
    -- Conditions for applicability (optional, for advanced rules)
    requires_conditions JSONB, -- e.g., {age_min: 18, age_max: 65, sex: "male"}
    excludes_conditions JSONB,
    
    -- Metadata
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(biomarker_condition_id, intervention_id)
);

-- Protocol rule studies - many-to-many relationship
CREATE TABLE protocol_rule_studies (
    protocol_rule_id INTEGER NOT NULL REFERENCES protocol_rules(id) ON DELETE CASCADE,
    research_study_id INTEGER NOT NULL REFERENCES research_studies(id) ON DELETE CASCADE,
    relevance_score INTEGER, -- 1-10, how directly applicable
    notes TEXT,
    PRIMARY KEY (protocol_rule_id, research_study_id)
);

-- ============================================================================
-- SECTION 4: USER LAB DATA
-- ============================================================================

-- User lab uploads table
CREATE TABLE user_lab_uploads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Lab info
    upload_date TIMESTAMP DEFAULT NOW(),
    lab_date DATE NOT NULL, -- when labs were actually drawn
    lab_source VARCHAR(100), -- Quest, LabCorp, Function Health, Doctor's Office, etc.
    
    -- File handling
    original_filename VARCHAR(255),
    pdf_url TEXT,
    pdf_s3_key VARCHAR(500),
    
    -- Processing status
    status VARCHAR(20) DEFAULT 'uploaded', -- uploaded, processing, completed, error
    ocr_completed BOOLEAN DEFAULT FALSE,
    ocr_confidence_score DECIMAL(3,2), -- 0.00 to 1.00
    
    -- Payment
    payment_status VARCHAR(20), -- free, paid, included_in_subscription
    payment_amount DECIMAL(10,2),
    stripe_payment_intent_id VARCHAR(100),
    
    -- Notes
    user_notes TEXT,
    admin_notes TEXT,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    -- Soft delete
    deleted_at TIMESTAMP
);

-- User biomarker results - individual values from a lab upload
CREATE TABLE user_biomarker_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lab_upload_id UUID NOT NULL REFERENCES user_lab_uploads(id) ON DELETE CASCADE,
    biomarker_id INTEGER NOT NULL REFERENCES biomarkers(id),
    
    -- Value
    value DECIMAL(10,3),
    unit VARCHAR(20),
    
    -- Reference ranges from user's lab (if provided)
    lab_reference_low DECIMAL(10,3),
    lab_reference_high DECIMAL(10,3),
    
    -- Calculated fields
    condition_id INTEGER REFERENCES biomarker_conditions(id),
    is_optimal BOOLEAN,
    deviation_from_optimal DECIMAL(10,3), -- how far from optimal range
    
    -- Data entry method
    data_source VARCHAR(20), -- ocr, manual, api
    manual_override BOOLEAN DEFAULT FALSE,
    
    -- Notes
    user_notes TEXT,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(lab_upload_id, biomarker_id)
);

-- ============================================================================
-- SECTION 5: GENERATED PROTOCOLS
-- ============================================================================

-- Generated protocols table
CREATE TABLE generated_protocols (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    lab_upload_id UUID NOT NULL REFERENCES user_lab_uploads(id) ON DELETE CASCADE,
    
    -- Protocol details
    protocol_name VARCHAR(200),
    priority_focus VARCHAR(100), -- e.g., "Metabolic Health Optimization"
    overall_health_score INTEGER, -- 1-10 calculated score
    
    -- Timeline
    estimated_duration_days INTEGER,
    retest_recommended_date DATE,
    
    -- File outputs
    pdf_url TEXT,
    pdf_s3_key VARCHAR(500),
    
    -- Status
    status VARCHAR(20) DEFAULT 'active', -- active, completed, abandoned
    
    -- Summary stats
    total_interventions INTEGER,
    interventions_started INTEGER DEFAULT 0,
    interventions_completed INTEGER DEFAULT 0,
    interventions_skipped INTEGER DEFAULT 0,
    
    -- Generation metadata
    generation_method VARCHAR(50), -- rule_based, ai_enhanced
    generation_version VARCHAR(20),
    
    -- Metadata
    generated_at TIMESTAMP DEFAULT NOW(),
    last_viewed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Protocol recommendations - individual interventions within a protocol
CREATE TABLE protocol_recommendations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    protocol_id UUID NOT NULL REFERENCES generated_protocols(id) ON DELETE CASCADE,
    protocol_rule_id INTEGER REFERENCES protocol_rules(id),
    intervention_id INTEGER NOT NULL REFERENCES interventions(id),
    biomarker_result_id UUID REFERENCES user_biomarker_results(id),
    
    -- Prioritization
    priority_order INTEGER, -- 1 = highest priority
    recommendation_strength VARCHAR(20), -- primary, secondary, optional
    
    -- Relevant biomarkers this helps (may be multiple)
    relevant_biomarker_ids INTEGER[],
    
    -- Customization
    custom_rationale TEXT, -- if AI-enhanced, may have personalized rationale
    custom_implementation_notes TEXT,
    
    -- User tracking
    status VARCHAR(20) DEFAULT 'pending', -- pending, started, completed, skipped
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    user_notes TEXT,
    user_rating INTEGER, -- 1-5 stars, how helpful was this
    
    -- Outcome tracking
    perceived_effectiveness INTEGER, -- 1-10 user rating
    side_effects_reported TEXT,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Protocol recommendation studies - which studies back this recommendation
CREATE TABLE protocol_recommendation_studies (
    recommendation_id UUID NOT NULL REFERENCES protocol_recommendations(id) ON DELETE CASCADE,
    research_study_id INTEGER NOT NULL REFERENCES research_studies(id) ON DELETE CASCADE,
    display_order INTEGER,
    PRIMARY KEY (recommendation_id, research_study_id)
);

-- ============================================================================
-- SECTION 6: PROGRESS TRACKING
-- ============================================================================

-- Progress snapshots - track changes over time
CREATE TABLE progress_snapshots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    lab_upload_id UUID NOT NULL REFERENCES user_lab_uploads(id) ON DELETE CASCADE,
    
    -- Overall metrics
    overall_health_score INTEGER,
    biomarkers_optimal INTEGER,
    biomarkers_suboptimal INTEGER,
    biomarkers_concerning INTEGER,
    
    -- Changes from previous
    previous_snapshot_id UUID REFERENCES progress_snapshots(id),
    health_score_change INTEGER,
    biomarkers_improved INTEGER,
    biomarkers_worsened INTEGER,
    biomarkers_unchanged INTEGER,
    
    -- Protocol adherence
    active_protocol_id UUID REFERENCES generated_protocols(id),
    interventions_completed_count INTEGER,
    estimated_adherence_percentage INTEGER,
    
    -- Snapshot date
    snapshot_date DATE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Biomarker trends - simplified view for charting
CREATE TABLE biomarker_trends (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    biomarker_id INTEGER NOT NULL REFERENCES biomarkers(id),
    
    -- Time series data
    measurement_date DATE NOT NULL,
    value DECIMAL(10,3),
    unit VARCHAR(20),
    lab_upload_id UUID REFERENCES user_lab_uploads(id),
    
    -- Status at time of measurement
    condition_id INTEGER REFERENCES biomarker_conditions(id),
    was_optimal BOOLEAN,
    
    -- Context
    active_interventions TEXT[], -- snapshot of what interventions were active
    
    created_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(user_id, biomarker_id, measurement_date)
);

-- ============================================================================
-- SECTION 7: PAYMENT & BILLING
-- ============================================================================

-- Payments table - track all payment transactions
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Stripe info
    stripe_payment_intent_id VARCHAR(100) UNIQUE,
    stripe_charge_id VARCHAR(100),
    
    -- Payment details
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    payment_type VARCHAR(50), -- upload, subscription_monthly, subscription_annual
    payment_status VARCHAR(20), -- pending, succeeded, failed, refunded
    
    -- Related entities
    lab_upload_id UUID REFERENCES user_lab_uploads(id),
    
    -- Timestamps
    paid_at TIMESTAMP,
    refunded_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Subscriptions table - detailed subscription tracking
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Stripe info
    stripe_subscription_id VARCHAR(100) UNIQUE NOT NULL,
    stripe_customer_id VARCHAR(100) NOT NULL,
    
    -- Subscription details
    plan_type VARCHAR(50) NOT NULL, -- monthly, annual
    plan_amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    
    -- Status
    status VARCHAR(20) NOT NULL, -- active, cancelled, past_due, trialing
    
    -- Dates
    started_at TIMESTAMP NOT NULL,
    current_period_start TIMESTAMP,
    current_period_end TIMESTAMP,
    cancelled_at TIMESTAMP,
    ended_at TIMESTAMP,
    trial_start TIMESTAMP,
    trial_end TIMESTAMP,
    
    -- Cancellation
    cancel_at_period_end BOOLEAN DEFAULT FALSE,
    cancellation_reason TEXT,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Invoices table
CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    subscription_id UUID REFERENCES subscriptions(id),
    
    -- Stripe info
    stripe_invoice_id VARCHAR(100) UNIQUE,
    
    -- Invoice details
    amount_due DECIMAL(10,2) NOT NULL,
    amount_paid DECIMAL(10,2),
    currency VARCHAR(3) DEFAULT 'USD',
    status VARCHAR(20), -- draft, open, paid, void, uncollectible
    
    -- Dates
    invoice_date DATE,
    due_date DATE,
    paid_at TIMESTAMP,
    
    -- URLs
    invoice_pdf_url TEXT,
    hosted_invoice_url TEXT,
    
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- SECTION 8: ADMIN & SUPPORT
-- ============================================================================

-- Admin users table (optional, if separate from regular users)
CREATE TABLE admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(200),
    role VARCHAR(50), -- super_admin, content_manager, support
    is_active BOOLEAN DEFAULT TRUE,
    last_login_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Support tickets
CREATE TABLE support_tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    
    -- Ticket details
    subject VARCHAR(500) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50), -- technical, billing, protocol_question, feature_request, bug
    priority VARCHAR(20) DEFAULT 'normal', -- low, normal, high, urgent
    status VARCHAR(20) DEFAULT 'open', -- open, in_progress, waiting_on_customer, resolved, closed
    
    -- Assignment
    assigned_to UUID REFERENCES admin_users(id),
    
    -- Related entities
    lab_upload_id UUID REFERENCES user_lab_uploads(id),
    protocol_id UUID REFERENCES generated_protocols(id),
    
    -- Resolution
    resolved_at TIMESTAMP,
    resolution_notes TEXT,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Support ticket messages
CREATE TABLE support_ticket_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_id UUID NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
    
    -- Author (either user or admin)
    author_type VARCHAR(20) NOT NULL, -- user, admin
    author_id UUID NOT NULL, -- references users.id or admin_users.id
    
    -- Message
    message TEXT NOT NULL,
    is_internal_note BOOLEAN DEFAULT FALSE, -- only visible to admins
    
    -- Attachments
    attachments JSONB,
    
    created_at TIMESTAMP DEFAULT NOW()
);

-- Audit log for important actions
CREATE TABLE audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    admin_user_id UUID REFERENCES admin_users(id) ON DELETE SET NULL,
    
    -- Action details
    action VARCHAR(100) NOT NULL, -- user_signup, lab_upload, protocol_generated, payment_processed, etc.
    entity_type VARCHAR(50), -- user, lab, protocol, payment
    entity_id UUID,
    
    -- Details
    description TEXT,
    metadata JSONB,
    
    -- Context
    ip_address INET,
    user_agent TEXT,
    
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- SECTION 9: ANALYTICS & METRICS
-- ============================================================================

-- User events for analytics
CREATE TABLE user_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    -- Event details
    event_type VARCHAR(100) NOT NULL,
    event_name VARCHAR(200) NOT NULL,
    
    -- Properties
    properties JSONB,
    
    -- Context
    session_id UUID,
    page_url TEXT,
    referrer TEXT,
    
    -- Device info
    device_type VARCHAR(50),
    browser VARCHAR(50),
    os VARCHAR(50),
    
    created_at TIMESTAMP DEFAULT NOW()
);

-- Daily metrics rollup
CREATE TABLE daily_metrics (
    metric_date DATE PRIMARY KEY,
    
    -- User metrics
    new_signups INTEGER DEFAULT 0,
    active_users INTEGER DEFAULT 0,
    
    -- Lab metrics
    labs_uploaded INTEGER DEFAULT 0,
    labs_processed_successfully INTEGER DEFAULT 0,
    ocr_average_confidence DECIMAL(3,2),
    
    -- Protocol metrics
    protocols_generated INTEGER DEFAULT 0,
    avg_health_score DECIMAL(3,1),
    
    -- Revenue metrics
    revenue_total DECIMAL(10,2) DEFAULT 0,
    payments_succeeded INTEGER DEFAULT 0,
    payments_failed INTEGER DEFAULT 0,
    new_subscribers INTEGER DEFAULT 0,
    cancelled_subscribers INTEGER DEFAULT 0,
    
    -- Engagement metrics
    protocols_downloaded INTEGER DEFAULT 0,
    interventions_started INTEGER DEFAULT 0,
    interventions_completed INTEGER DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- SECTION 10: INDEXES FOR PERFORMANCE
-- ============================================================================

-- User indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_stripe_customer ON users(stripe_customer_id);
CREATE INDEX idx_users_subscription_status ON users(subscription_status);
CREATE INDEX idx_users_created_at ON users(created_at);

-- Session indexes
CREATE INDEX idx_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_sessions_token ON user_sessions(session_token);
CREATE INDEX idx_sessions_expires ON user_sessions(expires_at);

-- Biomarker indexes
CREATE INDEX idx_biomarkers_category ON biomarkers(category);
CREATE INDEX idx_biomarkers_active ON biomarkers(is_active);

-- Biomarker condition indexes
CREATE INDEX idx_conditions_biomarker ON biomarker_conditions(biomarker_id);
CREATE INDEX idx_conditions_severity ON biomarker_conditions(severity);

-- Intervention indexes
CREATE INDEX idx_interventions_type ON interventions(intervention_type);
CREATE INDEX idx_interventions_active ON interventions(is_active);

-- Research study indexes
CREATE INDEX idx_studies_pubmed ON research_studies(pubmed_id);
CREATE INDEX idx_studies_type ON research_studies(study_type);

-- Protocol rule indexes
CREATE INDEX idx_protocol_rules_condition ON protocol_rules(biomarker_condition_id);
CREATE INDEX idx_protocol_rules_intervention ON protocol_rules(intervention_id);

-- Lab upload indexes
CREATE INDEX idx_lab_uploads_user ON user_lab_uploads(user_id);
CREATE INDEX idx_lab_uploads_date ON user_lab_uploads(lab_date);
CREATE INDEX idx_lab_uploads_status ON user_lab_uploads(status);

-- Biomarker result indexes
CREATE INDEX idx_results_lab_upload ON user_biomarker_results(lab_upload_id);
CREATE INDEX idx_results_biomarker ON user_biomarker_results(biomarker_id);
CREATE INDEX idx_results_condition ON user_biomarker_results(condition_id);

-- Protocol indexes
CREATE INDEX idx_protocols_user ON generated_protocols(user_id);
CREATE INDEX idx_protocols_lab ON generated_protocols(lab_upload_id);
CREATE INDEX idx_protocols_status ON generated_protocols(status);
CREATE INDEX idx_protocols_generated_at ON generated_protocols(generated_at);

-- Recommendation indexes
CREATE INDEX idx_recommendations_protocol ON protocol_recommendations(protocol_id);
CREATE INDEX idx_recommendations_status ON protocol_recommendations(status);

-- Progress indexes
CREATE INDEX idx_progress_user ON progress_snapshots(user_id);
CREATE INDEX idx_progress_date ON progress_snapshots(snapshot_date);

-- Trend indexes
CREATE INDEX idx_trends_user_biomarker ON biomarker_trends(user_id, biomarker_id);
CREATE INDEX idx_trends_date ON biomarker_trends(measurement_date);

-- Payment indexes
CREATE INDEX idx_payments_user ON payments(user_id);
CREATE INDEX idx_payments_stripe_intent ON payments(stripe_payment_intent_id);
CREATE INDEX idx_payments_status ON payments(payment_status);

-- Subscription indexes
CREATE INDEX idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_stripe ON subscriptions(stripe_subscription_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);

-- Support indexes
CREATE INDEX idx_tickets_user ON support_tickets(user_id);
CREATE INDEX idx_tickets_status ON support_tickets(status);

-- Event indexes
CREATE INDEX idx_events_user ON user_events(user_id);
CREATE INDEX idx_events_type ON user_events(event_type);
CREATE INDEX idx_events_created ON user_events(created_at);

-- ============================================================================
-- SECTION 11: VIEWS FOR COMMON QUERIES
-- ============================================================================

-- View: User dashboard summary
CREATE VIEW user_dashboard_summary AS
SELECT 
    u.id AS user_id,
    u.email,
    u.first_name,
    u.last_name,
    u.subscription_tier,
    COUNT(DISTINCT ul.id) AS total_lab_uploads,
    MAX(ul.lab_date) AS most_recent_lab_date,
    COUNT(DISTINCT gp.id) AS total_protocols,
    AVG(gp.overall_health_score) AS avg_health_score
FROM users u
LEFT JOIN user_lab_uploads ul ON u.id = ul.user_id AND ul.deleted_at IS NULL
LEFT JOIN generated_protocols gp ON u.id = gp.user_id
WHERE u.deleted_at IS NULL
GROUP BY u.id, u.email, u.first_name, u.last_name, u.subscription_tier;

-- View: Latest biomarker results for each user
CREATE VIEW latest_biomarker_results AS
SELECT DISTINCT ON (ubr.user_id, ubr.biomarker_id)
    ul.user_id,
    ubr.biomarker_id,
    b.name AS biomarker_name,
    ubr.value,
    ubr.unit,
    bc.condition_name,
    bc.severity,
    ul.lab_date,
    ubr.created_at
FROM user_biomarker_results ubr
JOIN user_lab_uploads ul ON ubr.lab_upload_id = ul.id
JOIN biomarkers b ON ubr.biomarker_id = b.id
LEFT JOIN biomarker_conditions bc ON ubr.condition_id = bc.id
WHERE ul.deleted_at IS NULL
ORDER BY ubr.user_id, ubr.biomarker_id, ul.lab_date DESC, ubr.created_at DESC;

-- View: Protocol effectiveness summary
CREATE VIEW protocol_effectiveness AS
SELECT 
    gp.id AS protocol_id,
    gp.user_id,
    gp.protocol_name,
    gp.total_interventions,
    gp.interventions_started,
    gp.interventions_completed,
    ROUND(
        CASE 
            WHEN gp.total_interventions > 0 
            THEN (gp.interventions_completed::DECIMAL / gp.total_interventions) * 100 
            ELSE 0 
        END, 
        1
    ) AS completion_percentage,
    AVG(pr.user_rating) AS avg_intervention_rating,
    COUNT(CASE WHEN pr.perceived_effectiveness >= 7 THEN 1 END) AS high_effectiveness_count
FROM generated_protocols gp
LEFT JOIN protocol_recommendations pr ON gp.id = pr.protocol_id
GROUP BY gp.id, gp.user_id, gp.protocol_name, gp.total_interventions, 
         gp.interventions_started, gp.interventions_completed;

-- View: Revenue metrics
CREATE VIEW revenue_metrics AS
SELECT 
    DATE_TRUNC('month', created_at) AS month,
    COUNT(*) AS total_payments,
    SUM(CASE WHEN payment_status = 'succeeded' THEN amount ELSE 0 END) AS revenue,
    AVG(CASE WHEN payment_status = 'succeeded' THEN amount ELSE NULL END) AS avg_payment,
    COUNT(CASE WHEN payment_type = 'subscription_monthly' THEN 1 END) AS monthly_subscriptions,
    COUNT(CASE WHEN payment_type = 'subscription_annual' THEN 1 END) AS annual_subscriptions,
    COUNT(CASE WHEN payment_type = 'upload' THEN 1 END) AS one_time_uploads
FROM payments
GROUP BY DATE_TRUNC('month', created_at)
ORDER BY month DESC;

-- ============================================================================
-- SECTION 12: TRIGGERS FOR AUTOMATION
-- ============================================================================

-- Trigger: Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to relevant tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_biomarkers_updated_at BEFORE UPDATE ON biomarkers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_interventions_updated_at BEFORE UPDATE ON interventions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_protocols_updated_at BEFORE UPDATE ON generated_protocols
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger: Assign biomarker condition based on value
CREATE OR REPLACE FUNCTION assign_biomarker_condition()
RETURNS TRIGGER AS $$
DECLARE
    matched_condition_id INTEGER;
BEGIN
    -- Find matching condition based on value
    SELECT id INTO matched_condition_id
    FROM biomarker_conditions
    WHERE biomarker_id = NEW.biomarker_id
    AND (min_value IS NULL OR NEW.value >= min_value)
    AND (max_value IS NULL OR NEW.value <= max_value)
    ORDER BY priority_score DESC
    LIMIT 1;
    
    NEW.condition_id = matched_condition_id;
    
    -- Set is_optimal flag
    NEW.is_optimal = EXISTS (
        SELECT 1 FROM biomarker_conditions
        WHERE id = matched_condition_id AND severity = 'optimal'
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER assign_condition_on_insert
    BEFORE INSERT ON user_biomarker_results
    FOR EACH ROW
    EXECUTE FUNCTION assign_biomarker_condition();

CREATE TRIGGER assign_condition_on_update
    BEFORE UPDATE OF value, biomarker_id ON user_biomarker_results
    FOR EACH ROW
    EXECUTE FUNCTION assign_biomarker_condition();

-- Trigger: Update protocol stats when recommendations change
CREATE OR REPLACE FUNCTION update_protocol_stats()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE generated_protocols
    SET 
        interventions_started = (
            SELECT COUNT(*) FROM protocol_recommendations
            WHERE protocol_id = NEW.protocol_id AND status IN ('started', 'completed')
        ),
        interventions_completed = (
            SELECT COUNT(*) FROM protocol_recommendations
            WHERE protocol_id = NEW.protocol_id AND status = 'completed'
        ),
        interventions_skipped = (
            SELECT COUNT(*) FROM protocol_recommendations
            WHERE protocol_id = NEW.protocol_id AND status = 'skipped'
        )
    WHERE id = NEW.protocol_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_protocol_stats_trigger
    AFTER INSERT OR UPDATE OF status ON protocol_recommendations
    FOR EACH ROW
    EXECUTE FUNCTION update_protocol_stats();

-- ============================================================================
-- SECTION 13: SEED DATA - CORE BIOMARKERS
-- ============================================================================

-- Insert core metabolic biomarkers
INSERT INTO biomarkers (name, category, standard_unit, optimal_range_min, optimal_range_max, clinical_low, clinical_high, short_description, why_it_matters, requires_fasting, display_order) VALUES
('Fasting Glucose', 'metabolic', 'mg/dL', 70, 85, 65, 99, 'Blood sugar level after 8+ hours fasting', 'Elevated fasting glucose indicates insulin resistance and increased diabetes risk. Even values in the "normal" range (86-99) may indicate early metabolic dysfunction.', TRUE, 1),
('Hemoglobin A1C', 'metabolic', '%', 4.5, 5.4, 4.0, 5.6, 'Average blood sugar over past 2-3 months', 'HbA1c reflects long-term glucose control. Values >5.4% indicate increased diabetes risk, even below the clinical threshold of 5.7%.', FALSE, 2),
('Fasting Insulin', 'metabolic', 'μIU/mL', 2, 7, 2, 19, 'Insulin level after 8+ hours fasting', 'Elevated fasting insulin is an early sign of insulin resistance, often appearing years before glucose becomes elevated.', TRUE, 3),
('Triglycerides', 'metabolic', 'mg/dL', 50, 100, 0, 149, 'Blood fat levels, often elevated with insulin resistance', 'High triglycerides indicate metabolic dysfunction and increase cardiovascular risk. Optimal levels are much lower than the clinical "normal" of 150.', TRUE, 4);

-- Insert lipid panel biomarkers
INSERT INTO biomarkers (name, category, standard_unit, optimal_range_min, optimal_range_max, clinical_low, clinical_high, short_description, why_it_matters, requires_fasting, display_order) VALUES
('Total Cholesterol', 'lipids', 'mg/dL', 150, 200, 0, 199, 'Total amount of cholesterol in blood', 'While less predictive than other lipid markers, extremely high or low total cholesterol warrants investigation.', TRUE, 10),
('LDL Cholesterol', 'lipids', 'mg/dL', 50, 100, 0, 99, 'Low-density lipoprotein ("bad" cholesterol)', 'LDL carries cholesterol to arteries. Lower is generally better, especially for cardiovascular disease prevention.', TRUE, 11),
('HDL Cholesterol', 'lipids', 'mg/dL', 50, 100, 40, 200, 'High-density lipoprotein ("good" cholesterol)', 'HDL removes cholesterol from arteries. Higher HDL is generally protective against heart disease.', TRUE, 12),
('Triglyceride:HDL Ratio', 'lipids', 'ratio', 0.5, 2.0, 0, 4, 'Ratio of triglycerides to HDL cholesterol', 'Strong predictor of insulin resistance and cardiovascular risk. Optimal ratio is <2:1, ideally <1:1.', TRUE, 13);

-- Insert thyroid biomarkers
INSERT INTO biomarkers (name, category, standard_unit, optimal_range_min, optimal_range_max, clinical_low, clinical_high, short_description, why_it_matters, requires_fasting, display_order) VALUES
('TSH', 'thyroid', 'mIU/L', 0.5, 2.5, 0.4, 4.0, 'Thyroid stimulating hormone', 'TSH regulates thyroid function. Functional medicine targets TSH <2.5, lower than the clinical range of 4.0.', FALSE, 20),
('Free T3', 'thyroid', 'pg/mL', 3.0, 4.0, 2.3, 4.2, 'Free triiodothyronine (active thyroid hormone)', 'T3 is the active thyroid hormone. Low T3 can cause fatigue, weight gain, and cognitive issues even with normal TSH.', FALSE, 21),
('Free T4', 'thyroid', 'ng/dL', 1.0, 1.5, 0.8, 1.8, 'Free thyroxine (thyroid hormone precursor)', 'T4 converts to T3. Low T4 with normal TSH may indicate thyroid dysfunction.', FALSE, 22);

-- Insert vitamin biomarkers
INSERT INTO biomarkers (name, category, standard_unit, optimal_range_min, optimal_range_max, clinical_low, clinical_high, short_description, why_it_matters, requires_fasting, display_order) VALUES
('Vitamin D (25-OH)', 'vitamins', 'ng/mL', 50, 80, 30, 100, '25-hydroxyvitamin D (vitamin D storage form)', 'Vitamin D is crucial for immune function, bone health, mood, and metabolic health. Optimal levels are 50-80, not just >30.', FALSE, 30),
('Vitamin B12', 'vitamins', 'pg/mL', 500, 1000, 200, 900, 'Cobalamin (B12)', 'B12 is essential for nerve function, energy, and red blood cell production. Levels >500 are optimal for neurological health.', FALSE, 31),
('Folate (B9)', 'vitamins', 'ng/mL', 10, 20, 4, 20, 'Folic acid (B9)', 'Folate is critical for DNA synthesis, methylation, and cardiovascular health. Levels >10 are optimal.', FALSE, 32);

-- Insert mineral biomarkers
INSERT INTO biomarkers (name, category, standard_unit, optimal_range_min, optimal_range_max, clinical_low, clinical_high, short_description, why_it_matters, requires_fasting, display_order) VALUES
('Ferritin', 'minerals', 'ng/mL', 50, 150, 12, 300, 'Iron storage protein', 'Ferritin reflects iron stores. Too low causes fatigue and anemia. Too high can indicate inflammation or iron overload.', FALSE, 40),
('Serum Iron', 'minerals', 'μg/dL', 60, 150, 50, 170, 'Iron circulating in blood', 'Serum iron fluctuates throughout the day but should be in optimal range for energy and oxygen transport.', TRUE, 41),
('Magnesium (RBC)', 'minerals', 'mg/dL', 5.0, 6.5, 4.0, 6.4, 'Magnesium in red blood cells', 'RBC magnesium is more accurate than serum. Magnesium is critical for 300+ enzymatic reactions, including energy production.', FALSE, 42);

-- Insert inflammation biomarkers
INSERT INTO biomarkers (name, category, standard_unit, optimal_range_min, optimal_range_max, clinical_low, clinical_high, short_description, why_it_matters, requires_fasting, display_order) VALUES
('hs-CRP', 'inflammation', 'mg/L', 0, 1.0, 0, 3.0, 'High-sensitivity C-reactive protein', 'CRP is a marker of inflammation. Values >1.0 indicate increased cardiovascular risk, even if <3.0 (clinical threshold).', FALSE, 50),
('Homocysteine', 'inflammation', 'μmol/L', 5, 10, 0, 15, 'Amino acid linked to cardiovascular disease', 'Elevated homocysteine increases heart disease and stroke risk. Often elevated with B vitamin deficiencies.', FALSE, 51);

-- ============================================================================
-- SECTION 14: SEED DATA - SAMPLE CONDITIONS
-- ============================================================================

-- Fasting Glucose conditions
INSERT INTO biomarker_conditions (biomarker_id, condition_name, severity, min_value, max_value, description, priority_score) VALUES
(1, 'Optimal Glucose', 'optimal', 70, 85, 'Fasting glucose in ideal metabolic range indicating excellent insulin sensitivity', 1),
(1, 'Elevated Normal', 'suboptimal', 86, 99, 'Clinically normal but functionally suboptimal - indicates early insulin resistance', 6),
(1, 'Prediabetic Range', 'concerning', 100, 125, 'Significant insulin resistance with high risk of progression to type 2 diabetes', 9),
(1, 'Diabetic Range', 'clinical', 126, NULL, 'Meets clinical criteria for type 2 diabetes - requires medical evaluation', 10);

-- Vitamin D conditions
INSERT INTO biomarker_conditions (biomarker_id, condition_name, severity, min_value, max_value, description, priority_score) VALUES
(10, 'Deficient', 'clinical', NULL, 19, 'Severe vitamin D deficiency - requires immediate supplementation', 9),
(10, 'Insufficient', 'concerning', 20, 29, 'Insufficient vitamin D for optimal health - supplementation recommended', 7),
(10, 'Suboptimal', 'suboptimal', 30, 49, 'Within clinical range but below optimal for immune and metabolic health', 5),
(10, 'Optimal', 'optimal', 50, 80, 'Ideal vitamin D levels for immune function, bone health, and mood', 1),
(10, 'High', 'suboptimal', 81, 100, 'Higher than necessary - may reduce supplementation', 3);

-- TSH conditions
INSERT INTO biomarker_conditions (biomarker_id, condition_name, severity, min_value, max_value, description, priority_score) VALUES
(7, 'Optimal TSH', 'optimal', 0.5, 2.5, 'Ideal TSH range for metabolic and energy optimization', 1),
(7, 'Subclinical Hypothyroid', 'suboptimal', 2.6, 4.0, 'TSH elevated but within clinical range - may indicate early thyroid dysfunction', 6),
(7, 'Clinical Hypothyroid', 'clinical', 4.1, NULL, 'TSH above clinical range - requires medical evaluation', 9),
(7, 'Low TSH', 'suboptimal', NULL, 0.4, 'TSH below range - may indicate hyperthyroidism or overmedication', 7);

-- ============================================================================
-- SECTION 15: SEED DATA - SAMPLE INTERVENTIONS
-- ============================================================================

-- Dietary interventions
INSERT INTO interventions (intervention_type, name, short_description, detailed_description, how_to_implement, expected_outcome, typical_duration_days, difficulty_level, estimated_cost) VALUES
('dietary', 'Low-Carb Diet (<100g/day)', 'Reduce daily carbohydrate intake to improve insulin sensitivity and glucose control', 
'A low-carbohydrate diet restricts carbs to 75-100g per day, focusing on proteins, healthy fats, and non-starchy vegetables. This approach reduces glucose load and improves insulin sensitivity.',
'Track macros using MyFitnessPal or Cronometer. Target 75-100g carbs daily from whole food sources. Focus on: lean proteins (chicken, fish, turkey, eggs), non-starchy vegetables (leafy greens, broccoli, cauliflower), healthy fats (avocado, olive oil, nuts, seeds). Avoid: bread, pasta, rice, potatoes, sugary foods, processed snacks. Meal prep on Sundays to make adherence easier.',
'Expect fasting glucose to decrease by 10-20 mg/dL within 4-8 weeks. HbA1c may improve by 0.5-1.0%. Weight loss of 5-10 lbs in first month if overweight. Improved energy and reduced cravings within 2-3 weeks.',
90, 'moderate', 'free');

-- Supplement interventions
INSERT INTO interventions (intervention_type, name, short_description, detailed_description, how_to_implement, dosage_info, expected_outcome, typical_duration_days, difficulty_level, estimated_cost, contraindications, brand_recommendations) VALUES
('supplement', 'Berberine 500mg 3x/day', 'Natural compound that improves insulin sensitivity and glucose metabolism', 
'Berberine is a plant alkaloid that activates AMPK (similar mechanism to metformin) and improves cellular glucose uptake. Multiple studies show significant improvements in fasting glucose and HbA1c.',
'Take 500mg berberine with each meal (breakfast, lunch, dinner) for a total of 1,500mg daily. Taking with food reduces GI side effects. Start with 500mg once daily for the first week to assess tolerance, then increase to 3x/day.',
'500mg with each meal (1,500mg total daily)',
'Expect 10-20 mg/dL reduction in fasting glucose within 8-12 weeks. HbA1c may improve by 0.5-1.0%. Also improves lipid profiles (10-20% reduction in LDL and triglycerides). Works synergistically with low-carb diet.',
90, 'easy', 'low', 
'May interact with diabetes medications - consult physician if on metformin or insulin. Can cause digestive upset (diarrhea, constipation, gas) initially - usually resolves within 1-2 weeks. Not recommended during pregnancy or breastfeeding.',
'Thorne Research, Pure Encapsulations, Life Extension, Doctor''s Best. Look for 500mg capsules of berberine HCl.');

INSERT INTO interventions (intervention_type, name, short_description, detailed_description, how_to_implement, dosage_info, expected_outcome, typical_duration_days, difficulty_level, estimated_cost, brand_recommendations) VALUES
('supplement', 'Vitamin D3 5,000 IU daily', 'Supplement to raise vitamin D levels to optimal range', 
'Vitamin D3 (cholecalciferol) supplementation is the most effective way to raise vitamin D levels, especially for those with limited sun exposure or living in northern climates.',
'Take 5,000 IU (125 mcg) vitamin D3 daily with a fatty meal (breakfast or dinner) to enhance absorption. Vitamin D is fat-soluble and absorbs best with dietary fat. Take consistently at the same time each day.',
'5,000 IU (125 mcg) daily',
'Expect vitamin D levels to increase by 20-30 ng/mL over 8-12 weeks. At 5,000 IU daily, most people reach 50+ ng/mL within 2-3 months. Retest after 12 weeks to confirm levels are in optimal range (50-80 ng/mL).',
90, 'easy', 'low',
'Thorne Research Vitamin D/K2, Pure Encapsulations Vitamin D3, NatureWise Vitamin D3, Sports Research Vitamin D3 + K2. Look for D3 (not D2) and consider K2 for synergy.');

-- Lifestyle interventions
INSERT INTO interventions (intervention_type, name, short_description, detailed_description, how_to_implement, expected_outcome, typical_duration_days, difficulty_level, estimated_cost) VALUES
('lifestyle', 'Daily 10,000 Steps', 'Increase non-exercise activity to improve insulin sensitivity and metabolic health', 
'Walking 10,000 steps per day increases NEAT (non-exercise activity thermogenesis) and improves insulin sensitivity without requiring structured exercise. Walking after meals is particularly effective for glucose control.',
'Track steps using smartphone (iPhone Health, Google Fit) or fitness watch (Fitbit, Apple Watch, Garmin). Break into multiple sessions: morning walk (20 min), lunch walk (15 min), evening walk (20 min). Park farther away, take stairs, walk during phone calls. Aim for at least 2,000 steps within 30 minutes after meals for glucose control benefit.',
'Improved post-meal glucose control (reduce spikes by 10-15%). Contributes 5-10% to overall metabolic improvement. May see 5-10 mg/dL improvement in fasting glucose over 8-12 weeks. Supports weight management and cardiovascular health.',
90, 'easy', 'free');

-- Exercise interventions
INSERT INTO interventions (intervention_type, name, short_description, detailed_description, how_to_implement, expected_outcome, typical_duration_days, difficulty_level, estimated_cost) VALUES
('exercise', 'Resistance Training 3x/week', 'Build muscle mass to improve glucose disposal and insulin sensitivity', 
'Resistance training increases muscle mass, which is the primary site of glucose disposal. Strength training 3x per week significantly improves insulin sensitivity and metabolic health.',
'Perform full-body workouts 3 days per week (Monday, Wednesday, Friday). Focus on compound movements: squats, deadlifts, bench press, rows, overhead press. Do 3-4 sets of 6-12 reps per exercise. Progressive overload: gradually increase weight by 2.5-5 lbs every 1-2 weeks. Start with bodyweight or light weights if new to training. Consider hiring a trainer for first month to learn proper form.',
'Improved insulin sensitivity within 4-6 weeks. May see 5-15 mg/dL improvement in fasting glucose within 8-12 weeks. Increased muscle mass improves glucose disposal long-term. Better body composition (more muscle, less fat). Increased strength and functional fitness.',
90, 'moderate', 'low');

-- Testing interventions
INSERT INTO interventions (intervention_type, name, short_description, detailed_description, how_to_implement, expected_outcome, typical_duration_days, difficulty_level, estimated_cost) VALUES
('testing', 'Continuous Glucose Monitor (CGM) 14-day trial', 'Track real-time glucose response to foods and activities', 
'A continuous glucose monitor (CGM) tracks glucose levels 24/7, providing insights into how specific foods, meals, sleep, stress, and exercise affect blood sugar. This allows for highly personalized dietary optimization.',
'Order a Freestyle Libre, Dexcom, or similar over-the-counter CGM. Apply sensor to upper arm (lasts 10-14 days). Use smartphone app to scan and view glucose levels. Monitor glucose response after meals - optimal is staying below 120 mg/dL and returning to baseline within 2 hours. Identify problem foods that cause large spikes. Experiment with meal timing, food combinations, and exercise timing.',
'Identify personal glucose responses to specific foods and activities. Optimize diet based on individual responses. Increased awareness and motivation for dietary changes. Learn which foods spike glucose and should be limited. Typically see 5-15 mg/dL improvement in average glucose within 2 weeks by making adjustments.',
14, 'easy', 'medium');

-- ============================================================================
-- SECTION 16: FUNCTIONS FOR APPLICATION LOGIC
-- ============================================================================

-- Function: Calculate HOMA-IR (Homeostatic Model Assessment of Insulin Resistance)
-- Formula: (Fasting Insulin * Fasting Glucose) / 405
CREATE OR REPLACE FUNCTION calculate_homa_ir(fasting_insulin DECIMAL, fasting_glucose DECIMAL)
RETURNS DECIMAL AS $$
BEGIN
    IF fasting_insulin IS NULL OR fasting_glucose IS NULL THEN
        RETURN NULL;
    END IF;
    RETURN ROUND((fasting_insulin * fasting_glucose) / 405.0, 2);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function: Calculate Triglyceride:HDL ratio
CREATE OR REPLACE FUNCTION calculate_tg_hdl_ratio(triglycerides DECIMAL, hdl DECIMAL)
RETURNS DECIMAL AS $$
BEGIN
    IF triglycerides IS NULL OR hdl IS NULL OR hdl = 0 THEN
        RETURN NULL;
    END IF;
    RETURN ROUND(triglycerides / hdl, 2);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function: Calculate overall health score for a lab upload
-- Returns 1-10 based on percentage of biomarkers in optimal range
CREATE OR REPLACE FUNCTION calculate_health_score(p_lab_upload_id UUID)
RETURNS INTEGER AS $$
DECLARE
    total_markers INTEGER;
    optimal_markers INTEGER;
    score DECIMAL;
BEGIN
    SELECT 
        COUNT(*),
        COUNT(CASE WHEN is_optimal = TRUE THEN 1 END)
    INTO total_markers, optimal_markers
    FROM user_biomarker_results
    WHERE lab_upload_id = p_lab_upload_id;
    
    IF total_markers = 0 THEN
        RETURN NULL;
    END IF;
    
    score = (optimal_markers::DECIMAL / total_markers) * 10;
    RETURN ROUND(score)::INTEGER;
END;
$$ LANGUAGE plpgsql;

-- Function: Get prioritized suboptimal biomarkers for protocol generation
CREATE OR REPLACE FUNCTION get_priority_issues(p_lab_upload_id UUID)
RETURNS TABLE (
    biomarker_result_id UUID,
    biomarker_name VARCHAR(100),
    condition_name VARCHAR(100),
    severity VARCHAR(20),
    priority_score INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ubr.id,
        b.name,
        bc.condition_name,
        bc.severity,
        bc.priority_score
    FROM user_biomarker_results ubr
    JOIN biomarkers b ON ubr.biomarker_id = b.id
    JOIN biomarker_conditions bc ON ubr.condition_id = bc.id
    WHERE ubr.lab_upload_id = p_lab_upload_id
    AND bc.severity IN ('suboptimal', 'concerning', 'clinical')
    ORDER BY bc.priority_score DESC, b.display_order;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- SECTION 17: SAMPLE DATA FOR DEVELOPMENT/TESTING
-- ============================================================================

-- Note: This is optional seed data for testing. Remove or modify for production.

-- Create a test user
INSERT INTO users (email, password_hash, first_name, last_name, email_verified, subscription_tier)
VALUES (
    'test@example.com',
    crypt('password123', gen_salt('bf')),
    'Test',
    'User',
    TRUE,
    'monthly'
);

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================

-- Grant permissions (adjust based on your application user)
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_app_user;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO your_app_user;

-- Final notes:
-- 1. Remember to create database backups before running this schema
-- 2. Adjust table/column sizes based on expected data volumes
-- 3. Consider partitioning large tables (events, audit_log) if needed
-- 4. Set up connection pooling (PgBouncer) for production
-- 5. Configure PostgreSQL settings for your workload
-- 6. Implement rate limiting at application level
-- 7. Add database monitoring (pg_stat_statements)
-- 8. Consider read replicas for analytics queries
-- 9. Implement proper backup strategy (daily snapshots + WAL archiving)
-- 10. Test restoration procedures regularly