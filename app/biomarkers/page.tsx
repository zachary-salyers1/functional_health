'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Biomarker {
  id: string;
  name: string;
  standard_unit: string;
  category: string;
  description: string | null;
  short_description: string | null;
  optimal_range_min: number;
  optimal_range_max: number;
  clinical_low: number;
  clinical_high: number;
  latest_value?: number | null;
  latest_date?: string | null;
  latest_status?: string | null;
}

export default function BiomarkersPage() {
  const router = useRouter();
  const [biomarkers, setBiomarkers] = useState<Biomarker[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    unit: '',
    category: 'Metabolic',
    description: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingRanges, setEditingRanges] = useState<string | null>(null);
  const [rangeValues, setRangeValues] = useState({ min: 0, max: 0 });

  useEffect(() => {
    fetchBiomarkers();
  }, []);

  async function fetchBiomarkers() {
    try {
      const response = await fetch('/api/biomarkers');
      if (!response.ok) throw new Error('Failed to fetch biomarkers');
      const data = await response.json();
      setBiomarkers(data.biomarkers || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/biomarkers/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create biomarker');
      }

      setSuccess('Biomarker added successfully!');
      setFormData({ name: '', unit: '', category: 'Metabolic', description: '' });
      setShowAddForm(false);
      fetchBiomarkers();
    } catch (err: any) {
      setError(err.message);
    }
  }

  function startEditingRange(biomarker: Biomarker) {
    setEditingRanges(biomarker.id);
    setRangeValues({
      min: biomarker.optimal_range_min,
      max: biomarker.optimal_range_max,
    });
  }

  async function saveRanges(biomarkerId: string) {
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`/api/biomarkers/${biomarkerId}/ranges`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          optimal_range_min: rangeValues.min,
          optimal_range_max: rangeValues.max,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update ranges');
      }

      setSuccess('Optimal ranges updated successfully!');
      setEditingRanges(null);
      fetchBiomarkers();
    } catch (err: any) {
      setError(err.message);
    }
  }

  function cancelEditing() {
    setEditingRanges(null);
    setRangeValues({ min: 0, max: 0 });
  }

  const categories = [
    'Metabolic',
    'Cardiovascular',
    'Thyroid',
    'Vitamins & Minerals',
    'Inflammatory',
    'Hormonal',
    'Other',
  ];

  const groupedBiomarkers = biomarkers.reduce((acc, biomarker) => {
    if (!acc[biomarker.category]) {
      acc[biomarker.category] = [];
    }
    acc[biomarker.category].push(biomarker);
    return acc;
  }, {} as Record<string, Biomarker[]>);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading biomarkers...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Biomarkers</h1>
            <p className="text-gray-600 mt-2">Manage tracked biomarkers</p>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {showAddForm ? 'Cancel' : 'Add Biomarker'}
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
            {success}
          </div>
        )}

        {showAddForm && (
          <div className="mb-8 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Add New Biomarker</h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Biomarker Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Sodium"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Unit *
                  </label>
                  <input
                    type="text"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., mmol/L"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Optional description"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Biomarker
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="space-y-6">
          {Object.entries(groupedBiomarkers).map(([category, items]) => (
            <div key={category} className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">{category}</h2>
              <div className="space-y-3">
                {items.map((biomarker) => (
                  <div
                    key={biomarker.id}
                    className="p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{biomarker.name}</h3>
                        {biomarker.description && (
                          <p className="text-sm text-gray-600 mt-1">{biomarker.description}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600 font-mono mb-1">{biomarker.standard_unit}</div>
                        {biomarker.latest_value !== null && biomarker.latest_value !== undefined ? (
                          <div className="text-lg font-semibold">
                            <span
                              className={
                                biomarker.latest_status === 'optimal'
                                  ? 'text-green-600'
                                  : biomarker.latest_status === 'suboptimal'
                                  ? 'text-yellow-600'
                                  : 'text-red-600'
                              }
                            >
                              {biomarker.latest_value}
                            </span>
                            {biomarker.latest_date && (
                              <div className="text-xs text-gray-500 mt-1">
                                {new Date(biomarker.latest_date).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="text-sm text-gray-400 italic">N/A</div>
                        )}
                      </div>
                    </div>

                    {editingRanges === biomarker.id ? (
                      <div className="border-t border-gray-200 pt-3">
                        <div className="grid grid-cols-2 gap-4 mb-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Optimal Min
                            </label>
                            <input
                              type="number"
                              step="0.01"
                              value={rangeValues.min}
                              onChange={(e) =>
                                setRangeValues({ ...rangeValues, min: parseFloat(e.target.value) })
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Optimal Max
                            </label>
                            <input
                              type="number"
                              step="0.01"
                              value={rangeValues.max}
                              onChange={(e) =>
                                setRangeValues({ ...rangeValues, max: parseFloat(e.target.value) })
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => saveRanges(biomarker.id)}
                            className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                          >
                            Save
                          </button>
                          <button
                            onClick={cancelEditing}
                            className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="border-t border-gray-200 pt-3">
                        <div className="flex items-center justify-between">
                          <div className="text-sm">
                            <span className="text-gray-600">Optimal Range: </span>
                            <span className="font-semibold text-green-700">
                              {biomarker.optimal_range_min} - {biomarker.optimal_range_max}{' '}
                              {biomarker.standard_unit}
                            </span>
                          </div>
                          <button
                            onClick={() => startEditingRange(biomarker)}
                            className="px-3 py-1 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded"
                          >
                            Edit
                          </button>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Clinical Range: {biomarker.clinical_low} - {biomarker.clinical_high}{' '}
                          {biomarker.standard_unit}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {biomarkers.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <p className="text-gray-600">No biomarkers found. Add your first biomarker!</p>
          </div>
        )}
      </div>
    </div>
  );
}
