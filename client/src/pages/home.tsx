import React, { useState, useEffect } from "react";
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
import { ApplicationPDFDownload } from "@/components/application-pdf-generator";
import { useFormStepper } from "@/hooks/use-form-stepper";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";

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
  { id: 11, label: "Complete" },
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

  // Fetch applicant data for completion page
  const { data: applicant } = useQuery({
    queryKey: ['/api/applicants', applicantId],
    enabled: !!applicantId && currentStep === 10,
  });
  
  // Fetch education history for the PDF
  const { data: education } = useQuery({
    queryKey: ['/api/applicants', applicantId, 'education'],
    enabled: !!applicantId && currentStep === 10,
  });
  
  // Fetch employment history for the PDF
  const { data: employment } = useQuery({
    queryKey: ['/api/applicants', applicantId, 'employment'],
    enabled: !!applicantId && currentStep === 10,
  });
  
  // Fetch references for the PDF
  const { data: references } = useQuery({
    queryKey: ['/api/applicants', applicantId, 'references'],
    enabled: !!applicantId && currentStep === 10,
  });
  
  // Fetch DBS check data for the PDF
  const { data: verification } = useQuery({
    queryKey: ['/api/applicants', applicantId, 'dbs'],
    enabled: !!applicantId && currentStep === 10,
  });
  
  // Check if all data is loaded for PDF generation
  const isDataReady = !!applicant && !!education && !!employment && !!references;
  
  // Log the data to check if it's loading correctly
  useEffect(() => {
    if (currentStep === 10 && applicant) {
      console.log("Application data ready for PDF:", {
        applicant, 
        education, 
        employment, 
        references, 
        verification
      });
    }
  }, [currentStep, applicant, education, employment, references, verification]);

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
                  Please provide your basic personal details as required by fostering regulations.
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
            
            {currentStep === 10 && applicantId && (
              <>
                <div className="text-center space-y-6 py-8">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6 max-w-lg mx-auto mb-8">
                    <div className="flex justify-center mb-4">
                      <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                          <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                      </div>
                    </div>
                    
                    <h2 className="text-2xl font-bold text-green-700 mb-2">Application Submitted!</h2>
                    <p className="text-green-600 mb-4">
                      Thank you for submitting your application.
                    </p>
                    <p className="text-slate-700 mb-6">
                      Your application has been received and will be reviewed by our team. You can download a copy of your completed application for your records using the button below.
                    </p>
                    
                    {/* Show PDF download button */}
                    <div className="flex justify-center">
                      <ApplicationPDFDownload
                        applicant={applicant}
                        education={education}
                        employment={employment}
                        references={references}
                        verification={verification}
                        equal={applicant}
                        discipline={applicant}
                      />
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-lg font-medium mb-4">What happens next?</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <div className="font-medium mb-2">1. Application Review</div>
                        <p className="text-sm text-gray-600">Our team will review your application and contact you within 5 working days.</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <div className="font-medium mb-2">2. Shortlisting</div>
                        <p className="text-sm text-gray-600">Applications will be shortlisted for interview based on application information provided.</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <div className="font-medium mb-2">3. Interview</div>
                        <p className="text-sm text-gray-600">If the application is successfully shortlisted, you will be invited to an interview.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8">
                    <p className="text-sm text-gray-500">
                      If you have any questions, please contact our team at <a href="mailto:HRTeam@swiis.com" className="text-primary font-medium">HRTeam@swiis.com</a> or call <a href="tel:02032192865" className="text-primary font-medium">0203 219 2865</a>
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
}
