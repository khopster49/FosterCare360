import { useState, useEffect } from "react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { FormStepper } from "@/components/form-stepper";
import { PersonalInfoForm } from "@/components/personal-info-form";
import { EducationForm } from "@/components/education-form";
import { EmploymentForm } from "@/components/employment-form-fixed";
import { SkillsExperienceForm } from "@/components/skills-experience-form";
import { ReferencesForm } from "@/components/references-form";
import { DisciplinaryForm } from "@/components/disciplinary-form";
import { DataProtectionForm } from "@/components/data-protection-form";
import { EqualOpportunitiesForm } from "@/components/equal-opportunities-form";
import { VerificationForm } from "@/components/verification-form";
import { PrivacyNotice } from "@/components/privacy-notice";
import { ApplicationComplete } from "@/components/application-complete";
import { useFormStepper } from "@/hooks/use-form-stepper";
import { Helmet } from "react-helmet";


// Define the steps for the application process
const steps = [
  { id: 1, label: "Privacy Notice" },
  { id: 2, label: "Personal Info" },
  { id: 3, label: "Education" },
  { id: 4, label: "Employment" },
  { id: 5, label: "Skills" },
  { id: 6, label: "References" },
  { id: 7, label: "Disciplinary" },
  { id: 8, label: "Declaration" },
];

export default function Home() {
  const [applicantId, setApplicantId] = useState<number | null>(null);
  const [isApplicationComplete, setIsApplicationComplete] = useState(false);
  
  // Set a simple applicant ID for localStorage-only mode
  useEffect(() => {
    setApplicantId(1);
  }, []);

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
          
          {/* Progress Bar */}
          <div className="bg-white border border-gray-200 rounded-lg mb-6 p-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold text-gray-900">Application Progress</h2>
              <span className="text-sm text-gray-600">
                Step {currentStep + 1} of {steps.length}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-orange-500 to-orange-600 h-3 rounded-full transition-all duration-300 ease-in-out"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              ></div>
            </div>
            <div className="mt-2 text-sm text-gray-600">
              {steps[currentStep]?.label}
            </div>
          </div>
          
          {/* Show completion page when application is complete */}
          {isApplicationComplete ? (
            <ApplicationComplete 
              applicantId={applicantId || 1}
              onBack={() => setIsApplicationComplete(false)}
            />
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              {currentStep === 0 && (
              <>
                <h2 className="text-xl font-medium mb-2 text-primary">Privacy Notice</h2>
                <p className="text-neutral-700 text-sm mb-6">
                  Please carefully review this important privacy notice regarding how we process your personal information.
                </p>
                
                

                <PrivacyNotice 
                  applicantId={applicantId || 1}
                  onSuccess={() => nextStep()} 
                  onBack={() => previousStep()} 
                />
              </>
            )}
            
            {currentStep === 1 && (
              <>
                <h2 className="text-2xl font-semibold mb-4 text-primary">Confidential Application Form</h2>
                
                <div className="text-neutral-700 text-sm mb-4 space-y-4">
                  <p>
                    Swiis is committed to Equal Opportunities in all areas of our operations and welcome all applicants 
                    irrespective of age, disability, gender reassignment, marriage & civil partnership, race, religion, pregnancy & 
                    maternity, sex, and sexual orientation. The information which you provide on this application form 
                    (excluding the Equal Opportunities Questionnaire below which will be processed separately) will be used 
                    solely to assess your ability to carry out the role that you are applying for.
                  </p>
                  <p>
                    If you are disabled or have a health condition and would like us to consider making any reasonable 
                    adjustments to the application process and/or the role that you are applying for, then please let the HR Team 
                    know via email: HRTeam@swiis.com and we will be happy to help.
                  </p>
                  <p>
                    Please ensure the application form is completed fully and that you demonstrate your skills/experience 
                    clearly against the job description for the role.
                  </p>
                </div>
                
                <PersonalInfoForm 
                  applicantId={applicantId || undefined}
                  onSuccess={handlePersonalInfoComplete} 
                />
              </>
            )}
            
            {currentStep === 2 && (
              <>
                <h2 className="text-xl font-medium mb-2">Education History</h2>
                <p className="text-neutral-700 text-sm mb-6">
                  Please provide details of your educational background, starting with the most recent.
                </p>
                <EducationForm 
                  applicantId={applicantId || 2}
                  onSuccess={() => nextStep()} 
                  onBack={() => previousStep()} 
                />
              </>
            )}
            
            {currentStep === 3 && (
              <>
                <h2 className="text-xl font-medium mb-2 text-primary">Employment History</h2>
                <div className="text-neutral-700 text-sm mb-6 space-y-4">
                  <p>
                    Please give us details of every job or voluntary position you have held since leaving school, including the names, addresses and dates for leaving (continue on additionally sheet if necessary). Please indicate which of these positions involved direct work with children or vulnerable adults and explain any gaps in your employment history.
                  </p>
                  <p>
                    NB: We are required by the Fostering Services Regulations 2011: 'Where a person has previously worked in a position whose duties involved work with children or vulnerable adults, so far as reasonably practicable verification of the reason why the employment or position ended' is required. We reserve the right to contact any employer where you have worked with children or vulnerable adults.
                  </p>
                </div>
                <EmploymentForm 
                  applicantId={applicantId || 1} // Allow preview with temporary ID
                  onSuccess={() => nextStep()} 
                  onBack={() => previousStep()} 
                />
              </>
            )}
            
            {currentStep === 4 && (
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
            
            {currentStep === 5 && (
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
            
            {currentStep === 6 && (
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
            
            {currentStep === 7 && (
              <>
                <h2 className="text-xl font-medium mb-2 text-primary">Data Protection/Declaration & Confidentiality Agreement</h2>
                <p className="text-neutral-700 text-sm mb-6">
                  Please review and agree to the declaration and confidentiality agreement to complete your application.
                </p>
                <DataProtectionForm 
                  applicantId={applicantId || 1} // Allow preview with temporary ID
                  onSuccess={() => setIsApplicationComplete(true)} 
                  onBack={() => previousStep()} 
                />
              </>
            )}
            


            </div>
          )}
        </main>
        
        <Footer />
      </div>
    </>
  );
}


