import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-blue-600">Functional Health</h1>
          <nav className="flex gap-4">
            <Link href="/login" className="text-gray-600 hover:text-gray-900">
              Login
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Transform Your Lab Results Into
            <span className="text-blue-600"> Actionable Health Protocols</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Upload your blood work and receive personalized, research-backed optimization
            protocols. Every recommendation is supported by peer-reviewed studies.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/signup"
              className="px-8 py-4 bg-blue-600 text-white text-lg rounded-lg hover:bg-blue-700 font-semibold"
            >
              Upload Your Labs
            </Link>
            <Link
              href="/pricing"
              className="px-8 py-4 bg-white text-blue-600 text-lg rounded-lg border-2 border-blue-600 hover:bg-blue-50 font-semibold"
            >
              View Pricing
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="mt-24 grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-white p-8 rounded-xl shadow-sm">
            <div className="text-4xl mb-4">🔬</div>
            <h3 className="text-xl font-bold mb-2">Functional Ranges</h3>
            <p className="text-gray-600">
              Go beyond clinical ranges. We use optimal, functional ranges for true health
              optimization.
            </p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-sm">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-bold mb-2">Research-Backed</h3>
            <p className="text-gray-600">
              Every recommendation includes peer-reviewed research from PubMed with specific
              citations.
            </p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-sm">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-bold mb-2">Specific Protocols</h3>
            <p className="text-gray-600">
              Get exact dosages, timing, brands, and expected outcomes for each
              intervention.
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="mt-24 max-w-4xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12">How It Works</h3>
          <div className="space-y-8">
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h4 className="text-xl font-bold mb-2">Upload Your Labs</h4>
                <p className="text-gray-600">
                  Upload PDF lab results from any lab (Quest, LabCorp, Function Health, etc.) or
                  enter values manually.
                </p>
              </div>
            </div>
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h4 className="text-xl font-bold mb-2">AI Analysis</h4>
                <p className="text-gray-600">
                  Our system analyzes your biomarkers against functional optimal ranges and
                  identifies areas for improvement.
                </p>
              </div>
            </div>
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h4 className="text-xl font-bold mb-2">Get Your Protocol</h4>
                <p className="text-gray-600">
                  Receive a comprehensive 30-90 day protocol with specific interventions,
                  dosages, and research citations.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-24 text-center">
          <Link
            href="/signup"
            className="inline-block px-8 py-4 bg-blue-600 text-white text-lg rounded-lg hover:bg-blue-700 font-semibold"
          >
            Start Optimizing Your Health Today
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-24 border-t bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2025 Functional Health Lab Analysis. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
