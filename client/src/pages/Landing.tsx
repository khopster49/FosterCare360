import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Shield, Users, CheckCircle } from "lucide-react";
import swiisLogo from "@/assets/swiis-logo.svg";

export function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <img src={swiisLogo} alt="Swiis Logo" className="h-8 mr-2" />
              <h1 className="text-2xl font-bold text-orange-900">Swiis Foster Care</h1>
            </div>
            <Button 
              onClick={() => window.location.href = '/api/login'}
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              Sign In
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-orange-900 mb-4">
            Start Your Application Process
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Join our team and make a meaningful difference in your career. 
            Our streamlined application process makes it easy to apply for staff positions.
          </p>
          <Button 
            onClick={() => window.location.href = '/api/login'}
            size="lg"
            className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 text-lg"
          >
            Begin Application
          </Button>
        </div>



        {/* Process Steps */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h3 className="text-2xl font-bold text-orange-900 mb-6 text-center">
            Your Application Journey
          </h3>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 text-sm font-bold">
                1
              </div>
              <h4 className="font-semibold mb-2 text-orange-900">Personal Information</h4>
              <p className="text-sm text-gray-600">Share your basic details and contact information</p>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 text-sm font-bold">
                2
              </div>
              <h4 className="font-semibold mb-2 text-orange-900">Background Checks</h4>
              <p className="text-sm text-gray-600">Complete DBS checks and reference verifications</p>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 text-sm font-bold">
                3
              </div>
              <h4 className="font-semibold mb-2 text-orange-900">Assessment Process</h4>
              <p className="text-sm text-gray-600">Work with our team through the assessment stages</p>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 text-sm font-bold">
                4
              </div>
              <h4 className="font-semibold mb-2 text-orange-900">Approval & Matching</h4>
              <p className="text-sm text-gray-600">Get approved and matched with children who need care</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <h3 className="text-2xl font-bold text-orange-900 mb-4">
            Ready to Make a Difference?
          </h3>
          <p className="text-lg text-gray-600 mb-6">
            Sign in to start your fostering application today
          </p>
          <Button 
            onClick={() => window.location.href = '/api/login'}
            size="lg"
            className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 text-lg"
          >
            Sign In to Continue
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <img src={swiisLogo} alt="Swiis Logo" className="h-6 mr-2" />
              <span className="font-semibold">Swiis Foster Care</span>
            </div>
            <p className="text-gray-400">
              Building careers and connecting talent with opportunity
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}