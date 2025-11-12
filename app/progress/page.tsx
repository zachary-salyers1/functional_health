'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth/auth-context';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type LabUpload = {
  id: string;
  lab_date: string;
  lab_source: string;
  created_at: string;
  status: string;
};

export default function ProgressPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [uploads, setUploads] = useState<LabUpload[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/progress');
      return;
    }

    if (user) {
      fetchUploads();
    }
  }, [user, authLoading]);

  async function fetchUploads() {
    try {
      const response = await fetch('/api/lab-uploads');
      if (!response.ok) throw new Error('Failed to fetch lab uploads');

      const data = await response.json();
      setUploads(data.uploads || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load progress data');
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
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Track Your Progress
            </h1>
            <p className="text-gray-600">
              Monitor your biomarker improvements over time
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {uploads.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <div className="text-6xl mb-4">📈</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                No Progress Data Yet
              </h2>
              <p className="text-gray-600 mb-6">
                Upload multiple lab results over time to track your progress
              </p>
              <Link
                href="/upload"
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Upload Lab Results
              </Link>
            </div>
          ) : (
            <div>
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Your Lab History
                </h2>
                <div className="space-y-3">
                  {uploads.map((upload) => (
                    <Link
                      key={upload.id}
                      href={`/results/${upload.id}`}
                      className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-gray-900">
                            {upload.lab_source || 'Lab Results'}
                          </div>
                          <div className="text-sm text-gray-600">
                            Lab Date: {new Date(upload.lab_date).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="text-right">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              upload.status === 'completed'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-yellow-100 text-yellow-700'
                            }`}
                          >
                            {upload.status}
                          </span>
                          <div className="text-xs text-gray-500 mt-1">
                            Uploaded {new Date(upload.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">
                  📊 Progress Tracking Coming Soon
                </h3>
                <p className="text-blue-800">
                  We're building advanced progress tracking features including biomarker
                  trend charts, improvement percentages, and comparison views between lab
                  results. Stay tuned!
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
