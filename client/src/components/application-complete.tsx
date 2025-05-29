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
      // Collect all application data from localStorage - check different possible key formats
      const personalInfo = JSON.parse(
        localStorage.getItem(`personal_info_${applicantId}`) || 
        localStorage.getItem(`personalInfo_${applicantId}`) || 
        localStorage.getItem('personalInfo') || 
        '{}'
      );
      const education = JSON.parse(
        localStorage.getItem(`education_${applicantId}`) || 
        localStorage.getItem(`educationEntries_${applicantId}`) || 
        localStorage.getItem('education') || 
        '[]'
      );
      const employment = JSON.parse(
        localStorage.getItem(`employment_${applicantId}`) || 
        localStorage.getItem(`employmentEntries_${applicantId}`) || 
        localStorage.getItem('employment') || 
        '[]'
      );
      const skills = JSON.parse(
        localStorage.getItem(`skills_${applicantId}`) || 
        localStorage.getItem(`skillsAndQualifications_${applicantId}`) || 
        localStorage.getItem('skills') || 
        '{}'
      );
      const references = JSON.parse(
        localStorage.getItem(`references_${applicantId}`) || 
        localStorage.getItem(`referenceConsent_${applicantId}`) || 
        localStorage.getItem('references') || 
        '[]'
      );
      const disciplinary = JSON.parse(
        localStorage.getItem(`disciplinary_${applicantId}`) || 
        localStorage.getItem(`disciplinaryInfo_${applicantId}`) || 
        localStorage.getItem('disciplinary') || 
        '{}'
      );
      const verification = JSON.parse(
        localStorage.getItem(`verification_${applicantId}`) || 
        localStorage.getItem(`verificationChecks_${applicantId}`) || 
        localStorage.getItem('verification') || 
        '{}'
      );
      const dataProtection = JSON.parse(localStorage.getItem(`data_protection_${applicantId}`) || '{}');
      const gaps = JSON.parse(
        localStorage.getItem(`employment_gaps_${applicantId}`) || 
        localStorage.getItem(`employmentGaps_${applicantId}`) || 
        localStorage.getItem('gaps') || 
        '[]'
      );

      // Debug: Log what data we found
      console.log('Personal Info:', personalInfo);
      console.log('Education:', education);
      console.log('Employment:', employment);
      console.log('Skills:', skills);
      console.log('References:', references);
      console.log('Disciplinary:', disciplinary);
      console.log('Data Protection:', dataProtection);

      // Create a simple text summary
      let textContent = `SWIIS STAFF APPLICATION FORM\n`;
      textContent += `=====================================\n\n`;
      textContent += `Application Date: ${new Date().toLocaleDateString('en-GB')}\n\n`;
      
      textContent += `PERSONAL INFORMATION\n`;
      textContent += `-------------------\n`;
      textContent += `Title: ${personalInfo.title || 'Not provided'}\n`;
      textContent += `First Name: ${personalInfo.firstName || 'Not provided'}\n`;
      textContent += `Middle Name: ${personalInfo.middleName || 'Not provided'}\n`;
      textContent += `Last Name: ${personalInfo.lastName || 'Not provided'}\n`;
      textContent += `Previous Name: ${personalInfo.previousName || 'Not provided'}\n`;
      textContent += `Date of Birth: ${personalInfo.dateOfBirth ? new Date(personalInfo.dateOfBirth).toLocaleDateString('en-GB') : 'Not provided'}\n`;
      textContent += `National Insurance Number: ${personalInfo.nationalInsuranceNumber || 'Not provided'}\n`;
      textContent += `Address: ${personalInfo.address || 'Not provided'}\n`;
      textContent += `Postcode: ${personalInfo.postcode || 'Not provided'}\n`;
      textContent += `Phone: ${personalInfo.phone || 'Not provided'}\n`;
      textContent += `Email: ${personalInfo.email || 'Not provided'}\n`;
      textContent += `Emergency Contact: ${personalInfo.emergencyContactName || 'Not provided'}\n`;
      textContent += `Emergency Contact Phone: ${personalInfo.emergencyContactPhone || 'Not provided'}\n\n`;

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
          textContent += `  Job Title: ${emp.jobTitle || 'Not provided'}\n`;
          textContent += `  Employer: ${emp.employer || 'Not provided'}\n`;
          textContent += `  Start Date: ${emp.startDate ? new Date(emp.startDate).toLocaleDateString('en-GB') : 'Not provided'}\n`;
          textContent += `  End Date: ${emp.endDate ? new Date(emp.endDate).toLocaleDateString('en-GB') : 'Not provided'}\n`;
          textContent += `  Reason for Leaving: ${emp.reasonForLeaving || 'Not provided'}\n`;
          textContent += `  Referee Name: ${emp.refereeName || 'Not provided'}\n`;
          textContent += `  Referee Position: ${emp.refereePosition || 'Not provided'}\n`;
          textContent += `  Referee Contact: ${emp.refereeContact || 'Not provided'}\n\n`;
        });
      }

      if (gaps.length > 0) {
        textContent += `EMPLOYMENT GAPS\n`;
        textContent += `---------------\n`;
        gaps.forEach((gap: any, index: number) => {
          textContent += `Gap ${index + 1}: ${gap.startDate ? new Date(gap.startDate).toLocaleDateString('en-GB') : 'Not provided'} to ${gap.endDate ? new Date(gap.endDate).toLocaleDateString('en-GB') : 'Not provided'} - ${gap.reason || 'Not provided'}\n`;
        });
        textContent += `\n`;
      }

      textContent += `SKILLS AND QUALIFICATIONS\n`;
      textContent += `-------------------------\n`;
      textContent += `Skills: ${skills.skills || 'Not provided'}\n`;
      textContent += `Additional Qualifications: ${skills.additionalQualifications || 'Not provided'}\n\n`;

      textContent += `DISCIPLINARY INFORMATION\n`;
      textContent += `------------------------\n`;
      textContent += `Criminal Convictions: ${disciplinary.hasCriminalConvictions ? 'Yes' : 'No'}\n`;
      if (disciplinary.hasCriminalConvictions) {
        textContent += `Details: ${disciplinary.criminalConvictionsDetails || 'Not provided'}\n`;
      }
      textContent += `Disciplinary Action: ${disciplinary.hasDisciplinaryAction ? 'Yes' : 'No'}\n`;
      if (disciplinary.hasDisciplinaryAction) {
        textContent += `Details: ${disciplinary.disciplinaryActionDetails || 'Not provided'}\n`;
      }
      textContent += `\n`;

      textContent += `DECLARATION\n`;
      textContent += `-----------\n`;
      textContent += `Full Name: ${dataProtection.fullName || 'Not provided'}\n`;
      textContent += `Signature Confirmed: ${dataProtection.signatureConfirmation ? 'Yes' : 'No'}\n`;
      textContent += `Data Protection Agreement: ${dataProtection.dataProtectionAgreement ? 'Agreed' : 'Not agreed'}\n`;
      textContent += `Date Signed: ${dataProtection.signedDate ? new Date(dataProtection.signedDate).toLocaleDateString('en-GB') : 'Not provided'}\n\n`;

      textContent += `---\n`;
      textContent += `This application was completed and downloaded on ${new Date().toLocaleDateString('en-GB')} at ${new Date().toLocaleTimeString('en-GB')}.`;

      // Create and download text file
      const fileName = `swiis-application-${personalInfo.firstName || 'applicant'}-${personalInfo.lastName || applicantId}-${new Date().toISOString().split('T')[0]}.txt`;
      
      const textBlob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(textBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

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