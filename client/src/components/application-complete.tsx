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
      // Collect all application data from localStorage
      const personalInfo = JSON.parse(localStorage.getItem(`personal_info_${applicantId}`) || '{}');
      const education = JSON.parse(localStorage.getItem(`education_${applicantId}`) || '[]');
      const employment = JSON.parse(localStorage.getItem(`employment_${applicantId}`) || '[]');
      const skills = JSON.parse(localStorage.getItem(`skills_${applicantId}`) || '{}');
      const references = JSON.parse(localStorage.getItem(`references_${applicantId}`) || '[]');
      const disciplinary = JSON.parse(localStorage.getItem(`disciplinary_${applicantId}`) || '{}');
      const verification = JSON.parse(localStorage.getItem(`verification_${applicantId}`) || '{}');
      const dataProtection = JSON.parse(localStorage.getItem(`data_protection_${applicantId}`) || '{}');
      const gaps = JSON.parse(localStorage.getItem(`employment_gaps_${applicantId}`) || '[]');

      // Format the data into a readable HTML document
      const formatDate = (dateStr: string) => {
        if (!dateStr) return 'Not provided';
        return new Date(dateStr).toLocaleDateString('en-GB');
      };

      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Swiis Staff Application</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
            h1 { color: #D97706; border-bottom: 2px solid #D97706; padding-bottom: 10px; }
            h2 { color: #D97706; margin-top: 30px; }
            .section { margin-bottom: 30px; }
            .field { margin-bottom: 10px; }
            .label { font-weight: bold; color: #374151; }
            .value { margin-left: 20px; }
            .employment-entry, .education-entry { border: 1px solid #E5E7EB; padding: 15px; margin: 10px 0; }
            .signature { max-width: 200px; border: 1px solid #ccc; }
          </style>
        </head>
        <body>
          <h1>Swiis Staff Application Form</h1>
          <p><strong>Application Date:</strong> ${new Date().toLocaleDateString('en-GB')}</p>
          
          <div class="section">
            <h2>Personal Information</h2>
            <div class="field"><span class="label">Title:</span> <span class="value">${personalInfo.title || 'Not provided'}</span></div>
            <div class="field"><span class="label">First Name:</span> <span class="value">${personalInfo.firstName || 'Not provided'}</span></div>
            <div class="field"><span class="label">Middle Name:</span> <span class="value">${personalInfo.middleName || 'Not provided'}</span></div>
            <div class="field"><span class="label">Last Name:</span> <span class="value">${personalInfo.lastName || 'Not provided'}</span></div>
            <div class="field"><span class="label">Previous Name:</span> <span class="value">${personalInfo.previousName || 'Not provided'}</span></div>
            <div class="field"><span class="label">Date of Birth:</span> <span class="value">${formatDate(personalInfo.dateOfBirth)}</span></div>
            <div class="field"><span class="label">National Insurance Number:</span> <span class="value">${personalInfo.nationalInsuranceNumber || 'Not provided'}</span></div>
            <div class="field"><span class="label">Address:</span> <span class="value">${personalInfo.address || 'Not provided'}</span></div>
            <div class="field"><span class="label">Postcode:</span> <span class="value">${personalInfo.postcode || 'Not provided'}</span></div>
            <div class="field"><span class="label">Phone:</span> <span class="value">${personalInfo.phone || 'Not provided'}</span></div>
            <div class="field"><span class="label">Email:</span> <span class="value">${personalInfo.email || 'Not provided'}</span></div>
            <div class="field"><span class="label">Emergency Contact:</span> <span class="value">${personalInfo.emergencyContactName || 'Not provided'}</span></div>
            <div class="field"><span class="label">Emergency Contact Phone:</span> <span class="value">${personalInfo.emergencyContactPhone || 'Not provided'}</span></div>
          </div>

          <div class="section">
            <h2>Education</h2>
            ${education.map((edu: any, index: number) => `
              <div class="education-entry">
                <h3>Education ${index + 1}</h3>
                <div class="field"><span class="label">Institution:</span> <span class="value">${edu.institution || 'Not provided'}</span></div>
                <div class="field"><span class="label">Qualification:</span> <span class="value">${edu.qualification || 'Not provided'}</span></div>
                <div class="field"><span class="label">Start Date:</span> <span class="value">${formatDate(edu.startDate)}</span></div>
                <div class="field"><span class="label">End Date:</span> <span class="value">${formatDate(edu.endDate)}</span></div>
              </div>
            `).join('')}
          </div>

          <div class="section">
            <h2>Employment History</h2>
            ${employment.map((emp: any, index: number) => `
              <div class="employment-entry">
                <h3>Employment ${index + 1}</h3>
                <div class="field"><span class="label">Job Title:</span> <span class="value">${emp.jobTitle || 'Not provided'}</span></div>
                <div class="field"><span class="label">Employer:</span> <span class="value">${emp.employer || 'Not provided'}</span></div>
                <div class="field"><span class="label">Start Date:</span> <span class="value">${formatDate(emp.startDate)}</span></div>
                <div class="field"><span class="label">End Date:</span> <span class="value">${formatDate(emp.endDate)}</span></div>
                <div class="field"><span class="label">Reason for Leaving:</span> <span class="value">${emp.reasonForLeaving || 'Not provided'}</span></div>
                <div class="field"><span class="label">Referee Name:</span> <span class="value">${emp.refereeName || 'Not provided'}</span></div>
                <div class="field"><span class="label">Referee Position:</span> <span class="value">${emp.refereePosition || 'Not provided'}</span></div>
                <div class="field"><span class="label">Referee Contact:</span> <span class="value">${emp.refereeContact || 'Not provided'}</span></div>
              </div>
            `).join('')}
          </div>

          ${gaps.length > 0 ? `
          <div class="section">
            <h2>Employment Gaps</h2>
            ${gaps.map((gap: any, index: number) => `
              <div class="field">
                <span class="label">Gap ${index + 1}:</span> 
                <span class="value">${formatDate(gap.startDate)} to ${formatDate(gap.endDate)} - ${gap.reason || 'Not provided'}</span>
              </div>
            `).join('')}
          </div>
          ` : ''}

          <div class="section">
            <h2>Skills and Qualifications</h2>
            <div class="field"><span class="label">Skills:</span> <span class="value">${skills.skills || 'Not provided'}</span></div>
            <div class="field"><span class="label">Additional Qualifications:</span> <span class="value">${skills.additionalQualifications || 'Not provided'}</span></div>
          </div>

          <div class="section">
            <h2>Disciplinary Information</h2>
            <div class="field"><span class="label">Criminal Convictions:</span> <span class="value">${disciplinary.hasCriminalConvictions ? 'Yes' : 'No'}</span></div>
            ${disciplinary.hasCriminalConvictions ? `<div class="field"><span class="label">Details:</span> <span class="value">${disciplinary.criminalConvictionsDetails || 'Not provided'}</span></div>` : ''}
            <div class="field"><span class="label">Disciplinary Action:</span> <span class="value">${disciplinary.hasDisciplinaryAction ? 'Yes' : 'No'}</span></div>
            ${disciplinary.hasDisciplinaryAction ? `<div class="field"><span class="label">Details:</span> <span class="value">${disciplinary.disciplinaryActionDetails || 'Not provided'}</span></div>` : ''}
          </div>

          <div class="section">
            <h2>Declaration</h2>
            <div class="field"><span class="label">Full Name:</span> <span class="value">${dataProtection.fullName || 'Not provided'}</span></div>
            <div class="field"><span class="label">Signature Confirmed:</span> <span class="value">${dataProtection.signatureConfirmation ? 'Yes' : 'No'}</span></div>
            <div class="field"><span class="label">Data Protection Agreement:</span> <span class="value">${dataProtection.dataProtectionAgreement ? 'Agreed' : 'Not agreed'}</span></div>
            <div class="field"><span class="label">Date Signed:</span> <span class="value">${formatDate(dataProtection.signedDate)}</span></div>
          </div>

          <p style="margin-top: 40px; font-style: italic; color: #6B7280;">
            This application was completed and downloaded on ${new Date().toLocaleDateString('en-GB')} at ${new Date().toLocaleTimeString('en-GB')}.
          </p>
        </body>
        </html>
      `;

      // Create and download HTML file
      const htmlBlob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(htmlBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `swiis-application-${personalInfo.firstName || 'applicant'}-${personalInfo.lastName || applicantId}-${new Date().toISOString().split('T')[0]}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Download Complete",
        description: "Your application has been downloaded as an HTML file. You can open it in any browser or convert it to PDF.",
      });
    } catch (error) {
      toast({
        title: "Download Error",
        description: "There was a problem downloading your application. Please try again.",
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