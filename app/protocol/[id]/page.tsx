'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth/auth-context';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

type Intervention = {
  id: number;
  intervention_type: string;
  name: string;
  short_description: string;
  detailed_description: string;
  how_to_implement: string;
  dosage_info: string;
  frequency: string;
  timing: string;
  brand_recommendations: string;
  expected_outcome: string;
  difficulty_level: string;
  estimated_cost: string;
  contraindications: string;
  warnings: string;
};

type Recommendation = {
  id: string;
  priority_order: number;
  recommendation_strength: string;
  custom_rationale: string;
  expected_outcome: string;
  estimated_timeframe_days: number;
  status: string;
  interventions: Intervention;
};

type Protocol = {
  id: string;
  protocol_name: string;
  priority_focus: string;
  estimated_duration_days: number;
  retest_recommended_date: string;
  total_recommendations: number;
  recommendations_by_type: {
    dietary: number;
    supplement: number;
    lifestyle: number;
    exercise: number;
    sleep: number;
  };
};

export default function ProtocolPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const protocolId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [protocol, setProtocol] = useState<Protocol | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/protocol/' + protocolId);
      return;
    }

    if (user && protocolId) {
      fetchProtocol();
    }
  }, [user, authLoading, protocolId]);

  const fetchProtocol = async () => {
    try {
      const response = await fetch(`/api/protocols/${protocolId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch protocol');
      }

      const data = await response.json();
      setProtocol(data.protocol);
      setRecommendations(data.recommendations);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleCard = (id: string) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedCards(newExpanded);
  };

  const getStrengthBadge = (strength: string) => {
    const badges = {
      primary: 'bg-red-100 text-red-800',
      secondary: 'bg-yellow-100 text-yellow-800',
      optional: 'bg-blue-100 text-blue-800'
    };
    return badges[strength as keyof typeof badges] || badges.optional;
  };

  const getTypeBadge = (type: string) => {
    const badges = {
      dietary: 'bg-green-100 text-green-800',
      supplement: 'bg-purple-100 text-purple-800',
      lifestyle: 'bg-blue-100 text-blue-800',
      exercise: 'bg-orange-100 text-orange-800',
      sleep: 'bg-indigo-100 text-indigo-800'
    };
    return badges[type as keyof typeof badges] || 'bg-gray-100 text-gray-800';
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading protocol...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-600">Error: {error}</div>
      </div>
    );
  }

  if (!protocol) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Protocol not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <Link href="/dashboard" className="text-blue-600 hover:text-blue-800">
            ← Back to Dashboard
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Protocol Header */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {protocol.protocol_name}
            </h1>
            <p className="text-lg text-gray-600 mb-4">{protocol.priority_focus}</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-sm text-gray-600">Total Interventions</div>
                <div className="text-2xl font-bold text-blue-600">
                  {protocol.total_recommendations}
                </div>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <div className="text-sm text-gray-600">Estimated Duration</div>
                <div className="text-2xl font-bold text-green-600">
                  {protocol.estimated_duration_days} days
                </div>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="text-sm text-gray-600">Retest Recommended</div>
                <div className="text-2xl font-bold text-purple-600">
                  {new Date(protocol.retest_recommended_date).toLocaleDateString()}
                </div>
              </div>
            </div>

            {/* Breakdown by Type */}
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">By Category:</h3>
              <div className="flex flex-wrap gap-2">
                {protocol.recommendations_by_type.dietary > 0 && (
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                    Dietary: {protocol.recommendations_by_type.dietary}
                  </span>
                )}
                {protocol.recommendations_by_type.supplement > 0 && (
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                    Supplements: {protocol.recommendations_by_type.supplement}
                  </span>
                )}
                {protocol.recommendations_by_type.lifestyle > 0 && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    Lifestyle: {protocol.recommendations_by_type.lifestyle}
                  </span>
                )}
                {protocol.recommendations_by_type.exercise > 0 && (
                  <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
                    Exercise: {protocol.recommendations_by_type.exercise}
                  </span>
                )}
                {protocol.recommendations_by_type.sleep > 0 && (
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">
                    Sleep: {protocol.recommendations_by_type.sleep}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Recommendations List */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Personalized Protocol</h2>

            {recommendations.map((rec) => (
              <div key={rec.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* Card Header */}
                <div
                  className="p-6 cursor-pointer hover:bg-gray-50"
                  onClick={() => toggleCard(rec.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg font-semibold text-gray-700">
                          #{rec.priority_order}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getTypeBadge(rec.interventions.intervention_type)}`}>
                          {rec.interventions.intervention_type.toUpperCase()}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getStrengthBadge(rec.recommendation_strength)}`}>
                          {rec.recommendation_strength.toUpperCase()}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {rec.interventions.name}
                      </h3>
                      <p className="text-gray-600">
                        {rec.interventions.short_description}
                      </p>
                    </div>
                    <button className="ml-4 text-gray-400 hover:text-gray-600">
                      {expandedCards.has(rec.id) ? '▼' : '▶'}
                    </button>
                  </div>
                </div>

                {/* Expanded Content */}
                {expandedCards.has(rec.id) && (
                  <div className="px-6 pb-6 border-t pt-4">
                    <div className="space-y-4">
                      {/* Rationale */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Why This Matters:</h4>
                        <p className="text-gray-700">{rec.custom_rationale}</p>
                      </div>

                      {/* How to Implement */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">How to Implement:</h4>
                        <p className="text-gray-700">{rec.interventions.how_to_implement}</p>
                      </div>

                      {/* Details Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 rounded-lg p-4">
                        {rec.interventions.dosage_info && (
                          <div>
                            <div className="text-sm font-semibold text-gray-700">Dosage:</div>
                            <div className="text-gray-600">{rec.interventions.dosage_info}</div>
                          </div>
                        )}
                        {rec.interventions.frequency && (
                          <div>
                            <div className="text-sm font-semibold text-gray-700">Frequency:</div>
                            <div className="text-gray-600">{rec.interventions.frequency}</div>
                          </div>
                        )}
                        {rec.interventions.timing && (
                          <div>
                            <div className="text-sm font-semibold text-gray-700">Timing:</div>
                            <div className="text-gray-600">{rec.interventions.timing}</div>
                          </div>
                        )}
                        {rec.interventions.difficulty_level && (
                          <div>
                            <div className="text-sm font-semibold text-gray-700">Difficulty:</div>
                            <div className="text-gray-600 capitalize">{rec.interventions.difficulty_level}</div>
                          </div>
                        )}
                        {rec.interventions.estimated_cost && (
                          <div>
                            <div className="text-sm font-semibold text-gray-700">Cost:</div>
                            <div className="text-gray-600">{rec.interventions.estimated_cost}</div>
                          </div>
                        )}
                        <div>
                          <div className="text-sm font-semibold text-gray-700">Timeline:</div>
                          <div className="text-gray-600">{rec.estimated_timeframe_days} days</div>
                        </div>
                      </div>

                      {/* Brand Recommendations */}
                      {rec.interventions.brand_recommendations && (
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">Recommended Brands/Tools:</h4>
                          <p className="text-gray-700">{rec.interventions.brand_recommendations}</p>
                        </div>
                      )}

                      {/* Expected Outcome */}
                      <div className="bg-blue-50 rounded-lg p-4">
                        <h4 className="font-semibold text-blue-900 mb-1">Expected Outcome:</h4>
                        <p className="text-blue-800">{rec.expected_outcome}</p>
                      </div>

                      {/* Warnings */}
                      {(rec.interventions.contraindications || rec.interventions.warnings) && (
                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                          <h4 className="font-semibold text-yellow-900 mb-1">⚠️ Important Information:</h4>
                          {rec.interventions.contraindications && (
                            <p className="text-yellow-800 mb-2">
                              <strong>Contraindications:</strong> {rec.interventions.contraindications}
                            </p>
                          )}
                          {rec.interventions.warnings && (
                            <p className="text-yellow-800">
                              <strong>Warnings:</strong> {rec.interventions.warnings}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Disclaimer */}
          <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h3 className="font-bold text-yellow-900 mb-2">⚠️ Important Disclaimer</h3>
            <p className="text-yellow-800 text-sm">
              This protocol is for educational purposes only and is not medical advice.
              Always consult with your healthcare provider before starting any new supplements,
              dietary changes, or exercise programs. Inform your doctor of all medications
              and supplements you are taking to avoid interactions.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
