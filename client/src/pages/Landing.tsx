import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Shield, Users, CheckCircle, LogOut } from "lucide-react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import swiisLogo from "@assets/Picture3.jpg";

export function Landing() {
  const [, setLocation] = useLocation();
  const { user, logout } = useAuth();
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
            <div className="flex items-center gap-4">
              {user && (
                <span className="text-sm text-gray-600">
                  Welcome, {user.firstName} {user.lastName}
                </span>
              )}
              <Button 
                onClick={() => setLocation('/application')}
                className="bg-orange-600 hover:bg-orange-700 text-white"
              >
                Apply Now
              </Button>
              {user && (
                <Button 
                  onClick={logout}
                  variant="outline"
                  className="border-orange-600 text-orange-600 hover:bg-orange-50"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              )}
            </div>
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
            onClick={() => setLocation('/application')}
            size="lg"
            className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 text-lg"
          >
            Begin Application
          </Button>
        </div>





        {/* Call to Action */}
        <div className="text-center mt-16">
          <h3 className="text-2xl font-bold text-orange-900 mb-4">
            Ready to Join Our Team?
          </h3>
          <p className="text-lg text-gray-600 mb-6">
            Sign in to start your staff application today
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <div className="text-center">
              <h4 className="text-lg font-semibold text-orange-900 mb-3">Already have an account?</h4>
              <Button 
                onClick={() => setLocation('/application')}
                size="lg"
                className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 text-lg"
              >
                Sign In to Continue
              </Button>
            </div>
            <div className="text-center">
              <h4 className="text-lg font-semibold text-orange-900 mb-3">New to our platform?</h4>
              <Button 
                onClick={() => setLocation('/application')}
                size="lg"
                variant="outline"
                className="border-orange-600 text-orange-600 hover:bg-orange-50 px-8 py-3 text-lg"
              >
                Sign Up to Apply
              </Button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center">
              <img src={swiisLogo} alt="Swiis Logo" className="h-6 mr-2" />
              <span className="font-semibold text-orange-600">Swiis Foster Care</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}