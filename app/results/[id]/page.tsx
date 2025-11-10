'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth/auth-context';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

type BiomarkerResult = {
  id: string;
  biomarker_id: string;
  value: number;
  unit: string;
  biomarker: {
    name: string;
    category: string;
    optimal_range_min: number;
    optimal_range_max: number;
    clinical_low: number;
    clinical_high: number;
    short_description: string;
    why_it_matters: string;
  };
  condition: {
    condition_name: string;
    severity: string;
    clinical_significance: string;
  } | null;
};

export default function ResultsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const uploadId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [results, setResults] = useState<BiomarkerResult[]>([]);
  const [upload, setUpload] = useState<any>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/results/' + uploadId);
      return;
    }

    if (user && uploadId) {
      fetchResults();
    }
  }, [user, authLoading, uploadId]);

  async function fetchResults() {
    try {
      const response = await fetch(`/api/results/${uploadId}`);
      if (!response.ok) throw new Error('Failed to fetch results');

      const data = await response.json();
      setResults(data.results);
      setUpload(data.upload);
    } catch (err: any) {
      setError(err.message || 'Failed to load results');
    } finally {
      setLoading(false);
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading results...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-sm">
          <div className="text-center">
            <div className="text-5xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Link
              href="/dashboard"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Group results by category
  const categorized = results.reduce((acc: any, result) => {
    const category = result.biomarker.category.toLowerCase();
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(result);
    return acc;
  }, {});

  const categoryOrder = ['metabolic', 'cardiovascular', 'lipids', 'thyroid', 'vitamins & minerals', 'vitamins', 'minerals', 'inflammatory', 'inflammation'];
  const categoryLabels: Record<string, string> = {
    metabolic: '🔥 Metabolic Health',
    cardiovascular: '❤️ Cardiovascular',
    lipids: '💧 Lipid Panel',
    thyroid: '🦋 Thyroid Function',
    'vitamins & minerals': '💊 Vitamins & Minerals',
    vitamins: '💊 Vitamins',
    minerals: '⚡ Minerals',
    inflammatory: '🔬 Inflammation',
    inflammation: '🔬 Inflammation',
  };

  // Count by severity
  const counts = results.reduce(
    (acc, r) => {
      const severity = r.condition?.severity || 'optimal';
      acc[severity] = (acc[severity] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const totalResults = results.length;
  const optimalCount = counts.optimal || 0;
  const suboptimalCount = counts.suboptimal || 0;
  const concerningCount = counts.concerning || 0;
  const clinicalCount = counts.clinical || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="text-2xl font-bold text-blue-600">
            Functional Health
          </Link>
          <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
            ← Back to Dashboard
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Lab Results Analysis
            </h1>
            <p className="text-gray-600">
              {upload?.lab_source || upload?.original_filename || 'Lab Results'} •{' '}
              {upload?.lab_date
                ? new Date(upload.lab_date).toLocaleDateString()
                : new Date(upload.upload_date).toLocaleDateString()}
            </p>
          </div>

          {/* Summary Cards */}
          <div className="grid md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="text-sm text-gray-600 mb-1">Total Biomarkers</div>
              <div className="text-3xl font-bold text-gray-900">{totalResults}</div>
            </div>
            <div className="bg-green-50 rounded-lg shadow-sm p-6 border border-green-200">
              <div className="text-sm text-green-700 mb-1">✓ Optimal</div>
              <div className="text-3xl font-bold text-green-700">{optimalCount}</div>
            </div>
            <div className="bg-yellow-50 rounded-lg shadow-sm p-6 border border-yellow-200">
              <div className="text-sm text-yellow-700 mb-1">⚠ Suboptimal</div>
              <div className="text-3xl font-bold text-yellow-700">{suboptimalCount}</div>
            </div>
            <div className="bg-red-50 rounded-lg shadow-sm p-6 border border-red-200">
              <div className="text-sm text-red-700 mb-1">! Concerning</div>
              <div className="text-3xl font-bold text-red-700">
                {concerningCount + clinicalCount}
              </div>
            </div>
          </div>

          {/* Results by Category */}
          {categoryOrder.map((category) => {
            const categoryResults = categorized[category] || [];
            if (categoryResults.length === 0) return null;

            return (
              <div key={category} className="bg-white rounded-lg shadow-sm">
                <div className="px-6 py-4 border-b">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {categoryLabels[category] || category}
                  </h2>
                </div>
                <div className="divide-y">
                  {categoryResults.map((result: BiomarkerResult) => (
                    <BiomarkerCard key={result.id} result={result} />
                  ))}
                </div>
              </div>
            );
          })}

          {/* Next Steps */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">
              🎯 Next Steps
            </h3>
            <ul className="space-y-2 text-blue-800">
              <li>
                • Review your biomarkers that are outside optimal ranges
              </li>
              <li>
                • Generate a personalized protocol to optimize your health (coming soon)
              </li>
              <li>
                • Track progress with follow-up labs in 30-90 days
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}

function BiomarkerCard({ result }: { result: BiomarkerResult }) {
  const { value, unit, biomarker, condition } = result;
  const { name, optimal_range_min, optimal_range_max, clinical_low, clinical_high } = biomarker;

  // Determine status
  const severity = condition?.severity || 'unknown';
  let statusColor = 'gray';
  let statusBg = 'bg-gray-50';
  let statusBorder = 'border-gray-200';
  let statusText = 'Unknown';
  let statusIcon = '?';

  if (value >= optimal_range_min && value <= optimal_range_max) {
    statusColor = 'green';
    statusBg = 'bg-green-50';
    statusBorder = 'border-green-200';
    statusText = 'Optimal';
    statusIcon = '✓';
  } else if (value >= clinical_low && value <= clinical_high) {
    statusColor = 'yellow';
    statusBg = 'bg-yellow-50';
    statusBorder = 'border-yellow-200';
    statusText = 'Suboptimal';
    statusIcon = '⚠';
  } else {
    statusColor = 'red';
    statusBg = 'bg-red-50';
    statusBorder = 'border-red-200';
    statusText = 'Concerning';
    statusIcon = '!';
  }

  const [expanded, setExpanded] = useState(false);

  return (
    <div className="p-6 hover:bg-gray-50 transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium border ${statusBg} ${statusBorder} text-${statusColor}-700`}
            >
              {statusIcon} {statusText}
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-3">{biomarker.short_description}</p>

          {/* Value Display */}
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-2xl font-bold text-gray-900">{value}</span>
            <span className="text-gray-600">{unit}</span>
          </div>

          {/* Range Visualization */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-gray-600">
              <span>Clinical: {clinical_low}</span>
              <span className="font-medium text-green-700">
                Optimal: {optimal_range_min}-{optimal_range_max}
              </span>
              <span>Clinical: {clinical_high}</span>
            </div>
            <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
              {/* Optimal range highlight */}
              <div
                className="absolute h-full bg-green-200"
                style={{
                  left: `${((optimal_range_min - clinical_low) / (clinical_high - clinical_low)) * 100}%`,
                  width: `${((optimal_range_max - optimal_range_min) / (clinical_high - clinical_low)) * 100}%`,
                }}
              />
              {/* Current value marker */}
              <div
                className={`absolute top-0 w-1 h-full bg-${statusColor}-600`}
                style={{
                  left: `${Math.max(0, Math.min(100, ((value - clinical_low) / (clinical_high - clinical_low)) * 100))}%`,
                }}
              />
            </div>
          </div>

          {/* Expandable Details */}
          {expanded && (
            <div className="mt-4 pt-4 border-t space-y-3">
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-1">
                  Why This Matters
                </h4>
                <p className="text-sm text-gray-600">{biomarker.why_it_matters}</p>
              </div>
              {condition?.clinical_significance && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">
                    Clinical Significance
                  </h4>
                  <p className="text-sm text-gray-600">{condition.clinical_significance}</p>
                </div>
              )}
            </div>
          )}

          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            {expanded ? '↑ Show Less' : '↓ Learn More'}
          </button>
        </div>
      </div>
    </div>
  );
}
