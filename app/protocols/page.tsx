'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth/auth-context';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type Protocol = {
  id: string;
  protocol_name: string;
  priority_focus: string;
  status: string;
  total_interventions: number;
  estimated_duration_days: number;
  retest_recommended_date: string;
  created_at: string;
};

export default function ProtocolsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [protocols, setProtocols] = useState<Protocol[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/protocols');
      return;
    }

    if (user) {
      fetchProtocols();
    }
  }, [user, authLoading]);

  async function fetchProtocols() {
    try {
      const response = await fetch('/api/protocols');
      if (!response.ok) throw new Error('Failed to fetch protocols');

      const data = await response.json();
      setProtocols(data.protocols || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load protocols');
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
              Your Health Protocols
            </h1>
            <p className="text-gray-600">
              View and manage your personalized health optimization plans
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {protocols.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <div className="text-6xl mb-4">📊</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                No Protocols Yet
              </h2>
              <p className="text-gray-600 mb-6">
                Upload lab results and generate a protocol to get started
              </p>
              <Link
                href="/upload"
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Upload Lab Results
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {protocols.map((protocol) => (
                <Link
                  key={protocol.id}
                  href={`/protocol/${protocol.id}`}
                  className="block bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">
                          {protocol.protocol_name}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            protocol.status === 'active'
                              ? 'bg-green-100 text-green-700'
                              : protocol.status === 'completed'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {protocol.status}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-3">
                        🎯 {protocol.priority_focus}
                      </p>
                      <div className="flex items-center gap-6 text-sm text-gray-500">
                        <span>📋 {protocol.total_interventions} interventions</span>
                        <span>⏱️ {protocol.estimated_duration_days} days</span>
                        <span>
                          🔬 Retest: {new Date(protocol.retest_recommended_date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      Created {new Date(protocol.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
