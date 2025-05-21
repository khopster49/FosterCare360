import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { FormStepper } from "@/components/form-stepper";
import { PersonalInfoForm } from "@/components/personal-info-form";
import { EducationForm } from "@/components/education-form-new";
import { EmploymentForm } from "@/components/employment-form";
import { SkillsExperienceForm } from "@/components/skills-experience-form";
import { ReferencesForm } from "@/components/references-form";
import { DisciplinaryForm } from "@/components/disciplinary-form";
import { DataProtectionForm } from "@/components/data-protection-form";
import { EqualOpportunitiesForm } from "@/components/equal-opportunities-form";
import { VerificationForm } from "@/components/verification-form";
import { PrivacyNotice } from "@/components/privacy-notice";
import { SaveExitButton } from "@/components/save-exit-button";
import { useFormStepper } from "@/hooks/use-form-stepper";
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

// Define the steps for the application process
const steps = [
  { id: 1, label: "Personal Info" },
  { id: 2, label: "Education" },
  { id: 3, label: "Employment" },
  { id: 4, label: "Skills" },
  { id: 5, label: "References" },
  { id: 6, label: "Disciplinary" },
  { id: 7, label: "Declaration" },
  { id: 8, label: "Equal Opps" },
  { id: 9, label: "Checks" },
  { id: 10, label: "Privacy Notice" },
];

