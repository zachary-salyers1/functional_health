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

type ResearchStudy = {
  id: number;
  title: string;
  authors: string;
  journal: string;
  publication_year: number;
  pubmed_id: string;
  doi: string;
  url: string;
  study_type: string;
  quality_score: number;
  sample_size: number;
  duration_weeks: number;
  key_findings: string;
  statistical_significance: string;
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
  research_studies: ResearchStudy[];
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
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [showShoppingList, setShowShoppingList] = useState(false);

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

  const updateInterventionStatus = async (recommendationId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/recommendations/${recommendationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      // Update local state
      setRecommendations(prev =>
        prev.map(rec =>
          rec.id === recommendationId
            ? { ...rec, status: newStatus }
            : rec
        )
      );
    } catch (err: any) {
      alert('Failed to update status: ' + err.message);
    }
  };

  const handleDownloadPdf = async () => {
    setDownloadingPdf(true);
    try {
      const response = await fetch(`/api/protocols/${protocolId}/pdf`);
      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }

      // Get the PDF blob
      const blob = await response.blob();

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `protocol-${protocol?.protocol_name.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(a);
      a.click();

      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err: any) {
      alert('Failed to download PDF: ' + err.message);
    } finally {
      setDownloadingPdf(false);
    }
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

  const generateShoppingList = () => {
    const items: { category: string; items: string[] }[] = [];

    // Group by intervention type
    const supplements = recommendations
      .filter(r => r.interventions.intervention_type === 'supplement' && r.status !== 'skipped')
      .map(r => ({
        name: r.interventions.name,
        dosage: r.interventions.dosage_info,
        brands: r.interventions.brand_recommendations
      }));

    const dietary = recommendations
      .filter(r => r.interventions.intervention_type === 'dietary' && r.status !== 'skipped')
      .map(r => r.interventions.name);

    const lifestyle = recommendations
      .filter(r => r.interventions.intervention_type === 'lifestyle' && r.status !== 'skipped')
      .map(r => r.interventions.name);

    if (supplements.length > 0) {
      items.push({
        category: 'Supplements',
        items: supplements.map(s => {
          let item = s.name;
          if (s.dosage) item += ` (${s.dosage})`;
          if (s.brands) item += ` - Brands: ${s.brands}`;
          return item;
        })
      });
    }

    if (dietary.length > 0) {
      items.push({
        category: 'Dietary Changes',
        items: dietary
      });
    }

    if (lifestyle.length > 0) {
      items.push({
        category: 'Lifestyle/Equipment',
        items: lifestyle
      });
    }

    return items;
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
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {protocol.protocol_name}
                </h1>
                <p className="text-lg text-gray-600">{protocol.priority_focus}</p>
              </div>
              <div className="ml-4 flex gap-2">
                <button
                  onClick={() => setShowShoppingList(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Shopping List
                </button>
                <button
                  onClick={handleDownloadPdf}
                  disabled={downloadingPdf}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {downloadingPdf ? (
                    <>
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Generating...
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Download PDF
                    </>
                  )}
                </button>
              </div>
            </div>

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
                      {/* Status Tracking */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-3">Track Your Progress:</h4>
                        <div className="flex gap-2">
                          <button
                            onClick={() => updateInterventionStatus(rec.id, 'pending')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                              rec.status === 'pending'
                                ? 'bg-gray-600 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                          >
                            Not Started
                          </button>
                          <button
                            onClick={() => updateInterventionStatus(rec.id, 'started')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                              rec.status === 'started'
                                ? 'bg-blue-600 text-white'
                                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                            }`}
                          >
                            Started
                          </button>
                          <button
                            onClick={() => updateInterventionStatus(rec.id, 'completed')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                              rec.status === 'completed'
                                ? 'bg-green-600 text-white'
                                : 'bg-green-100 text-green-700 hover:bg-green-200'
                            }`}
                          >
                            Completed
                          </button>
                          <button
                            onClick={() => updateInterventionStatus(rec.id, 'skipped')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                              rec.status === 'skipped'
                                ? 'bg-red-600 text-white'
                                : 'bg-red-100 text-red-700 hover:bg-red-200'
                            }`}
                          >
                            Skipped
                          </button>
                        </div>
                      </div>

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

                      {/* Research Citations */}
                      {rec.research_studies && rec.research_studies.length > 0 && (
                        <div className="bg-purple-50 rounded-lg p-4">
                          <h4 className="font-semibold text-purple-900 mb-3">
                            📚 Research Evidence ({rec.research_studies.length} {rec.research_studies.length === 1 ? 'study' : 'studies'})
                          </h4>
                          <div className="space-y-3">
                            {rec.research_studies.map((study, idx) => (
                              <div key={study.id} className="bg-white rounded p-3 border border-purple-200">
                                <div className="flex items-start justify-between gap-2 mb-2">
                                  <h5 className="font-medium text-purple-900 text-sm flex-1">
                                    {idx + 1}. {study.title}
                                  </h5>
                                  {study.quality_score && (
                                    <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded font-medium whitespace-nowrap">
                                      Quality: {study.quality_score}/10
                                    </span>
                                  )}
                                </div>
                                {study.authors && (
                                  <p className="text-xs text-gray-600 mb-1">{study.authors}</p>
                                )}
                                <p className="text-xs text-gray-600 mb-2">
                                  {study.journal && <span>{study.journal}, </span>}
                                  {study.publication_year}
                                  {study.sample_size && <span> • n={study.sample_size}</span>}
                                  {study.duration_weeks && <span> • {study.duration_weeks} weeks</span>}
                                  {study.study_type && <span> • {study.study_type}</span>}
                                </p>
                                {study.key_findings && (
                                  <p className="text-xs text-gray-700 mb-2">
                                    <strong>Key Finding:</strong> {study.key_findings}
                                  </p>
                                )}
                                <div className="flex gap-2">
                                  {study.pubmed_id && (
                                    <a
                                      href={`https://pubmed.ncbi.nlm.nih.gov/${study.pubmed_id}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-xs text-purple-600 hover:text-purple-800 underline"
                                    >
                                      PubMed
                                    </a>
                                  )}
                                  {study.doi && (
                                    <a
                                      href={`https://doi.org/${study.doi}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-xs text-purple-600 hover:text-purple-800 underline"
                                    >
                                      DOI
                                    </a>
                                  )}
                                  {study.url && (
                                    <a
                                      href={study.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-xs text-purple-600 hover:text-purple-800 underline"
                                    >
                                      Full Text
                                    </a>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

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

      {/* Shopping List Modal */}
      {showShoppingList && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Shopping List</h2>
              <button
                onClick={() => setShowShoppingList(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>
            <div className="p-6">
              {generateShoppingList().map((category) => (
                <div key={category.category} className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    {category.category === 'Supplements' && '💊'}
                    {category.category === 'Dietary Changes' && '🥗'}
                    {category.category === 'Lifestyle/Equipment' && '🛠️'}
                    {category.category}
                  </h3>
                  <ul className="space-y-2">
                    {category.items.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <input
                          type="checkbox"
                          className="mt-1 h-4 w-4 text-blue-600 rounded"
                        />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              {generateShoppingList().length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>No items to purchase yet.</p>
                  <p className="text-sm mt-2">Start marking interventions as "Started" to build your shopping list.</p>
                </div>
              )}
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => {
                    const list = generateShoppingList()
                      .map(cat => `${cat.category}:\n${cat.items.map((item, i) => `  ${i + 1}. ${item}`).join('\n')}`)
                      .join('\n\n');
                    navigator.clipboard.writeText(list);
                    alert('Shopping list copied to clipboard!');
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Copy to Clipboard
                </button>
                <button
                  onClick={() => setShowShoppingList(false)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
