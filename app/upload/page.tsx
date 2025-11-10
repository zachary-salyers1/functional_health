'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth/auth-context';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type TabType = 'pdf' | 'manual';

export default function UploadPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('pdf');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!user) {
    router.push('/login?redirect=/upload');
    return null;
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
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Upload Lab Results
          </h1>
          <p className="text-gray-600 mb-8">
            Upload your lab results as a PDF or enter them manually
          </p>

          {/* Tabs */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="border-b">
              <nav className="flex">
                <button
                  onClick={() => setActiveTab('pdf')}
                  className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'pdf'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  📄 Upload PDF
                </button>
                <button
                  onClick={() => setActiveTab('manual')}
                  className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'manual'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  ✏️ Manual Entry
                </button>
              </nav>
            </div>

            <div className="p-6">
              {activeTab === 'pdf' ? <PDFUploadTab /> : <ManualEntryTab />}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function PDFUploadTab() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    setError('');

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      const validTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
      if (!validTypes.includes(droppedFile.type)) {
        setError('Please upload a PDF or image file (PNG, JPG)');
        return;
      }
      setFile(droppedFile);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const validTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
      if (!validTypes.includes(selectedFile.type)) {
        setError('Please upload a PDF or image file (PNG, JPG)');
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload-lab', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      // Redirect to results page
      window.location.href = `/results/${data.uploadId}`;
    } catch (err: any) {
      setError(err.message || 'Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
          dragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <input
          type="file"
          id="file-upload"
          accept="application/pdf,image/png,image/jpeg,image/jpg"
          onChange={handleFileChange}
          className="hidden"
        />

        {file ? (
          <div className="space-y-4">
            <div className="text-5xl">📄</div>
            <div>
              <p className="text-lg font-medium text-gray-900">{file.name}</p>
              <p className="text-sm text-gray-500">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setFile(null)}
                className="px-4 py-2 text-gray-700 hover:text-gray-900"
              >
                Remove
              </button>
              <button
                onClick={handleUpload}
                disabled={uploading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {uploading ? 'Uploading...' : 'Upload & Process'}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-5xl">☁️</div>
            <div>
              <p className="text-lg font-medium text-gray-900 mb-1">
                Drop your PDF here, or{' '}
                <label
                  htmlFor="file-upload"
                  className="text-blue-600 hover:text-blue-700 cursor-pointer"
                >
                  browse
                </label>
              </p>
              <p className="text-sm text-gray-500">
                Supported formats: PDF, PNG, JPG (max 10MB)
              </p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-blue-900 mb-2">
          📋 Tips for best results:
        </h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Upload clear, high-quality scans</li>
          <li>• Ensure all text is readable</li>
          <li>• Include biomarker names and values</li>
          <li>• We support most common lab formats</li>
        </ul>
      </div>
    </div>
  );
}

function ManualEntryTab() {
  const [loading, setLoading] = useState(true);
  const [biomarkers, setBiomarkers] = useState<any[]>([]);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [testDate, setTestDate] = useState('');
  const [labName, setLabName] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Fetch biomarkers on mount
  useEffect(() => {
    async function fetchBiomarkers() {
      try {
        const response = await fetch('/api/biomarkers');
        if (!response.ok) throw new Error('Failed to fetch biomarkers');
        const data = await response.json();
        setBiomarkers(data.biomarkers);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchBiomarkers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    // Validate at least one biomarker is filled
    const hasData = Object.values(formData).some((value) => value.trim() !== '');
    if (!hasData) {
      setError('Please enter at least one biomarker value');
      setSaving(false);
      return;
    }

    if (!testDate) {
      setError('Please enter the test date');
      setSaving(false);
      return;
    }

    try {
      const response = await fetch('/api/save-biomarkers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          testDate,
          labName: labName || 'Manual Entry',
          biomarkers: formData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save biomarkers');
      }

      // Redirect to results
      window.location.href = `/results/${data.uploadId}`;
    } catch (err: any) {
      setError(err.message || 'Failed to save biomarkers');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-600">Loading biomarkers...</div>
      </div>
    );
  }

  // Group biomarkers by category
  const categories = biomarkers.reduce((acc: any, biomarker: any) => {
    if (!acc[biomarker.category]) {
      acc[biomarker.category] = [];
    }
    acc[biomarker.category].push(biomarker);
    return acc;
  }, {});

  const categoryOrder = ['metabolic', 'lipids', 'thyroid', 'vitamins', 'minerals', 'inflammation'];
  const categoryLabels: Record<string, string> = {
    metabolic: '🔥 Metabolic Health',
    lipids: '❤️ Lipid Panel',
    thyroid: '🦋 Thyroid Function',
    vitamins: '💊 Vitamins',
    minerals: '⚡ Minerals',
    inflammation: '🔬 Inflammation',
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Test Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Test Information</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Test Date *
            </label>
            <input
              type="date"
              value={testDate}
              onChange={(e) => setTestDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lab Name (Optional)
            </label>
            <input
              type="text"
              value={labName}
              onChange={(e) => setLabName(e.target.value)}
              placeholder="e.g., Quest Diagnostics"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Biomarker Entry by Category */}
      {categoryOrder.map((category) => {
        const categoryBiomarkers = categories[category] || [];
        if (categoryBiomarkers.length === 0) return null;

        return (
          <div key={category} className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
              {categoryLabels[category] || category}
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {categoryBiomarkers.map((biomarker: any) => (
                <div key={biomarker.id} className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    {biomarker.name}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      step="0.01"
                      value={formData[biomarker.id] || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, [biomarker.id]: e.target.value })
                      }
                      placeholder={`Enter value`}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <span className="flex items-center text-sm text-gray-500 min-w-[80px]">
                      {biomarker.standard_unit}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Optimal: {biomarker.optimal_range_min}-{biomarker.optimal_range_max}
                  </p>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Submit Button */}
      <div className="flex justify-end gap-4 pt-6 border-t">
        <button
          type="button"
          onClick={() => window.location.href = '/dashboard'}
          className="px-6 py-2 text-gray-700 hover:text-gray-900"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {saving ? 'Saving...' : 'Save & Analyze'}
        </button>
      </div>
    </form>
  );
}
