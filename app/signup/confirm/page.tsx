import Link from 'next/link';

export default function ConfirmPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-6xl mb-4">📧</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Check your email</h1>
          <p className="text-gray-600 mb-6">
            We've sent you a confirmation email. Please check your inbox and click the link to
            verify your account.
          </p>
          <div className="space-y-3">
            <Link
              href="/login"
              className="block w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Go to Login
            </Link>
            <Link href="/" className="block text-blue-600 hover:text-blue-700">
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
