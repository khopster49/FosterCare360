import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight } from "lucide-react";
import swiisLogo from "@assets/Picture3.jpg";

const steps = [
  { id: 1, title: "Privacy Notice", description: "Data protection information" },
  { id: 2, title: "Personal Information", description: "Basic personal details" },
  { id: 3, title: "Education History", description: "Educational background" },
  { id: 4, title: "Employment History", description: "Work experience" },
  { id: 5, title: "Skills & Experience", description: "Relevant skills" },
  { id: 6, title: "References", description: "Professional references" },
  { id: 7, title: "Disciplinary Questions", description: "Background questions" },
  { id: 8, title: "Declaration", description: "Final acknowledgment" },
];

export default function WorkingApplicationForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsComplete(true);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center">
              <img src={swiisLogo} alt="Swiis Foster Care" className="h-8 w-auto mr-2" />
              <h1 className="text-2xl font-bold text-orange-900">Swiis Foster Care</h1>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-orange-900 mb-4">
                Application Complete!
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-gray-700 mb-6">
                Thank you for completing your staff application. We will review your submission and contact you soon.
              </p>
              <Button 
                onClick={() => window.location.href = '/'}
                className="bg-orange-600 hover:bg-orange-700"
              >
                Return to Home
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center">
            <img src={swiisLogo} alt="Swiis Foster Care" className="h-8 w-auto mr-2" />
            <h1 className="text-2xl font-bold text-orange-900">Swiis Foster Care</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Section */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-center mb-2">
              <CardTitle className="text-lg">Application Progress</CardTitle>
              <span className="text-sm text-gray-600">
                Step {currentStep + 1} of {steps.length}
              </span>
            </div>
            <Progress value={progress} className="mb-2" />
            <p className="text-sm text-gray-600">{steps[currentStep].title}</p>
          </CardHeader>
        </Card>

        {/* Step Navigation */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`flex flex-col items-center min-w-0 px-3 py-2 rounded-lg ${
                  index === currentStep
                    ? 'bg-orange-600 text-white'
                    : index < currentStep
                    ? 'bg-orange-200 text-orange-800'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                <div className="w-6 h-6 rounded-full bg-current bg-opacity-20 flex items-center justify-center text-xs font-semibold mb-1">
                  {step.id}
                </div>
                <span className="text-xs text-center whitespace-nowrap">{step.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Current Step Content */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-orange-900">
              {steps[currentStep].title}
            </CardTitle>
            <p className="text-gray-600">{steps[currentStep].description}</p>
          </CardHeader>
          <CardContent>
            <div className="min-h-[300px] flex flex-col justify-center">
              {currentStep === 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-orange-800">Data Protection Privacy Notice</h3>
                  <p className="text-gray-700">
                    This notice explains how we collect, use, and protect your personal information during the recruitment process.
                    Please read carefully before proceeding.
                  </p>
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-700">
                      By continuing, you acknowledge that you have read and understood our privacy notice
                      and consent to the processing of your personal data for recruitment purposes.
                    </p>
                  </div>
                </div>
              )}

              {currentStep === 1 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-orange-800">Personal Information</h3>
                  <p className="text-gray-700">
                    We'll collect your basic personal details including name, contact information, and position applied for.
                  </p>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-orange-800">Education History</h3>
                  <p className="text-gray-700">
                    Please provide details of your educational background, qualifications, and training.
                  </p>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-orange-800">Employment History</h3>
                  <p className="text-gray-700">
                    Details of your work experience, including current and previous positions, responsibilities, and employment gaps.
                  </p>
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-orange-800">Skills & Experience</h3>
                  <p className="text-gray-700">
                    Tell us about your relevant skills, experience, and what makes you suitable for this role.
                  </p>
                </div>
              )}

              {currentStep === 5 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-orange-800">References</h3>
                  <p className="text-gray-700">
                    Please provide professional references who can speak to your character and work performance.
                  </p>
                </div>
              )}

              {currentStep === 6 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-orange-800">Disciplinary Questions</h3>
                  <p className="text-gray-700">
                    Background questions regarding any disciplinary actions, criminal convictions, or other relevant matters.
                  </p>
                </div>
              )}

              {currentStep === 7 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-orange-800">Declaration</h3>
                  <p className="text-gray-700">
                    Final declaration confirming the accuracy of the information provided and agreement to terms.
                  </p>
                </div>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <Button
                onClick={prevStep}
                disabled={currentStep === 0}
                variant="outline"
                className="flex items-center"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>

              <Button
                onClick={nextStep}
                className="bg-orange-600 hover:bg-orange-700 flex items-center"
              >
                {currentStep === steps.length - 1 ? 'Complete Application' : 'Continue'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}