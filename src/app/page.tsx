export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Flex Living Reviews Dashboard
        </h1>
        <p className="text-gray-600 mb-4">
          Welcome to the Flex Living Reviews Dashboard. This system helps you manage and display guest reviews from various sources.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Manager Dashboard</h2>
            <p className="text-gray-600 mb-4">Review and manage guest feedback from all properties.</p>
            <a href="/dashboard" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 inline-block">
              Access Dashboard
            </a>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Property Reviews</h2>
            <p className="text-gray-600 mb-4">View public guest reviews for each property.</p>
            <a href="/properties" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 inline-block">
              View Properties
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
