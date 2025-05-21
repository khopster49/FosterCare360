import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, Link } from "wouter";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Progress } from "@/components/ui/progress";
import { Applicant } from "@shared/schema";

export default function DashboardPage() {
  const [, setLocation] = useLocation();
  const [applications, setApplications] = useState<Applicant[]>([]);
  
  // Get current user info
  const { data: user, isLoading: isUserLoading, isError: isUserError } = useQuery({
    queryKey: ['/api/auth/me'],
    retry: false,
  });
  
  // Get user's applications
  const { data: applicationsData, isLoading: isAppsLoading, isError: isAppsError } = useQuery({
    queryKey: ['/api/applications/user'],
    enabled: !!user,
    retry: false,
  });
  
  useEffect(() => {
    // If user is not logged in, redirect to login page
    if (!isUserLoading && isUserError) {
      setLocation('/auth/login');
      toast({
        title: "Authentication Required",
        description: "Please log in to access your dashboard.",
        variant: "destructive",
      });
    }
    
    // Set applications data when available
    if (applicationsData) {
      setApplications(applicationsData);
    }
  }, [isUserLoading, isUserError, applicationsData, setLocation]);
  
  // Function to calculate application progress
  const calculateProgress = (app: Applicant) => {
    const totalSteps = 10; // Total steps in the application process
    const completedStep = app.lastCompletedStep || 0;
    return (completedStep / totalSteps) * 100;
  };
  
  // Function to format application status as a readable string
  const formatStatus = (status: string) => {
    switch (status) {
      case 'in-progress':
        return 'In Progress';
      case 'submitted':
        return 'Submitted';
      case 'under-review':
        return 'Under Review';
      case 'approved':
        return 'Approved';
      case 'rejected':
        return 'Rejected';
      default:
        return 'Draft';
    }
  };
  
  // Function to get the resume URL for an application
  const getResumeUrl = (app: Applicant) => {
    return `/application/${app.id}?step=${app.lastCompletedStep || 0}`;
  };
  
  // Handle starting a new application
  const handleStartNew = () => {
    setLocation('/application/new');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary">Your Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Manage your fostering applications and track your progress
          </p>
        </div>
        
        {isUserLoading || isAppsLoading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-lg text-gray-500">Loading your information...</p>
          </div>
        ) : isAppsError ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <p className="text-lg text-red-500 mb-4">
                We encountered an error loading your applications.
              </p>
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Your Applications</h2>
              <Button onClick={handleStartNew}>
                Start New Application
              </Button>
            </div>
            
            {applications.length === 0 ? (
              <Card className="bg-gray-50 border-dashed">
                <CardContent className="flex flex-col items-center justify-center h-64">
                  <h3 className="text-xl font-medium text-gray-700 mb-4">No Applications Found</h3>
                  <p className="text-gray-500 text-center mb-6 max-w-md">
                    You haven't started any fostering applications yet. Begin your journey to becoming a foster carer today.
                  </p>
                  <Button onClick={handleStartNew}>
                    Begin Application Process
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {applications.map((app) => (
                  <Card key={app.id} className="flex flex-col h-full">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>Application #{app.id}</CardTitle>
                          <CardDescription>{new Date(app.saveDate || '').toLocaleDateString()}</CardDescription>
                        </div>
                        <div className="px-3 py-1 rounded-full text-sm font-medium" 
                          style={{ 
                            backgroundColor: app.status === 'submitted' ? '#EBF7ED' : '#F3F4F6',
                            color: app.status === 'submitted' ? '#18983D' : '#4B5563'
                          }}
                        >
                          {formatStatus(app.status)}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progress</span>
                          <span>{Math.round(calculateProgress(app))}%</span>
                        </div>
                        <Progress value={calculateProgress(app)} className="h-2" />
                      </div>
                      {app.status === 'in-progress' && (
                        <p className="text-sm text-gray-500">
                          {app.lastCompletedStep === 0 
                            ? "You've just started your application."
                            : `You've completed ${app.lastCompletedStep} of 10 steps.`
                          }
                        </p>
                      )}
                      {app.status === 'submitted' && (
                        <p className="text-sm text-gray-500">
                          Application submitted on {new Date(app.completedAt || '').toLocaleDateString()}.
                        </p>
                      )}
                    </CardContent>
                    <CardFooter className="border-t pt-4">
                      {app.status === 'in-progress' ? (
                        <Button variant="default" className="w-full" asChild>
                          <Link href={getResumeUrl(app)}>Continue Application</Link>
                        </Button>
                      ) : (
                        <Button variant="outline" className="w-full" asChild>
                          <Link href={`/application/${app.id}/view`}>View Application</Link>
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
            
            <div className="mt-12">
              <h2 className="text-xl font-semibold mb-4">Helpful Resources</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Fostering FAQ</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">
                      Find answers to common questions about the fostering process, requirements, and what to expect.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">View FAQ</Button>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Contact Support</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">
                      Need help with your application? Our support team is available to assist you.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">Contact Us</Button>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Fostering Guide</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">
                      Learn about the fostering process, training, and the positive impact you can make.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">Download Guide</Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </>
        )}
      </main>
      
      <Footer />
    </div>
  );
}