'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth/auth-context';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const DIETARY_OPTIONS = [
  { id: 'vegetarian', label: 'Vegetarian', description: 'No meat or fish' },
  { id: 'vegan', label: 'Vegan', description: 'No animal products' },
  { id: 'pescatarian', label: 'Pescatarian', description: 'Fish but no meat' },
  { id: 'gluten-free', label: 'Gluten-Free', description: 'Avoid gluten-containing grains' },
  { id: 'dairy-free', label: 'Dairy-Free', description: 'No dairy products' },
  { id: 'keto', label: 'Keto', description: 'Very low carb, high fat' },
  { id: 'paleo', label: 'Paleo', description: 'Whole foods, no grains/legumes' },
  { id: 'low-carb', label: 'Low-Carb', description: 'Reduced carbohydrate intake' },
  { id: 'nut-allergy', label: 'Nut Allergy', description: 'Allergic to tree nuts' },
  { id: 'shellfish-allergy', label: 'Shellfish Allergy', description: 'Allergic to shellfish' },
  { id: 'soy-free', label: 'Soy-Free', description: 'No soy products' },
  { id: 'egg-free', label: 'Egg-Free', description: 'No eggs' },
];

export default function SettingsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedRestrictions, setSelectedRestrictions] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/settings');
      return;
    }

    if (user) {
      fetchPreferences();
    }
  }, [user, authLoading]);

  async function fetchPreferences() {
    try {
      const response = await fetch('/api/user/preferences');
      if (!response.ok) throw new Error('Failed to fetch preferences');

      const data = await response.json();
      setSelectedRestrictions(data.preferences?.dietary_restrictions || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const toggleRestriction = (id: string) => {
    setSelectedRestrictions(prev =>
      prev.includes(id)
        ? prev.filter(r => r !== id)
        : [...prev, id]
    );
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/user/preferences', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dietary_restrictions: selectedRestrictions
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save preferences');
      }

      setSuccess('Preferences saved successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

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
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Settings
          </h1>
          <p className="text-gray-600 mb-8">
            Manage your preferences and dietary restrictions
          </p>

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

          {/* Dietary Restrictions Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Dietary Restrictions & Preferences
            </h2>
            <p className="text-gray-600 text-sm mb-6">
              Select all that apply. This will help us tailor your protocol recommendations.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {DIETARY_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  onClick={() => toggleRestriction(option.id)}
                  className={`text-left p-4 rounded-lg border-2 transition-all ${
                    selectedRestrictions.includes(option.id)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{option.label}</h3>
                      <p className="text-sm text-gray-600 mt-1">{option.description}</p>
                    </div>
                    <div className="ml-3">
                      {selectedRestrictions.includes(option.id) ? (
                        <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      ) : (
                        <div className="w-6 h-6 border-2 border-gray-300 rounded"></div>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {selectedRestrictions.length > 0 && (
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Selected Restrictions:</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedRestrictions.map((id) => {
                    const option = DIETARY_OPTIONS.find(o => o.id === id);
                    return (
                      <span
                        key={id}
                        className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm font-medium"
                      >
                        {option?.label}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Account Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Account Information
            </h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <div className="mt-1 text-gray-900">{user?.email}</div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end gap-4 mt-6">
            <Link
              href="/dashboard"
              className="px-6 py-2 text-gray-700 hover:text-gray-900"
            >
              Cancel
            </Link>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
