import { useState } from "react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { FormStepper } from "@/components/form-stepper";
import { PersonalInfoForm } from "@/components/personal-info-form";
import { EducationForm } from "@/components/education-form";
import { EmploymentForm } from "@/components/employment-form";
import { SkillsExperienceForm } from "@/components/skills-experience-form";
import { ReferencesForm } from "@/components/references-form";
import { VerificationForm } from "@/components/verification-form";
import { useFormStepper } from "@/hooks/use-form-stepper";
import { Helmet } from "react-helmet";

// Define the steps for the application process
const steps = [
  { id: 1, label: "Personal Info" },
  { id: 2, label: "Education" },
  { id: 3, label: "Employment" },
  { id: 4, label: "Skills" },
  { id: 5, label: "References" },
  { id: 6, label: "Checks" },
];

export default function Home() {
  const [applicantId, setApplicantId] = useState<number | null>(null);
  
  // Initialize form stepper
  const {
    currentStep,
    nextStep,
    previousStep,
    completedSteps,
  } = useFormStepper({
    initialStep: 0,
    totalSteps: steps.length,
  });

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
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
}
