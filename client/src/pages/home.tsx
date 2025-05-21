import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-blue-50 to-white py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                  Begin Your Fostering Journey Today
                </h1>
                <p className="text-lg text-gray-700">
                  Help change children's lives by becoming a foster carer.
                  Our comprehensive application process ensures the best
                  match for both carers and children.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/apply">
                    <Button size="lg" className="w-full sm:w-auto bg-orange-600 hover:bg-orange-700">
                      Start Application
                    </Button>
                  </Link>
                  <Link href="/auth/login">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto">
                      Continue Application
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Application Process</CardTitle>
                    <CardDescription>A simple guided approach</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-4">
                      <li className="flex gap-3">
                        <div className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center font-semibold flex-shrink-0">1</div>
                        <div>
                          <h3 className="font-medium">Register Account</h3>
                          <p className="text-sm text-gray-600">Create your account to start the application</p>
                        </div>
                      </li>
                      <li className="flex gap-3">
                        <div className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center font-semibold flex-shrink-0">2</div>
                        <div>
                          <h3 className="font-medium">Complete Application</h3>
                          <p className="text-sm text-gray-600">Fill out required information at your own pace</p>
                        </div>
                      </li>
                      <li className="flex gap-3">
                        <div className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center font-semibold flex-shrink-0">3</div>
                        <div>
                          <h3 className="font-medium">Submit & Review</h3>
                          <p className="text-sm text-gray-600">We'll review your application and contact you</p>
                        </div>
                      </li>
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <p className="text-sm text-gray-500">You can save your progress and return at any time</p>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16 px-4 bg-white">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl font-bold text-center mb-12">Why Become a Foster Carer?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Change Lives</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Make a real difference in children's lives by providing a safe, supportive home environment when they need it most.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Comprehensive Support</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Receive ongoing training, 24/7 support, regular visits from social workers, and peer support from other foster carers.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Financial Assistance</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Fostering allowances help cover the costs of caring for a child, ensuring you have the resources you need.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}