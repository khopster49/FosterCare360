import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

export default function SimpleApplicationForm() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-orange-900 mb-6">
            Staff Application Form
          </h1>
          
          <div className="mb-8">
            <p className="text-lg text-gray-700 mb-4">
              Welcome to the Swiis Foster Care staff application process. This multi-step form will collect all necessary information for your application.
            </p>
            
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-orange-800 mb-2">
                Application Steps Include:
              </h2>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Personal Information</li>
                <li>Education History</li>
                <li>Employment History</li>
                <li>Skills & Experience</li>
                <li>References</li>
                <li>Declarations</li>
              </ul>
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              The full application form is being prepared and will be available soon.
            </p>
            <p className="text-sm text-gray-500">
              Please check back later or contact our team for more information.
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}