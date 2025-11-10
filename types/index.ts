// Export all types
export * from './database';

// Application-specific types
export interface LabUploadFormData {
  lab_date: Date;
  lab_source?: string;
  pdf_file?: File;
  user_notes?: string;
}

export interface BiomarkerInput {
  biomarker_id: number;
  value: number;
  unit: string;
  user_notes?: string;
}

export interface ProtocolGenerationResult {
  protocol_id: string;
  overall_health_score: number;
  priority_focus: string;
  total_interventions: number;
  estimated_duration_days: number;
  retest_recommended_date: Date;
  recommendations: ProtocolRecommendationWithDetails[];
}

export interface ProtocolRecommendationWithDetails {
  id: string;
  priority_order: number;
  recommendation_strength: string;
  intervention: {
    id: number;
    name: string;
    type: string;
    short_description: string;
    detailed_description: string;
    how_to_implement: string;
    dosage_info?: string;
    expected_outcome: string;
    difficulty_level: string;
    estimated_cost: string;
  };
  biomarkers_addressed: {
    id: number;
    name: string;
    current_value: number;
    optimal_range_min: number;
    optimal_range_max: number;
  }[];
  research_studies: {
    id: number;
    title: string;
    authors: string;
    journal: string;
    pubmed_id: string;
    key_findings: string;
  }[];
  custom_rationale?: string;
}

export interface BiomarkerResultWithDetails {
  id: string;
  biomarker: {
    id: number;
    name: string;
    category: string;
    standard_unit: string;
  };
  value: number;
  unit: string;
  condition?: {
    id: number;
    condition_name: string;
    severity: string;
    description: string;
    priority_score: number;
  };
  is_optimal: boolean;
  deviation_from_optimal?: number;
}

export interface UserDashboardData {
  user: {
    id: string;
    email: string;
    first_name?: string;
    last_name?: string;
    subscription_tier: string;
  };
  total_lab_uploads: number;
  most_recent_lab_date?: Date;
  total_protocols: number;
  avg_health_score?: number;
  latest_results: BiomarkerResultWithDetails[];
  active_protocols: {
    id: string;
    protocol_name: string;
    overall_health_score: number;
    interventions_completed: number;
    total_interventions: number;
    generated_at: Date;
  }[];
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T = any> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
}

// Form validation schemas will use Zod, defined separately
