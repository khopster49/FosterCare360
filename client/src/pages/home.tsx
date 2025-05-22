import { useState } from "react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { FormStepper } from "@/components/form-stepper";
import { PersonalInfoForm } from "@/components/personal-info-form";
import { EducationForm } from "@/components/education-form";
import { EmploymentForm } from "@/components/employment-form";
import { SkillsExperienceForm } from "@/components/skills-experience-form";
import { ReferencesForm } from "@/components/references-form";
import { DisciplinaryForm } from "@/components/disciplinary-form";
import { DataProtectionForm } from "@/components/data-protection-form";
import { EqualOpportunitiesForm } from "@/components/equal-opportunities-form";
import { VerificationForm } from "@/components/verification-form";
import { PrivacyNotice } from "@/components/privacy-notice";
import { useFormStepper } from "@/hooks/use-form-stepper";
import { Helmet } from "react-helmet";

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
  
  // Initialize form stepper
  const {
    currentStep,
    nextStep,
    previousStep,
    completedSteps,
    goToStep
  } = useFormStepper({
    initialStep: 0,
    totalSteps: steps.length,
  });

  // Handler when personal info form is completed
  const handlePersonalInfoComplete = (data: any) => {
    setApplicantId(data.id);
    nextStep();
  };
  
  // Creating a temporary applicant ID to allow navigation without alerts
  const [tempApplicantCreated, setTempApplicantCreated] = useState(false);
  
  // Function to handle direct navigation to steps when clicking on step numbers
  const handleStepClick = (stepIndex: number) => {
    // For first step, always allow navigation
    if (stepIndex === 0) {
      goToStep(stepIndex);
      return;
    }
    
    // For section navigation preview, we'll allow direct access to all sections
    goToStep(stepIndex);
    
    // Create a temporary applicant ID if needed for preview purposes
    if (!applicantId && !tempApplicantCreated) {
      setTempApplicantCreated(true);
      // This is just for UI preview purposes - no actual data is submitted
      // When the user actually submits the Personal Info form, this will be replaced
      // with a real applicant ID
    }
  };

  return (
    <>
      <Helmet>
        <title>Swiis Foster Care - Application</title>
        <meta name="description" content="Complete your fostering application to become a Swiis foster carer. Our online application process meets all Schedule 1 regulations." />
        <meta property="og:title" content="Swiis Foster Care - Application" />
        <meta property="og:description" content="Complete your fostering application to become a Swiis foster carer. Our online application process meets all Schedule 1 regulations." />
      </Helmet>
      
      <div className="flex flex-col min-h-screen bg-neutral-50">
        <Header />
        
        <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <FormStepper 
            steps={steps} 
            currentStep={currentStep} 
            completedSteps={completedSteps}
            onStepClick={handleStepClick}
          />
          
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            {currentStep === 0 && (
              <>
                <h2 className="text-xl font-medium mb-2">Personal Information</h2>
                <p className="text-neutral-700 text-sm mb-6">
                  Please provide your basic personal details as required by fostering regulations.
                </p>
                <PersonalInfoForm onSuccess={handlePersonalInfoComplete} />
              </>
            )}
            
            {currentStep === 1 && (
              <>
                <h2 className="text-xl font-medium mb-2">Education History</h2>
                <p className="text-neutral-700 text-sm mb-6">
                  Please provide details of your educational background, starting with the most recent.
                </p>
                <EducationForm 
                  applicantId={applicantId || 1} // Allow preview with temporary ID 
                  onSuccess={() => nextStep()} 
                  onBack={() => previousStep()} 
                />
              </>
            )}
            
            {currentStep === 2 && (
              <>
                <h2 className="text-xl font-medium mb-2">Employment History</h2>
                <p className="text-neutral-700 text-sm mb-6">
                  Please provide your complete employment history, including any gaps. All gaps over 31 days must be explained.
                </p>
                <EmploymentForm 
                  applicantId={applicantId || 1} // Allow preview with temporary ID
                  onSuccess={() => nextStep()} 
                  onBack={() => previousStep()} 
                />
              </>
            )}
            
            {currentStep === 3 && (
              <>
                <h2 className="text-xl font-medium mb-2 text-primary">Skills and Experience</h2>
                <p className="text-neutral-700 text-sm mb-6">
                  Please explain why you consider yourself suited to fostering and what you would contribute to the role.
                </p>
                <SkillsExperienceForm 
                  applicantId={applicantId || 1} // Allow preview with temporary ID
                  onSuccess={() => nextStep()} 
                  onBack={() => previousStep()} 
                />
              </>
            )}
            
            {currentStep === 4 && (
              <>
                <h2 className="text-xl font-medium mb-2">References</h2>
                <p className="text-neutral-700 text-sm mb-6">
                  We will seek references from your last two employers and all previous positions where you worked with children or vulnerable adults.
                </p>
                <ReferencesForm 
                  applicantId={applicantId || 1} // Allow preview with temporary ID
                  onSuccess={() => nextStep()} 
                  onBack={() => previousStep()} 
                />
              </>
            )}
            
            {currentStep === 5 && (
              <>
                <h2 className="text-xl font-medium mb-2 text-primary">Disciplinary & Criminal Issues</h2>
                <p className="text-neutral-700 text-sm mb-6">
                  Please provide information about any disciplinary or criminal issues as required by fostering regulations.
                </p>
                <DisciplinaryForm 
                  applicantId={applicantId || 1} // Allow preview with temporary ID
                  onSuccess={() => nextStep()} 
                  onBack={() => previousStep()} 
                />
              </>
            )}
            
            {currentStep === 6 && (
              <>
                <h2 className="text-xl font-medium mb-2 text-primary">Data Protection/Declaration & Confidentiality Agreement</h2>
                <p className="text-neutral-700 text-sm mb-6">
                  Please review and agree to the declaration and confidentiality agreement to complete your application.
                </p>
                <DataProtectionForm 
                  applicantId={applicantId || 1} // Allow preview with temporary ID
                  onSuccess={() => nextStep()} 
                  onBack={() => previousStep()} 
                />
              </>
            )}
            
            {currentStep === 7 && (
              <>
                <h2 className="text-xl font-medium mb-2 text-primary">Equal Opportunities Questionnaire</h2>
                <p className="text-neutral-700 text-sm mb-6">
                  Please complete this optional questionnaire to help us monitor our equal opportunities policy and performance.
                </p>
                <EqualOpportunitiesForm 
                  applicantId={applicantId || 1} // Allow preview with temporary ID
                  onSuccess={() => nextStep()} 
                  onBack={() => previousStep()} 
                />
              </>
            )}
            
            {currentStep === 8 && (
              <>
                <h2 className="text-xl font-medium mb-2">Verification Checks</h2>
                <p className="text-neutral-700 text-sm mb-6">
                  As part of the fostering application process, we need to conduct mandatory verification checks to ensure compliance with UK regulations.
                </p>
                <VerificationForm 
                  applicantId={applicantId || 1} // Allow preview with temporary ID
                  onSuccess={() => nextStep()} 
                  onBack={() => previousStep()} 
                />
              </>
            )}
            
            {currentStep === 9 && (
              <>
                <h2 className="text-xl font-medium mb-2 text-primary">Data Protection Privacy Notice</h2>
                <p className="text-neutral-700 text-sm mb-6">
                  Please carefully review this important privacy notice regarding how we process your personal information.
                </p>
                <PrivacyNotice 
                  applicantId={applicantId || 1} // Allow preview with temporary ID
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
