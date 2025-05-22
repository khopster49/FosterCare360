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

  // Fetch applicant data for the application
  const applicantQuery = useQuery({
    queryKey: ['/api/applicants', applicantId],
    enabled: !!applicantId,
  });
  const applicant = applicantQuery.data;
  
  // Fetch education history for the PDF
  const educationQuery = useQuery({
    queryKey: ['/api/applicants', applicantId, 'education'],
    enabled: !!applicantId,
  });
  const education = educationQuery.data || [];
  
  // Fetch employment history for the PDF
  const employmentQuery = useQuery({
    queryKey: ['/api/applicants', applicantId, 'employment'],
    enabled: !!applicantId,
  });
  const employment = employmentQuery.data || [];
  
  // Fetch references for the PDF
  const referencesQuery = useQuery({
    queryKey: ['/api/applicants', applicantId, 'references'],
    enabled: !!applicantId,
  });
  const references = referencesQuery.data || [];
  
  // Fetch DBS check data for the PDF
  const verificationQuery = useQuery({
    queryKey: ['/api/applicants', applicantId, 'dbs'],
    enabled: !!applicantId,
  });
  const verification = verificationQuery.data;
  
  // Check if all data is loaded for PDF generation
  const isDataReady = !!applicant && !!education && !!employment && !!references;
  
  // Log application data for PDF when on final step
  useEffect(() => {
    if (currentStep === 10) {
      console.log("Current step for PDF:", currentStep);
      console.log("Raw applicant data:", applicant);
      console.log("Raw education data:", education);
      console.log("Raw employment data:", employment);
      
      // Get applicant data directly if not available through the query
      if (!applicant && applicantId) {
        fetch(`/api/applicants/${applicantId}`)
          .then(res => res.json())
          .then(data => {
            console.log("Direct fetch applicant data:", data);
          })
          .catch(err => console.error("Error fetching applicant data:", err));
      }
    }
  }, [currentStep, applicantId, applicant, education, employment]);

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
                  Please give us details of every job or voluntary position you have held since leaving school, including the names, addresses and dates for leaving (continue on additionally sheet if necessary). Please indicate which of these positions involved direct work with children or vulnerable adults and explain any gaps in your employment history.
                </p>
                <p className="text-neutral-700 text-sm mb-6">
                  NB: We are required by the Fostering Services Regulations 2011: 'Where a person has previously worked in a position whose duties involved work with children or vulnerable adults, so far as reasonably practicable verification of the reason why the employment or position ended' is required. We reserve the right to contact any employer where you have worked with children or vulnerable adults.
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
                      {/* Use PDF Download component with test data */}
                      <Button
                        onClick={() => {
                          // Fetch PDF data and show it in a new window
                          fetch(`/api/applicants/${applicantId}/pdf-data`)
                            .then(response => response.json())
                            .then(data => {
                              console.log("PDF data:", data);
                              // Create a client-side PDF and show it
                              const pdfBlob = new Blob(
                                [`
Confidential Application Form

Swiis is committed to Equal Opportunities in all areas of our operations and welcome all applicants 
irrespective of age, disability, gender reassignment, marriage & civil partnership, race, religion, pregnancy & 
maternity, sex, and sexual orientation. The information which you provide on this application form 
(excluding the Equal Opportunities Questionnaire below which will be processed separately) will be used 
solely to assess your ability to carry out the role that you are applying for.

If you are disabled or have a health condition and would like us to consider making any reasonable 
adjustments to the application process and/or the role that you are applying for, then please let the HR Team 
know via email: HRTeam@swiis.com and we will be happy to help.

Please ensure the application form is completed fully and that you demonstrate your skills/experience 
clearly against the job description for the role.

Position Applied For: ${data.applicant.positionAppliedFor || 'Not specified'}

PERSONAL INFORMATION
Name: ${data.applicant.title || ''} ${data.applicant.firstName || ''} ${data.applicant.middleName || ''} ${data.applicant.lastName || ''}
Email: ${data.applicant.email || ''}
Phone: ${data.applicant.mobilePhone || ''}
Address: ${data.applicant.address || ''}, ${data.applicant.postcode || ''}
                                `], 
                                { type: 'text/plain' }
                              );
                              
                              // Create a download link
                              const url = URL.createObjectURL(pdfBlob);
                              const link = document.createElement('a');
                              link.href = url;
                              link.download = `application-${applicantId}.txt`;
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                            })
                            .catch(error => {
                              console.error("Error fetching PDF data:", error);
                              alert("There was an error generating the PDF. Please try again.");
                            });
                        }}
                        className="flex items-center gap-2"
                      >
                        <svg className="h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        Download Application PDF
                      </Button>
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
