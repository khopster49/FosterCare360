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
