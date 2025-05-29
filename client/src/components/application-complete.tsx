import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Download, Send } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface ApplicationCompleteProps {
  applicantId: number;
  onBack: () => void;
}

export function ApplicationComplete({ applicantId, onBack }: ApplicationCompleteProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Mark application as submitted in localStorage
      localStorage.setItem(`application_submitted_${applicantId}`, JSON.stringify({
        submittedAt: new Date().toISOString(),
        status: 'submitted'
      }));
      
      toast({
        title: "Application Submitted Successfully!",
        description: "Your application has been submitted for review. You will receive confirmation by email shortly.",
      });
      
      setIsSubmitted(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem submitting your application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    try {
      // Collect all application data from localStorage - fix personal info extraction
      // Personal info is stored with key 'personalInfo' (not with applicant ID)
      const personalInfo = JSON.parse(localStorage.getItem('personalInfo') || '{}');
      
      const educationRaw = JSON.parse(localStorage.getItem(`education_${applicantId}`) || '[]');
      const education = Array.isArray(educationRaw) ? educationRaw : [];
      
      const employmentRaw = JSON.parse(localStorage.getItem(`employment_${applicantId}`) || '{}');
      const employment = employmentRaw.employmentEntries || [];
      const employmentGaps = employmentRaw.employmentGaps || [];
      
      const skillsRaw = JSON.parse(localStorage.getItem(`skills_${applicantId}`) || '{}');
      const skills = skillsRaw.skillsAndExperience ? { skills: skillsRaw.skillsAndExperience } : {};
      
      const referencesRaw = JSON.parse(localStorage.getItem(`references_${applicantId}`) || '[]');
      const references = Array.isArray(referencesRaw) ? referencesRaw : [];
      
      const disciplinaryRaw = JSON.parse(localStorage.getItem(`disciplinary_${applicantId}`) || '{}');
      const disciplinary = disciplinaryRaw;
      
      const dataProtection = JSON.parse(localStorage.getItem(`data_protection_${applicantId}`) || '{}');
      const privacyNotice = JSON.parse(localStorage.getItem(`privacy_notice_${applicantId}`) || '{}');

      // Debug: Let's see the actual personal info structure
      console.log('Personal Info:', personalInfo);

      // Create a simple text summary
      let textContent = `SWIIS STAFF APPLICATION FORM\n`;
      textContent += `=====================================\n\n`;
      textContent += `Application Date: ${new Date().toLocaleDateString('en-GB')}\n\n`;
      
      textContent += `PERSONAL INFORMATION\n`;
      textContent += `-------------------\n`;
      textContent += `Position Applied For: ${personalInfo.positionAppliedFor || 'Not provided'}\n`;
      textContent += `Title: ${personalInfo.title || 'Not provided'}\n`;
      textContent += `First Name: ${personalInfo.firstName || 'Not provided'}\n`;
      textContent += `Middle Name: ${personalInfo.middleName || 'Not provided'}\n`;
      textContent += `Last Name: ${personalInfo.lastName || 'Not provided'}\n`;
      textContent += `Pronouns: ${personalInfo.pronouns || 'Not provided'}\n`;
      textContent += `Other Names: ${personalInfo.otherNames || 'Not provided'}\n`;
      textContent += `Email: ${personalInfo.email || 'Not provided'}\n`;
      textContent += `Address: ${personalInfo.address || 'Not provided'}\n`;
      textContent += `Postcode: ${personalInfo.postcode || 'Not provided'}\n`;
      textContent += `Home Phone: ${personalInfo.homePhone || 'Not provided'}\n`;
      textContent += `Mobile Phone: ${personalInfo.mobilePhone || 'Not provided'}\n`;
      textContent += `Driving Licence: ${personalInfo.drivingLicence ? 'Yes' : 'No'}\n`;
      textContent += `Nationality: ${personalInfo.nationality || 'Not provided'}\n`;
      textContent += `Visa Type: ${personalInfo.visaType || 'Not provided'}\n`;
      textContent += `Visa Expiry: ${personalInfo.visaExpiry || 'Not provided'}\n`;
      textContent += `National Insurance Number: ${personalInfo.niNumber || 'Not provided'}\n`;
      textContent += `Right to Work: ${personalInfo.rightToWork ? 'Yes' : 'No'}\n`;
      textContent += `DBS Registered: ${personalInfo.dbsRegistered ? 'Yes' : 'No'}\n`;
      textContent += `DBS Number: ${personalInfo.dbsNumber || 'Not provided'}\n`;
      textContent += `DBS Issue Date: ${personalInfo.dbsIssueDate || 'Not provided'}\n`;
      textContent += `Work Document Type: ${personalInfo.workDocumentType || 'Not provided'}\n`;
      textContent += `Referral Source: ${personalInfo.referralSource || 'Not provided'}\n`;
      textContent += `Professional Registration Number: ${personalInfo.professionalRegNumber || 'Not provided'}\n`;
      textContent += `Professional Registration Expiry: ${personalInfo.professionalRegExpiry || 'Not provided'}\n\n`;

      if (education.length > 0) {
        textContent += `EDUCATION\n`;
        textContent += `---------\n`;
        education.forEach((edu: any, index: number) => {
          textContent += `Education ${index + 1}:\n`;
          textContent += `  Institution: ${edu.institution || 'Not provided'}\n`;
          textContent += `  Qualification: ${edu.qualification || 'Not provided'}\n`;
          textContent += `  Start Date: ${edu.startDate ? new Date(edu.startDate).toLocaleDateString('en-GB') : 'Not provided'}\n`;
          textContent += `  End Date: ${edu.endDate ? new Date(edu.endDate).toLocaleDateString('en-GB') : 'Not provided'}\n\n`;
        });
      }

      if (employment.length > 0) {
        textContent += `EMPLOYMENT HISTORY\n`;
        textContent += `------------------\n`;
        employment.forEach((emp: any, index: number) => {
          textContent += `Employment ${index + 1}:\n`;
          textContent += `  Position: ${emp.position || 'Not provided'}\n`;
          textContent += `  Employer: ${emp.employer || 'Not provided'}\n`;
          textContent += `  Employer Address: ${emp.employerAddress || 'Not provided'}\n`;
          textContent += `  Employer Postcode: ${emp.employerPostcode || 'Not provided'}\n`;
          textContent += `  Employer Phone: ${emp.employerPhone || 'Not provided'}\n`;
          textContent += `  Start Date: ${emp.startDate ? new Date(emp.startDate).toLocaleDateString('en-GB') : 'Not provided'}\n`;
          textContent += `  End Date: ${emp.endDate ? new Date(emp.endDate).toLocaleDateString('en-GB') : emp.isCurrent ? 'Current Position' : 'Not provided'}\n`;
          textContent += `  Current Position: ${emp.isCurrent ? 'Yes' : 'No'}\n`;
          textContent += `  Duties: ${emp.duties || 'Not provided'}\n`;
          textContent += `  Reason for Leaving: ${emp.reasonForLeaving || 'Not provided'}\n`;
          textContent += `  Reference Name: ${emp.referenceName || 'Not provided'}\n`;
          textContent += `  Reference Email: ${emp.referenceEmail || 'Not provided'}\n`;
          textContent += `  Reference Phone: ${emp.referencePhone || 'Not provided'}\n`;
          textContent += `  Worked with Vulnerable People: ${emp.workedWithVulnerable ? 'Yes' : 'No'}\n\n`;
        });
      }

      if (employmentGaps.length > 0) {
        textContent += `EMPLOYMENT GAPS\n`;
        textContent += `---------------\n`;
        employmentGaps.forEach((gap: any, index: number) => {
          textContent += `Gap ${index + 1}:\n`;
          textContent += `  From: ${gap.startDate ? new Date(gap.startDate).toLocaleDateString('en-GB') : 'Not provided'}\n`;
          textContent += `  To: ${gap.endDate ? new Date(gap.endDate).toLocaleDateString('en-GB') : 'Not provided'}\n`;
          textContent += `  Reason: ${gap.reason || gap.explanation || 'Not provided'}\n\n`;
        });
      }

      textContent += `SKILLS AND QUALIFICATIONS\n`;
      textContent += `-------------------------\n`;
      textContent += `Skills and Experience: ${skills.skills || skillsRaw.skillsAndExperience || 'Not provided'}\n\n`;

      if (references.length > 0) {
        textContent += `REFERENCES\n`;
        textContent += `----------\n`;
        references.forEach((ref: any, index: number) => {
          textContent += `Reference ${index + 1}:\n`;
          textContent += `  Name: ${ref.name || 'Not provided'}\n`;
          textContent += `  Email: ${ref.email || 'Not provided'}\n`;
          textContent += `  Phone: ${ref.phone || 'Not provided'}\n`;
          textContent += `  Employer: ${ref.employer || 'Not provided'}\n`;
          textContent += `  Position: ${ref.position || 'Not provided'}\n`;
          textContent += `  Consent Given: ${ref.consentGiven ? 'Yes' : 'No'}\n\n`;
        });
      }

      textContent += `DISCIPLINARY INFORMATION\n`;
      textContent += `------------------------\n`;
      textContent += `Has Disciplinary Action: ${disciplinary.hasDisciplinary ? 'Yes' : 'No'}\n`;
      if (disciplinary.hasDisciplinary) {
        textContent += `Disciplinary Details: ${disciplinary.disciplinaryDetails || 'Not provided'}\n`;
      }
      textContent += `Has Police Warning: ${disciplinary.hasPoliceWarning ? 'Yes' : 'No'}\n`;
      textContent += `Has Unresolved Charges: ${disciplinary.hasUnresolvedCharges ? 'Yes' : 'No'}\n`;
      textContent += `Has Police Investigation: ${disciplinary.hasPoliceInvestigation ? 'Yes' : 'No'}\n`;
      textContent += `Dismissed for Misconduct: ${disciplinary.hasDismissedForMisconduct ? 'Yes' : 'No'}\n`;
      textContent += `Professional Disqualification: ${disciplinary.hasProfessionalDisqualification ? 'Yes' : 'No'}\n`;
      textContent += `Ongoing Investigation: ${disciplinary.hasOngoingInvestigation ? 'Yes' : 'No'}\n`;
      textContent += `Has Prohibition: ${disciplinary.hasProhibition ? 'Yes' : 'No'}\n`;
      if (disciplinary.criminalDetails) {
        textContent += `Criminal Details: ${disciplinary.criminalDetails}\n`;
      }
      textContent += `\n`;

      textContent += `PRIVACY NOTICE\n`;
      textContent += `--------------\n`;
      textContent += `Privacy Notice Acknowledged: ${privacyNotice.acknowledged ? 'Yes' : 'No'}\n`;
      textContent += `Privacy Notice Date: ${privacyNotice.acknowledgedDate ? new Date(privacyNotice.acknowledgedDate).toLocaleDateString('en-GB') : 'Not provided'}\n\n`;

      textContent += `DECLARATION\n`;
      textContent += `-----------\n`;
      textContent += `Full Name: ${dataProtection.fullName || 'Not provided'}\n`;
      textContent += `Signature Confirmed: ${dataProtection.signatureConfirmation ? 'Yes' : 'No'}\n`;
      textContent += `Data Protection Agreement: ${dataProtection.dataProtectionAgreement ? 'Agreed' : 'Not agreed'}\n`;
      textContent += `Date Signed: ${dataProtection.signedDate ? new Date(dataProtection.signedDate).toLocaleDateString('en-GB') : 'Not provided'}\n\n`;

      textContent += `---\n`;
      textContent += `This application was completed and downloaded on ${new Date().toLocaleDateString('en-GB')} at ${new Date().toLocaleTimeString('en-GB')}.`;

      // Create and download text file
      const firstName = personalInfo?.firstName || 'applicant';
      const lastName = personalInfo?.lastName || applicantId;
      const fileName = `swiis-application-${firstName}-${lastName}-${new Date().toISOString().split('T')[0]}.txt`;
      
      // Try multiple download methods for better compatibility
      try {
        // Method 1: Blob download
        const textBlob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
        
        if (window.navigator && (window.navigator as any).msSaveOrOpenBlob) {
          // For IE/Edge
          (window.navigator as any).msSaveOrOpenBlob(textBlob, fileName);
        } else {
          // For modern browsers
          const url = URL.createObjectURL(textBlob);
          const link = document.createElement('a');
          link.href = url;
          link.download = fileName;
          link.style.display = 'none';
          document.body.appendChild(link);
          link.click();
          
          // Clean up
          setTimeout(() => {
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
          }, 100);
        }
      } catch (blobError) {
        console.error('Blob download failed:', blobError);
        
        // Method 2: Data URL fallback
        try {
          const dataUrl = 'data:text/plain;charset=utf-8,' + encodeURIComponent(textContent);
          const link = document.createElement('a');
          link.href = dataUrl;
          link.download = fileName;
          link.style.display = 'none';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } catch (dataUrlError) {
          console.error('Data URL download failed:', dataUrlError);
          
          // Method 3: Open in new window as last resort
          const newWindow = window.open('', '_blank');
          if (newWindow) {
            newWindow.document.write('<pre>' + textContent.replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</pre>');
            newWindow.document.title = fileName;
          } else {
            throw new Error('All download methods failed');
          }
        }
      }

      toast({
        title: "Download Complete",
        description: "Your application has been downloaded as a text file. You can open it in any text editor or word processor.",
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Download Error", 
        description: "There was a problem downloading your application. Please try again or contact support.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-10">
              <div className="flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-green-800 mb-4">Application Submitted!</h1>
              <p className="text-lg text-green-700 text-center mb-6 max-w-2xl">
                Thank you for submitting your application to Swiis. We have received your complete application 
                and will review it carefully. You will receive confirmation and next steps via email within 2-3 business days.
              </p>
              <div className="flex gap-4">
                <Button 
                  onClick={handleDownloadPDF}
                  disabled={isDownloading}
                  variant="outline"
                  className="border-green-600 text-green-600 hover:bg-green-50"
                >
                  <Download className="mr-2 h-4 w-4" />
                  {isDownloading ? "Downloading..." : "Download Application Data"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="border-orange-200 bg-orange-50">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-10">
            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-orange-100 mb-6">
              <CheckCircle className="h-12 w-12 text-orange-600" />
            </div>
            <h1 className="text-3xl font-bold text-orange-800 mb-4">Application Complete</h1>
            <p className="text-lg text-orange-700 text-center mb-8 max-w-2xl">
              Congratulations! You have successfully completed all sections of your Swiis application. 
              Please review your information and submit your application when ready.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
              <Button 
                onClick={handleDownloadPDF}
                disabled={isDownloading}
                variant="outline"
                className="flex-1 border-orange-600 text-orange-600 hover:bg-orange-50"
              >
                <Download className="mr-2 h-4 w-4" />
                {isDownloading ? "Downloading..." : "Download PDF"}
              </Button>
              
              <Button 
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 bg-orange-600 hover:bg-orange-700 text-white"
              >
                <Send className="mr-2 h-4 w-4" />
                {isSubmitting ? "Submitting..." : "Submit Application"}
              </Button>
            </div>
            
            <div className="mt-6">
              <Button 
                variant="ghost" 
                onClick={onBack}
                className="text-orange-600 hover:text-orange-700"
              >
                ← Back to Previous Section
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}