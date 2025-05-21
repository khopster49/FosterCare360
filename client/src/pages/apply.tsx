import { useEffect, useState } from "react";
import { useParams, useLocation } from "wouter";
import { PersonalInfoForm } from "@/components/personal-info-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { useAuth } from "@/hooks/useAuth";

// Application step indicators
const steps = [
  { label: "Personal Information", key: "personal" },
  { label: "Education History", key: "education" },
  { label: "Employment History", key: "employment" },
  { label: "Skills & Experience", key: "skills" },
  { label: "References", key: "references" },
  { label: "Disciplinary & Criminal", key: "disciplinary" },
  { label: "Equal Opportunities", key: "equal-opportunities" },
  { label: "Data Protection", key: "data-protection" }
];

export default function ApplyPage() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const [activeStep, setActiveStep] = useState("personal");
  const [applicantId, setApplicantId] = useState<number | null>(null);
  
  const { isAuthenticated, isLoading } = useAuth();

  // If there's an application ID in the URL, fetch that application
  useEffect(() => {
    if (id && !isNaN(Number(id))) {
      // Would fetch application data in a real implementation
      setApplicantId(Number(id));
    }
  }, [id]);

  // Function to handle form submission of personal info
  const handlePersonalInfoSuccess = (newApplicantId: number) => {
    setApplicantId(newApplicantId);
    setActiveStep("education");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 p-6 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Fostering Application</h1>
            <p className="text-gray-600">
              Please complete all sections of the application form
            </p>
          </div>
          
          {/* Application form content */}
          <Tabs value={activeStep} onValueChange={setActiveStep}>
            {/* Progress tracker */}
            <div className="mb-8 overflow-x-auto">
              <div className="min-w-max">
                <TabsList className="grid grid-cols-8 w-full">
                  {steps.map((step, index) => (
                    <TabsTrigger
                      key={step.key}
                      value={step.key}
                      onClick={() => {
                        // Only allow navigation if we have an applicant ID (except for the first step)
                        if (step.key === "personal" || applicantId) {
                          setActiveStep(step.key);
                        }
                      }}
                      disabled={step.key !== "personal" && !applicantId}
                    >
                      <div className="flex flex-col items-center">
                        <span className="rounded-full bg-gray-200 text-gray-700 w-6 h-6 flex items-center justify-center mb-1">
                          {index + 1}
                        </span>
                        <span className="text-xs hidden md:block">{step.label}</span>
                      </div>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
            </div>
            <TabsContent value="personal">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    Please provide your personal details below
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PersonalInfoForm onSuccess={handlePersonalInfoSuccess} />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="education">
              <Card>
                <CardHeader>
                  <CardTitle>Education History</CardTitle>
                  <CardDescription>
                    Please provide details of your education history
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center p-10">
                    <p className="mb-6">This section will be implemented in the next phase</p>
                    <div className="flex justify-center gap-4">
                      <Button 
                        variant="outline" 
                        onClick={() => setActiveStep("personal")}
                      >
                        Previous Step
                      </Button>
                      <Button onClick={() => setActiveStep("employment")}>
                        Next Step
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Placeholder tabs for remaining steps */}
            {["employment", "skills", "references", "disciplinary", "equal-opportunities", "data-protection"].map((step) => (
              <TabsContent key={step} value={step}>
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {steps.find(s => s.key === step)?.label || step}
                    </CardTitle>
                    <CardDescription>
                      This section will be implemented in the next phase
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center p-10">
                      <p className="mb-6">Coming soon...</p>
                      <div className="flex justify-center gap-4">
                        <Button 
                          variant="outline" 
                          onClick={() => {
                            const currentIndex = steps.findIndex(s => s.key === step);
                            if (currentIndex > 0) {
                              setActiveStep(steps[currentIndex - 1].key);
                            }
                          }}
                        >
                          Previous Step
                        </Button>
                        <Button 
                          onClick={() => {
                            const currentIndex = steps.findIndex(s => s.key === step);
                            if (currentIndex < steps.length - 1) {
                              setActiveStep(steps[currentIndex + 1].key);
                            } else {
                              // Handle completion
                              setLocation("/dashboard");
                            }
                          }}
                        >
                          {step === "data-protection" ? "Submit Application" : "Next Step"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}