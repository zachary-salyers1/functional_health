// Database types for Functional Health Lab Analysis App
// Generated from schema.md

export type AccountStatus = 'active' | 'suspended' | 'deleted';
export type SubscriptionTier = 'free' | 'pay_per_upload' | 'monthly' | 'annual';
export type SubscriptionStatus = 'active' | 'cancelled' | 'past_due';
export type BiologicalSex = 'male' | 'female' | 'other';
export type UnitsPreference = 'imperial' | 'metric';

export type BiomarkerCategory =
  | 'metabolic'
  | 'lipids'
  | 'thyroid'
  | 'vitamins'
  | 'minerals'
  | 'inflammation'
  | 'hormones'
  | 'kidney'
  | 'liver'
  | 'blood_count'
  | 'other';

export type Severity = 'optimal' | 'suboptimal' | 'concerning' | 'clinical';

export type InterventionType =
  | 'dietary'
  | 'supplement'
  | 'lifestyle'
  | 'exercise'
  | 'sleep'
  | 'stress'
  | 'testing';

export type DifficultyLevel = 'easy' | 'moderate' | 'advanced';
export type EstimatedCost = 'free' | 'low' | 'medium' | 'high';

export type StudyType =
  | 'RCT'
  | 'meta-analysis'
  | 'systematic_review'
  | 'cohort'
  | 'case-control'
  | 'observational';

export type RecommendationStrength = 'primary' | 'secondary' | 'optional';

export type LabUploadStatus = 'uploaded' | 'processing' | 'completed' | 'error';
export type PaymentStatus = 'free' | 'paid' | 'included_in_subscription';
export type DataSource = 'ocr' | 'manual' | 'api';

export type ProtocolStatus = 'active' | 'completed' | 'abandoned';
export type GenerationMethod = 'rule_based' | 'ai_enhanced';
export type InterventionStatus = 'pending' | 'started' | 'completed' | 'skipped';

export type PaymentType = 'upload' | 'subscription_monthly' | 'subscription_annual';
export type StripePaymentStatus = 'pending' | 'succeeded' | 'failed' | 'refunded';

export type AdminRole = 'super_admin' | 'content_manager' | 'support';
export type TicketCategory = 'technical' | 'billing' | 'protocol_question' | 'feature_request' | 'bug';
export type TicketPriority = 'low' | 'normal' | 'high' | 'urgent';
export type TicketStatus = 'open' | 'in_progress' | 'waiting_on_customer' | 'resolved' | 'closed';
export type AuthorType = 'user' | 'admin';

// ============================================================================
// USER MANAGEMENT
// ============================================================================

export interface User {
  id: string;
  email: string;
  password_hash: string;
  first_name?: string;
  last_name?: string;
  date_of_birth?: Date;
  biological_sex?: BiologicalSex;
  email_verified: boolean;
  account_status: AccountStatus;
  subscription_tier: SubscriptionTier;
  subscription_status?: SubscriptionStatus;
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  subscription_started_at?: Date;
  subscription_ends_at?: Date;
  created_at: Date;
  updated_at: Date;
  last_login_at?: Date;
  deleted_at?: Date;
}

export interface UserSession {
  id: string;
  user_id: string;
  session_token: string;
  expires_at: Date;
  created_at: Date;
  ip_address?: string;
  user_agent?: string;
}

export interface UserPreferences {
  user_id: string;
  email_notifications: boolean;
  retest_reminders: boolean;
  marketing_emails: boolean;
  units_preference: UnitsPreference;
  timezone: string;
  created_at: Date;
  updated_at: Date;
}

// ============================================================================
// BIOMARKERS
// ============================================================================

