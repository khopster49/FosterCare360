export default function TestApp() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-orange-900 mb-6">
          Application Form - Test Page
        </h1>
        <p className="text-lg text-gray-700">
          This is a test page to verify the routing is working correctly.
        </p>
        <div className="mt-8 p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-orange-800 mb-4">
            Authentication Status
          </h2>
          <p className="text-gray-600">
            If you can see this page, the routing is working and authentication is successful.
          </p>
        </div>
      </div>
    </div>
  );
}