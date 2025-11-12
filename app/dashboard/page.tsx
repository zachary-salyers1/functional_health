'use client';

import { useAuth } from '@/lib/auth/auth-context';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  if (loading) {
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
          <nav className="flex items-center gap-4">
            <span className="text-gray-600">{user?.email}</span>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 text-gray-700 hover:text-gray-900"
            >
              Sign Out
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to Your Health Dashboard
          </h1>
          <p className="text-gray-600 mb-8">
            Start by uploading your lab results to get personalized health protocols
          </p>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Link
              href="/upload"
              className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <div className="text-4xl mb-3">🔬</div>
              <h3 className="text-xl font-semibold mb-2">Upload Labs</h3>
              <p className="text-gray-600">
                Upload your blood work to get personalized protocols
              </p>
            </Link>

            <Link
              href="/biomarkers"
              className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <div className="text-4xl mb-3">🧬</div>
              <h3 className="text-xl font-semibold mb-2">Biomarkers</h3>
              <p className="text-gray-600">
                View and manage tracked biomarkers
              </p>
            </Link>

            <Link
              href="/protocols"
              className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <div className="text-4xl mb-3">📊</div>
              <h3 className="text-xl font-semibold mb-2">View Protocols</h3>
              <p className="text-gray-600">
                Access your personalized health optimization plans
              </p>
            </Link>

            <Link
              href="/trends"
              className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <div className="text-4xl mb-3">📈</div>
              <h3 className="text-xl font-semibold mb-2">Biomarker Trends</h3>
              <p className="text-gray-600">Monitor your biomarker improvements over time</p>
            </Link>
          </div>

          {/* Empty State */}
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="text-6xl mb-4">🎯</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Lab Results Yet</h2>
            <p className="text-gray-600 mb-6">
              Upload your first lab results to start your health optimization journey
            </p>
            <Link
              href="/upload"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Upload Your First Lab
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
