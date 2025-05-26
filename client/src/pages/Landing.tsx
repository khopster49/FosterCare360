import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Shield, Users, CheckCircle } from "lucide-react";
import swiisLogo from "@assets/Picture3.jpg";

export function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <img src={swiisLogo} alt="Swiis Foster Care" className="h-8 w-auto mr-2" />
              <h1 className="text-2xl font-bold text-orange-900">Swiis Foster Care</h1>
            </div>
            <Button 
              onClick={() => window.location.href = '/application'}
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              Apply Now
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
            onClick={() => window.location.href = '/application'}
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
              <h4 className="font-semibold mb-2 text-orange-900">Employment History</h4>
              <p className="text-sm text-gray-600">Provide details of your work experience and employment background</p>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 text-sm font-bold">
                4
              </div>
              <h4 className="font-semibold mb-2 text-orange-900">Skills & Experience</h4>
              <p className="text-sm text-gray-600">Share your relevant skills and explain why you're suited for the role</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <h3 className="text-2xl font-bold text-orange-900 mb-4">
            Ready to Join Our Team?
          </h3>
          <p className="text-lg text-gray-600 mb-6">
            Sign in to start your staff application today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              onClick={() => window.location.href = '/api/login'}
              size="lg"
              className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 text-lg"
            >
              Sign In to Continue
            </Button>
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-2">Don't have login credentials?</p>
              <Button 
                variant="outline"
                size="lg"
                className="border-orange-600 text-orange-600 hover:bg-orange-50 px-8 py-3 text-lg"
                onClick={() => window.location.href = 'mailto:hr@swiisfostercare.com?subject=Staff Application Access Request'}
              >
                Contact HR for Access
              </Button>
            </div>
          </div>
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