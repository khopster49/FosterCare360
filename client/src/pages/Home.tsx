import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, FileText, User, LogOut } from "lucide-react";
import { Link } from "wouter";

export function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Heart className="h-8 w-8 text-orange-600 mr-2" />
              <h1 className="text-2xl font-bold text-orange-900">Staff Application Portal</h1>
            </div>
            <div className="flex items-center space-x-4">
              {user && (
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-gray-600" />
                  <span className="text-gray-700">
                    {user.firstName} {user.lastName}
                  </span>
                </div>
              )}
              <Button 
                onClick={() => window.location.href = '/api/logout'}
                variant="outline"
                size="sm"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-orange-900 mb-2">
            Welcome back, {user?.firstName}!
          </h2>
          <p className="text-lg text-gray-600">
            Continue your staff application or start a new one.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Start New Application</CardTitle>
                  <CardDescription>Begin your foster care application</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Link href="/application">
                <Button className="w-full bg-orange-600 hover:bg-orange-700">
                  Start Application
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                  <FileText className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Application Status</CardTitle>
                  <CardDescription>Check your application progress</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                View Status
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                  <Heart className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Resources</CardTitle>
                  <CardDescription>Access helpful guides and support</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                View Resources
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Information Section */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            Your Fostering Journey
          </h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold text-lg mb-3">What to Expect</h4>
              <ul className="space-y-2 text-gray-600">
                <li>• Comprehensive application process</li>
                <li>• Background checks and references</li>
                <li>• Training and assessment sessions</li>
                <li>• Ongoing support and guidance</li>
                <li>• Matching with children in need</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-3">Next Steps</h4>
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-white text-xs font-bold">1</span>
                  </div>
                  <div>
                    <p className="font-medium">Complete Your Application</p>
                    <p className="text-sm text-gray-600">Fill out all required sections</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-white text-xs font-bold">2</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-500">Submit for Review</p>
                    <p className="text-sm text-gray-500">Our team will review your application</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-white text-xs font-bold">3</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-500">Begin Assessment</p>
                    <p className="text-sm text-gray-500">Start the formal assessment process</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}