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
      const equalOpportunities = JSON.parse(localStorage.getItem(`equal_opportunities_${applicantId}`) || '{}');
      const privacyNotice = JSON.parse(localStorage.getItem(`privacy_notice_${applicantId}`) || '{}');

      // Create a simple text-based summary for download
      const applicationData = {
        personalInfo,
        education,
        employment,
        skills,
        references,
        disciplinary,
        verification,
        dataProtection,
        equalOpportunities,
        privacyNotice,
        submittedAt: new Date().toISOString()
      };

      // Create and download a JSON file with the application data
      const dataStr = JSON.stringify(applicationData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `swiis-application-${applicantId}-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Download Started",
        description: "Your application data has been downloaded as a JSON file.",
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