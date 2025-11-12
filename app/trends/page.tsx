'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth/auth-context';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';

type BiomarkerHistory = {
  biomarker_id: number;
  biomarker_name: string;
  standard_unit: string;
  optimal_range_min: number;
  optimal_range_max: number;
  results: Array<{
    value: number;
    lab_date: string;
    severity: string;
  }>;
};

export default function TrendsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [trends, setTrends] = useState<BiomarkerHistory[]>([]);
  const [selectedBiomarker, setSelectedBiomarker] = useState<BiomarkerHistory | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/trends');
      return;
    }

    if (user) {
      fetchTrends();
    }
  }, [user, authLoading]);

  async function fetchTrends() {
    try {
      const response = await fetch('/api/biomarkers/trends');
      if (!response.ok) throw new Error('Failed to fetch trends');

      const data = await response.json();
      setTrends(data.trends || []);

      // Auto-select first biomarker with multiple data points
      const biomarkerWithTrend = data.trends?.find((t: BiomarkerHistory) => t.results.length > 1);
      if (biomarkerWithTrend) {
        setSelectedBiomarker(biomarkerWithTrend);
      } else if (data.trends?.length > 0) {
        setSelectedBiomarker(data.trends[0]);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load trends');
    } finally {
      setLoading(false);
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  const chartData = selectedBiomarker?.results.map((result) => ({
    date: new Date(result.lab_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' }),
    value: result.value,
    status: result.severity,
  })).reverse(); // Reverse to show oldest → newest

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
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Biomarker Trends
            </h1>
            <p className="text-gray-600">
              Track changes in your biomarkers over time
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {trends.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <div className="text-6xl mb-4">📊</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                No Trend Data Yet
              </h2>
              <p className="text-gray-600 mb-6">
                Upload at least 2 lab results to start tracking trends
              </p>
              <Link
                href="/upload"
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Upload Lab Results
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-4 gap-6">
              {/* Biomarker Selector */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-sm p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Select Biomarker</h3>
                  <div className="space-y-2 max-h-[600px] overflow-y-auto">
                    {trends.map((biomarker) => (
                      <button
                        key={biomarker.biomarker_id}
                        onClick={() => setSelectedBiomarker(biomarker)}
                        className={`w-full text-left px-3 py-2 rounded transition-colors ${
                          selectedBiomarker?.biomarker_id === biomarker.biomarker_id
                            ? 'bg-blue-100 text-blue-900 font-medium'
                            : 'hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm">{biomarker.biomarker_name}</span>
                          <span className="text-xs text-gray-500">
                            {biomarker.results.length}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Chart Display */}
              <div className="lg:col-span-3">
                {selectedBiomarker ? (
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="mb-6">
                      <h2 className="text-2xl font-bold text-gray-900">
                        {selectedBiomarker.biomarker_name}
                      </h2>
                      <p className="text-sm text-gray-600">
                        Optimal Range: {selectedBiomarker.optimal_range_min} -{' '}
                        {selectedBiomarker.optimal_range_max} {selectedBiomarker.standard_unit}
                      </p>
                    </div>

                    {selectedBiomarker.results.length > 1 ? (
                      <div className="h-96">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                              dataKey="date"
                              tick={{ fontSize: 12 }}
                            />
                            <YAxis
                              domain={['dataMin - 5', 'dataMax + 5']}
                              tick={{ fontSize: 12 }}
                            />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: 'white',
                                border: '1px solid #ccc',
                                borderRadius: '8px',
                                padding: '10px'
                              }}
                            />
                            <Legend />

                            {/* Optimal range reference lines */}
                            <ReferenceLine
                              y={selectedBiomarker.optimal_range_min}
                              stroke="#22c55e"
                              strokeDasharray="3 3"
                              label={{ value: 'Optimal Min', position: 'right', fontSize: 10 }}
                            />
                            <ReferenceLine
                              y={selectedBiomarker.optimal_range_max}
                              stroke="#22c55e"
                              strokeDasharray="3 3"
                              label={{ value: 'Optimal Max', position: 'right', fontSize: 10 }}
                            />

                            <Line
                              type="monotone"
                              dataKey="value"
                              stroke="#3b82f6"
                              strokeWidth={3}
                              dot={{ fill: '#3b82f6', r: 5 }}
                              activeDot={{ r: 7 }}
                              name={selectedBiomarker.standard_unit}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    ) : (
                      <div className="h-96 flex items-center justify-center bg-gray-50 rounded-lg">
                        <div className="text-center">
                          <p className="text-gray-600 mb-2">
                            Only one data point available
                          </p>
                          <p className="text-sm text-gray-500">
                            Upload more lab results to see trends
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Data Table */}
                    <div className="mt-8">
                      <h3 className="font-semibold text-gray-900 mb-3">Historical Values</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="bg-gray-50 border-b">
                            <tr>
                              <th className="px-4 py-2 text-left">Date</th>
                              <th className="px-4 py-2 text-left">Value</th>
                              <th className="px-4 py-2 text-left">Status</th>
                              <th className="px-4 py-2 text-left">Change</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y">
                            {selectedBiomarker.results.map((result, index) => {
                              const previousValue = index < selectedBiomarker.results.length - 1
                                ? selectedBiomarker.results[index + 1].value
                                : null;
                              const change = previousValue ? result.value - previousValue : null;
                              const changePercent = previousValue ? ((change! / previousValue) * 100).toFixed(1) : null;

                              return (
                                <tr key={index}>
                                  <td className="px-4 py-3">
                                    {new Date(result.lab_date).toLocaleDateString()}
                                  </td>
                                  <td className="px-4 py-3 font-semibold">
                                    {result.value} {selectedBiomarker.standard_unit}
                                  </td>
                                  <td className="px-4 py-3">
                                    <span
                                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                                        result.severity === 'optimal'
                                          ? 'bg-green-100 text-green-700'
                                          : result.severity === 'suboptimal'
                                          ? 'bg-yellow-100 text-yellow-700'
                                          : 'bg-red-100 text-red-700'
                                      }`}
                                    >
                                      {result.severity}
                                    </span>
                                  </td>
                                  <td className="px-4 py-3">
                                    {change !== null ? (
                                      <span className={change > 0 ? 'text-red-600' : change < 0 ? 'text-green-600' : 'text-gray-600'}>
                                        {change > 0 ? '↑' : change < 0 ? '↓' : '→'} {Math.abs(change).toFixed(2)} ({changePercent}%)
                                      </span>
                                    ) : (
                                      <span className="text-gray-400">—</span>
                                    )}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                    <p className="text-gray-600">Select a biomarker to view trends</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