export default function Home() {
  const [applicantId, setApplicantId] = useState<number | null>(null);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  // Check if user is logged in
  const { data: user, isLoading: isUserLoading } = useQuery({
    queryKey: ['/api/auth/me'],
    retry: false,
  });
  
  // Initialize form stepper (check URL for step param)
  const urlParams = new URLSearchParams(window.location.search);
  const stepParam = urlParams.get('step');
  const initialStepIndex = stepParam ? parseInt(stepParam) : 0;
  
  const {
    currentStep,
    nextStep,
    previousStep,
    completedSteps,
    setCurrentStep
  } = useFormStepper({
    initialStep: initialStepIndex,
    totalSteps: steps.length,
  });
  
  // Save progress mutation
  const saveProgressMutation = useMutation({
    mutationFn: async () => {
      if (!applicantId) return null;
      return await apiRequest(`/api/applicants/${applicantId}/progress`, "PATCH", {
        step: currentStep
      });
    },
    onSuccess: () => {
      toast({
        title: "Progress Saved",
        description: "Your application progress has been saved successfully. You can return later to continue.",
      });
      setLocation("/dashboard");
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Save Progress",
        description: error.message || "There was an error saving your progress. Please try again.",
        variant: "destructive",
      });
    }
  });
  
  // Handle save and exit
  const handleSaveAndExit = () => {
    if (!user) {
      // If not logged in, prompt to log in or register
      toast({
        title: "Authentication Required",
        description: "Please log in or register to save your progress.",
      });
      setLocation("/auth/login");
      return;
    }
    
    // If no applicant ID yet, inform user they need to complete personal info first
    if (!applicantId) {
      toast({
        title: "Complete Personal Information",
        description: "Please complete the Personal Information section before saving your progress.",
      });
      return;
    }
    
    // Save progress and redirect to dashboard
    saveProgressMutation.mutate();
  };

  // Handler when personal info form is completed
  const handlePersonalInfoComplete = (data: any) => {
    setApplicantId(data.id);
    nextStep();
  };

  return (
    <>
      <Helmet>
        <title>UK Fostering Onboarding Programme - Application</title>
        <meta name="description" content="Complete your UK fostering application to become a foster carer. Our online application process meets all Schedule 1 regulations." />
        <meta property="og:title" content="UK Fostering Onboarding Programme - Application" />
        <meta property="og:description" content="Complete your UK fostering application to become a foster carer. Our online application process meets all Schedule 1 regulations." />
      </Helmet>
      
      <div className="flex flex-col min-h-screen bg-neutral-50">
        <Header />
        
        <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-primary">Fostering Application</h1>
            
            {/* Save and Exit button - only shown when form has an ID */}
            {applicantId && (
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={handleSaveAndExit}
                disabled={saveProgressMutation.isPending}
              >
                {saveProgressMutation.isPending ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                      <polyline points="17 21 17 13 7 13 7 21"></polyline>
                      <polyline points="7 3 7 8 15 8"></polyline>
                    </svg>
                    Save & Exit
                  </>
                )}
              </Button>
            )}
          </div>
          
          <FormStepper 
            steps={steps} 
            currentStep={currentStep} 
            completedSteps={completedSteps}
          />
          
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            {currentStep === 0 && (
              <>
                <h2 className="text-xl font-medium mb-2">Personal Information</h2>
                <p className="text-neutral-700 text-sm mb-6">
                  Please provide your basic personal details as required by UK fostering regulations.
                </p>
                <PersonalInfoForm onSuccess={handlePersonalInfoComplete} />
              </>
            )}
            
            {currentStep === 1 && applicantId && (
              <>
                <h2 className="text-xl font-medium mb-2">Education History</h2>
                <p className="text-neutral-700 text-sm mb-6">
                  Please provide details of your educational background, starting with the most recent.
                </p>
                <EducationForm 
                  applicantId={applicantId} 
                  onSuccess={() => nextStep()} 
                  onBack={() => previousStep()} 
                />
              </>
            )}
            
            {currentStep === 2 && applicantId && (
              <>
                <h2 className="text-xl font-medium mb-2">Employment History</h2>
                <p className="text-neutral-700 text-sm mb-6">
                  Please provide your complete employment history, including any gaps. All gaps over 31 days must be explained.
                </p>
                <EmploymentForm 
                  applicantId={applicantId} 
                  onSuccess={() => nextStep()} 
                  onBack={() => previousStep()} 
                />
              </>
            )}
            
            {currentStep === 3 && applicantId && (
              <>
                <h2 className="text-xl font-medium mb-2 text-primary">Skills and Experience</h2>
                <p className="text-neutral-700 text-sm mb-6">
                  Please explain why you consider yourself suited to fostering and what you would contribute to the role.
                </p>
                <SkillsExperienceForm 
                  applicantId={applicantId} 
                  onSuccess={() => nextStep()} 
                  onBack={() => previousStep()} 
                />
              </>
            )}
            
            {currentStep === 4 && applicantId && (
              <>
                <h2 className="text-xl font-medium mb-2">References</h2>
                <p className="text-neutral-700 text-sm mb-6">
                  We will seek references from your last two employers and all previous positions where you worked with children or vulnerable adults.
                </p>
                <ReferencesForm 
                  applicantId={applicantId} 
                  onSuccess={() => nextStep()} 
                  onBack={() => previousStep()} 
                />
              </>
            )}
            
            {currentStep === 5 && applicantId && (
              <>
                <h2 className="text-xl font-medium mb-2 text-primary">Disciplinary & Criminal Issues</h2>
                <p className="text-neutral-700 text-sm mb-6">
                  Please provide information about any disciplinary or criminal issues as required by fostering regulations.
                </p>
                <DisciplinaryForm 
                  applicantId={applicantId} 
                  onSuccess={() => nextStep()} 
                  onBack={() => previousStep()} 
                />
              </>
            )}
            
            {currentStep === 6 && applicantId && (
              <>
                <h2 className="text-xl font-medium mb-2 text-primary">Data Protection/Declaration & Confidentiality Agreement</h2>
                <p className="text-neutral-700 text-sm mb-6">
                  Please review and agree to the declaration and confidentiality agreement to complete your application.
                </p>
                <DataProtectionForm 
                  applicantId={applicantId} 
                  onSuccess={() => nextStep()} 
                  onBack={() => previousStep()} 
                />
              </>
            )}
            
            {currentStep === 7 && applicantId && (
              <>
                <h2 className="text-xl font-medium mb-2 text-primary">Equal Opportunities Questionnaire</h2>
                <p className="text-neutral-700 text-sm mb-6">
                  Please complete this optional questionnaire to help us monitor our equal opportunities policy and performance.
                </p>
                <EqualOpportunitiesForm 
                  applicantId={applicantId} 
                  onSuccess={() => nextStep()} 
                  onBack={() => previousStep()} 
                />
              </>
            )}
            
            {currentStep === 8 && applicantId && (
              <>
                <h2 className="text-xl font-medium mb-2">Verification Checks</h2>
                <p className="text-neutral-700 text-sm mb-6">
                  As part of the fostering application process, we need to conduct mandatory verification checks to ensure compliance with UK regulations.
                </p>
                <VerificationForm 
                  applicantId={applicantId} 
                  onSuccess={() => nextStep()} 
                  onBack={() => previousStep()} 
                />
              </>
            )}
            
            {currentStep === 9 && applicantId && (
              <>
                <h2 className="text-xl font-medium mb-2 text-primary">Data Protection Privacy Notice</h2>
                <p className="text-neutral-700 text-sm mb-6">
                  Please carefully review this important privacy notice regarding how we process your personal information.
                </p>
                <PrivacyNotice 
                  applicantId={applicantId} 
                  onSuccess={() => nextStep()} 
                  onBack={() => previousStep()} 
                />
              </>
            )}
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
}
