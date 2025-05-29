import { useState } from "react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { FormStepper } from "@/components/form-stepper";
import { PersonalInfoForm } from "@/components/personal-info-form";
import { EducationForm } from "@/components/education-form";
import { SkillsExperienceForm } from "@/components/skills-experience-form";
import { ReferencesForm } from "@/components/references-form";
import { DisciplinaryForm } from "@/components/disciplinary-form";
import { DataProtectionForm } from "@/components/data-protection-form";
import { PrivacyNotice } from "@/components/privacy-notice";
import { ApplicationComplete } from "@/components/application-complete";
import { useFormStepper } from "@/hooks/use-form-stepper";

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

export default function ApplicationFormComplete() {
  const [applicantId, setApplicantId] = useState<number | null>(null);
  const [isApplicationComplete, setIsApplicationComplete] = useState(false);

  // Initialize form stepper
  const {
    currentStep,
    nextStep,
    previousStep,
    completedSteps,
    goToStep,
    markStepComplete
  } = useFormStepper({
    initialStep: 0,
    totalSteps: steps.length,
  });

  // Handler when personal info form is completed
  const handlePersonalInfoComplete = (data: any) => {
    setApplicantId(data.id);
    markStepComplete(currentStep);
    nextStep();
  };

  // Handler for form step completion
  const handleStepComplete = () => {
    markStepComplete(currentStep);
    if (currentStep === steps.length - 1) {
      setIsApplicationComplete(true);
    } else {
      nextStep();
    }
  };

  // Handler for going back
  const handleBack = () => {
    if (isApplicationComplete) {
      setIsApplicationComplete(false);
    } else {
      previousStep();
    }
  };

  // Handler for step click navigation
  const handleStepClick = (stepIndex: number) => {
    goToStep(stepIndex);
  };

  // Render the current step content
  const renderStepContent = () => {
    if (isApplicationComplete) {
      return (
        <ApplicationComplete 
          applicantId={applicantId || 1}
          onBack={handleBack}
        />
      );
    }

    switch (currentStep) {
      case 0: // Privacy Notice
        return (
          <PrivacyNotice
            applicantId={applicantId || 1}
            onSuccess={handleStepComplete}
            onBack={handleBack}
          />
        );
      case 1: // Personal Info
        return (
          <PersonalInfoForm
            applicantId={applicantId || 1}
            onSuccess={handlePersonalInfoComplete}
          />
        );
      case 2: // Education
        return (
          <EducationForm
            applicantId={applicantId!}
            onSuccess={handleStepComplete}
            onBack={handleBack}
          />
        );
      case 3: // Employment - Using a simple employment form for now
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-orange-900 mb-4">Employment History</h2>
            <p className="text-gray-600 mb-6">Employment history form will be available soon.</p>
            <div className="flex justify-between">
              <button
                onClick={handleBack}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Back
              </button>
              <button
                onClick={handleStepComplete}
                className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
              >
                Continue
              </button>
            </div>
          </div>
        );
      case 4: // Skills
        return (
          <SkillsExperienceForm
            applicantId={applicantId!}
            onSuccess={handleStepComplete}
            onBack={handleBack}
          />
        );
      case 5: // References
        return (
          <ReferencesForm
            applicantId={applicantId!}
            onSuccess={handleStepComplete}
            onBack={handleBack}
          />
        );
      case 6: // Disciplinary
        return (
          <DisciplinaryForm
            applicantId={applicantId!}
            onSuccess={handleStepComplete}
            onBack={handleBack}
          />
        );
      case 7: // Declaration
        return (
          <DataProtectionForm
            applicantId={applicantId!}
            onSuccess={handleStepComplete}
            onBack={handleBack}
          />
        );
      default:
        return null;
    }
  };

  return (
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
        
        {/* Render current step content */}
        <div className="mt-8">
          {renderStepContent()}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}