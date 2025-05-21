import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { toast } from "@/hooks/use-toast";

interface Application {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  status: string;
  lastCompletedStep: number;
  saveDate: string;
  createdAt: string;
}

export default function DashboardPage() {
  const [, setLocation] = useLocation();
  const [showWelcome, setShowWelcome] = useState(false);
  
  // Check if user just logged in
  const params = new URLSearchParams(window.location.search);
  useEffect(() => {
    if (params.get("welcome") === "true" && !showWelcome) {
      setShowWelcome(true);
      toast({
        title: "Welcome back!",
        description: "You've successfully logged in to your account.",
      });
    }
  }, []);

  // Fetch user information
  const { data: user, isLoading: userLoading, error: userError } = useQuery({
    queryKey: ["/api/auth/me"],
    retry: false,
  });

  // Fetch applications for the current user
  const { data: applications, isLoading: applicationsLoading, error: applicationsError } = useQuery({
    queryKey: ["/api/applications/user"],
    retry: false,
    enabled: !!user,
  });

  if (userLoading || applicationsLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 p-6">
          <div className="container mx-auto max-w-6xl">
            <div className="flex justify-center items-center h-64">
              <p className="text-gray-500">Loading your applications...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (userError) {
    // Redirect to login if user is not authenticated
    setLocation("/auth/login");
    return null;
  }

  const getStepName = (stepNumber: number) => {
    const steps = [
      "Personal Information",
      "Education History",
      "Employment History",
      "Skills and Experience",
      "References",
      "Disciplinary & Criminal Issues",
      "Equal Opportunities",
      "Data Protection"
    ];
    return steps[stepNumber] || "Personal Information";
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "in_progress":
      case "in-progress":
        return <Badge className="bg-blue-500">In Progress</Badge>;
      case "submitted":
        return <Badge className="bg-green-500">Submitted</Badge>;
      case "under_review":
        return <Badge className="bg-orange-500">Under Review</Badge>;
      default:
        return <Badge className="bg-gray-500">Draft</Badge>;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 p-6 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
              <p className="text-gray-600">
                {user ? `Welcome back, ${user.firstName}` : "Manage your fostering applications"}
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <Link href="/apply">
                <Button className="bg-orange-600 hover:bg-orange-700">
                  Start New Application
                </Button>
              </Link>
            </div>
          </div>
          
          <Separator className="mb-8" />
          
          <div className="mb-10">
            <h2 className="text-xl font-semibold mb-4">Your Applications</h2>
            
            {applicationsError ? (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-red-500">Error loading your applications. Please try again later.</p>
                </CardContent>
              </Card>
            ) : applications && applications.length > 0 ? (
              <div className="grid grid-cols-1 gap-6">
                {applications.map((application: Application) => (
                  <Card key={application.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>
                            {application.firstName} {application.lastName}
                          </CardTitle>
                          <CardDescription>{application.email}</CardDescription>
                        </div>
                        {getStatusBadge(application.status)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Last updated</p>
                          <p className="font-medium">
                            {application.saveDate ? 
                              format(new Date(application.saveDate), 'dd MMM yyyy, HH:mm') : 
                              format(new Date(application.createdAt), 'dd MMM yyyy, HH:mm')}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Last completed section</p>
                          <p className="font-medium">{getStepName(application.lastCompletedStep)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Started on</p>
                          <p className="font-medium">{format(new Date(application.createdAt), 'dd MMM yyyy')}</p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="bg-gray-50 border-t">
                      <div className="w-full flex justify-end gap-3">
                        <Link href={`/application/${application.id}`}>
                          <Button variant="secondary">View Details</Button>
                        </Link>
                        <Link href={`/apply/${application.id}`}>
                          <Button className="bg-blue-600 hover:bg-blue-700">
                            {application.status === "submitted" ? "View Application" : "Continue Application"}
                          </Button>
                        </Link>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-10 flex flex-col items-center justify-center">
                  <h3 className="text-lg font-medium mb-2">No applications yet</h3>
                  <p className="text-gray-500 mb-6 text-center max-w-md">
                    You haven't started any fostering applications yet.
                    Click the button below to begin your journey.
                  </p>
                  <Link href="/apply">
                    <Button className="bg-orange-600 hover:bg-orange-700">
                      Start Your Application
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Need Assistance?</CardTitle>
              <CardDescription>We're here to help you through the application process</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                If you have any questions or need help with your fostering application, our support team is available to assist you.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex gap-3 items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">Email Support</p>
                    <p className="text-sm text-gray-600">support@ukfostering.org</p>
                  </div>
                </div>
                <div className="flex gap-3 items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">Phone Support</p>
                    <p className="text-sm text-gray-600">0800 123 4567</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
        </div>
      </main>
      
      <Footer />
    </div>
  );
}