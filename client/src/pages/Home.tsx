import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, FileText, User, LogOut } from "lucide-react";
import { Link } from "wouter";
import swiisLogo from "@assets/Picture3.jpg";

export function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <img src={swiisLogo} alt="Swiis" className="h-8 w-auto mr-2" />
              <h1 className="text-2xl font-bold text-orange-900">Swiis</h1>
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
                  <CardDescription>Begin your staff application</CardDescription>
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


      </main>
    </div>
  );
}