export interface Biomarker {
  id: number;
  name: string;
  category: BiomarkerCategory;
  standard_unit?: string;
  alternative_units?: Record<string, number>;
  optimal_range_min?: number;
  optimal_range_max?: number;
  clinical_low?: number;
  clinical_high?: number;
  short_description?: string;
  why_it_matters?: string;
  how_to_test?: string;
  display_order?: number;
  is_active: boolean;
  requires_fasting: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface BiomarkerCondition {
  id: number;
  biomarker_id: number;
  condition_name: string;
  severity: Severity;
  min_value?: number;
  max_value?: number;
  description?: string;
  clinical_significance?: string;
  priority_score?: number;
  created_at: Date;
  updated_at: Date;
}

// ============================================================================
// INTERVENTIONS & RESEARCH
// ============================================================================

export interface Intervention {
  id: number;
  intervention_type: InterventionType;
  name: string;
  short_description?: string;
  detailed_description?: string;
  how_to_implement?: string;
  dosage_info?: string;
  frequency?: string;
  timing?: string;
  brand_recommendations?: string;
  expected_outcome?: string;
  typical_duration_days?: number;
  expected_improvement_percentage?: number;
  difficulty_level?: DifficultyLevel;
  estimated_cost?: EstimatedCost;
  contraindications?: string;
  warnings?: string;
  amazon_affiliate_link?: string;
  tracking_metrics?: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface ResearchStudy {
  id: number;
  title: string;
  authors?: string;
  journal?: string;
  publication_year?: number;
  pubmed_id?: string;
  doi?: string;
  url?: string;
  study_type?: StudyType;
  quality_score?: number;
  sample_size?: number;
  duration_weeks?: number;
  population_description?: string;
  key_findings?: string;
  statistical_significance?: string;
  limitations?: string;
  conflict_of_interest?: string;
  relevant_biomarkers?: number[];
  relevant_interventions?: number[];
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface ProtocolRule {
  id: number;
  biomarker_condition_id: number;
  intervention_id: number;
  recommendation_strength: RecommendationStrength;
  priority_order?: number;
  rationale?: string;
  expected_outcome?: string;
  timeframe_days?: number;
  requires_conditions?: Record<string, any>;
  excludes_conditions?: Record<string, any>;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface ProtocolRuleStudy {
  protocol_rule_id: number;
  research_study_id: number;
  relevance_score?: number;
  notes?: string;
}

// ============================================================================
// USER LAB DATA
// ============================================================================

export interface UserLabUpload {
  id: string;
  user_id: string;
  upload_date: Date;
  lab_date: Date;
  lab_source?: string;
  original_filename?: string;
  pdf_url?: string;
  pdf_s3_key?: string;
  status: LabUploadStatus;
  ocr_completed: boolean;
  ocr_confidence_score?: number;
  payment_status?: PaymentStatus;
  payment_amount?: number;
  stripe_payment_intent_id?: string;
  user_notes?: string;
  admin_notes?: string;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

export interface UserBiomarkerResult {
  id: string;
  lab_upload_id: string;
  biomarker_id: number;
  value?: number;
  unit?: string;
  lab_reference_low?: number;
  lab_reference_high?: number;
  condition_id?: number;
  is_optimal?: boolean;
  deviation_from_optimal?: number;
  data_source?: DataSource;
  manual_override: boolean;
  user_notes?: string;
  created_at: Date;
  updated_at: Date;
}

// ============================================================================
// GENERATED PROTOCOLS
// ============================================================================

export interface GeneratedProtocol {
  id: string;
  user_id: string;
  lab_upload_id: string;
  protocol_name?: string;
  priority_focus?: string;
  overall_health_score?: number;
  estimated_duration_days?: number;
  retest_recommended_date?: Date;
  pdf_url?: string;
  pdf_s3_key?: string;
  status: ProtocolStatus;
  total_interventions?: number;
  interventions_started: number;
  interventions_completed: number;
  interventions_skipped: number;
  generation_method?: GenerationMethod;
  generation_version?: string;
  generated_at: Date;
  last_viewed_at?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface ProtocolRecommendation {
  id: string;
  protocol_id: string;
  protocol_rule_id?: number;
  intervention_id: number;
  biomarker_result_id?: string;
  priority_order?: number;
  recommendation_strength?: RecommendationStrength;
  relevant_biomarker_ids?: number[];
  custom_rationale?: string;
  custom_implementation_notes?: string;
  status: InterventionStatus;
  started_at?: Date;
  completed_at?: Date;
  user_notes?: string;
  user_rating?: number;
  perceived_effectiveness?: number;
  side_effects_reported?: string;
  created_at: Date;
  updated_at: Date;
}

export interface ProtocolRecommendationStudy {
  recommendation_id: string;
  research_study_id: number;
  display_order?: number;
}

// ============================================================================
// PROGRESS TRACKING
// ============================================================================

export interface ProgressSnapshot {
  id: string;
  user_id: string;
  lab_upload_id: string;
  overall_health_score?: number;
  biomarkers_optimal?: number;
  biomarkers_suboptimal?: number;
  biomarkers_concerning?: number;
  previous_snapshot_id?: string;
  health_score_change?: number;
  biomarkers_improved?: number;
  biomarkers_worsened?: number;
  biomarkers_unchanged?: number;
  active_protocol_id?: string;
  interventions_completed_count?: number;
  estimated_adherence_percentage?: number;
  snapshot_date: Date;
  created_at: Date;
}

export interface BiomarkerTrend {
  id: string;
  user_id: string;
  biomarker_id: number;
  measurement_date: Date;
  value?: number;
  unit?: string;
  lab_upload_id?: string;
  condition_id?: number;
  was_optimal?: boolean;
  active_interventions?: string[];
  created_at: Date;
}

// ============================================================================
// PAYMENT & BILLING
// ============================================================================

export interface Payment {
  id: string;
  user_id: string;
  stripe_payment_intent_id?: string;
  stripe_charge_id?: string;
  amount: number;
  currency: string;
  payment_type?: PaymentType;
  payment_status?: StripePaymentStatus;
  lab_upload_id?: string;
  paid_at?: Date;
  refunded_at?: Date;
  created_at: Date;
}

export interface Subscription {
  id: string;
  user_id: string;
  stripe_subscription_id: string;
  stripe_customer_id: string;
  plan_type: string;
  plan_amount: number;
  currency: string;
  status: SubscriptionStatus;
  started_at: Date;
  current_period_start?: Date;
  current_period_end?: Date;
  cancelled_at?: Date;
  ended_at?: Date;
  trial_start?: Date;
  trial_end?: Date;
  cancel_at_period_end: boolean;
  cancellation_reason?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Invoice {
  id: string;
  user_id: string;
  subscription_id?: string;
  stripe_invoice_id?: string;
  amount_due: number;
  amount_paid?: number;
  currency: string;
  status?: string;
  invoice_date?: Date;
  due_date?: Date;
  paid_at?: Date;
  invoice_pdf_url?: string;
  hosted_invoice_url?: string;
  created_at: Date;
}

// ============================================================================
// ADMIN & SUPPORT
// ============================================================================

export interface AdminUser {
  id: string;
  email: string;
  password_hash: string;
  name?: string;
  role?: AdminRole;
  is_active: boolean;
  last_login_at?: Date;
  created_at: Date;
}

export interface SupportTicket {
  id: string;
  user_id?: string;
  subject: string;
  description: string;
  category?: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  assigned_to?: string;
  lab_upload_id?: string;
  protocol_id?: string;
  resolved_at?: Date;
  resolution_notes?: string;
  created_at: Date;
  updated_at: Date;
}

export interface SupportTicketMessage {
  id: string;
  ticket_id: string;
  author_type: AuthorType;
  author_id: string;
  message: string;
  is_internal_note: boolean;
  attachments?: Record<string, any>;
  created_at: Date;
}

export interface AuditLog {
  id: string;
  user_id?: string;
  admin_user_id?: string;
  action: string;
  entity_type?: string;
  entity_id?: string;
  description?: string;
  metadata?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  created_at: Date;
}

// ============================================================================
// ANALYTICS
// ============================================================================

export interface UserEvent {
  id: string;
  user_id?: string;
  event_type: string;
  event_name: string;
  properties?: Record<string, any>;
  session_id?: string;
  page_url?: string;
  referrer?: string;
  device_type?: string;
  browser?: string;
  os?: string;
  created_at: Date;
}

export interface DailyMetric {
  metric_date: Date;
  new_signups: number;
  active_users: number;
  labs_uploaded: number;
  labs_processed_successfully: number;
  ocr_average_confidence?: number;
  protocols_generated: number;
  avg_health_score?: number;
  revenue_total: number;
  payments_succeeded: number;
  payments_failed: number;
  new_subscribers: number;
  cancelled_subscribers: number;
  protocols_downloaded: number;
  interventions_started: number;
  interventions_completed: number;
  created_at: Date;
}
