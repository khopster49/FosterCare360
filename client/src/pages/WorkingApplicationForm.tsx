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
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-orange-800">Data Protection Privacy Notice</h3>
                  
                  <div className="prose prose-sm max-w-none">
                    <p className="text-gray-700 mb-4">
                      This notice explains what personal data (information) we will hold about you, how we collect it, and how we will use 
                      and may share information about you during the application process. We are required to notify you of this information, 
                      under data protection legislation.
                    </p>
                    
                    <h4 className="text-md font-semibold text-orange-700 mt-6 mb-3">Who collects the information</h4>
                    <p className="text-gray-700 mb-4">
                      Swiis Foster Care ('Company') is a 'data controller' and gathers and uses certain information about you. This information is also 
                      used by our affiliated entities and group companies, namely Swiis UK Ltd, Swiis Foster Care Ltd, Swiis Foster Care 
                      Scotland Ltd.
                    </p>

                    <h4 className="text-md font-semibold text-orange-700 mt-6 mb-3">About the information we collect and hold</h4>
                    <p className="text-gray-700 mb-2">
                      We may collect the following information up to and including the shortlisting stage of the recruitment process:
                    </p>
                    <ul className="list-disc ml-6 mb-4 text-gray-700 space-y-1">
                      <li>Your name and contact details (i.e. address, home and mobile phone numbers, email address)</li>
                      <li>Details of your qualifications, experience, employment history and interests</li>
                      <li>Your racial or ethnic origin, sex and sexual orientation, religious or similar beliefs</li>
                      <li>Information regarding your criminal record</li>
                      <li>Details of your referees</li>
                      <li>Information about your health, including any medical condition for adjustments needed in the recruitment process</li>
                    </ul>

                    <h4 className="text-md font-semibold text-orange-700 mt-6 mb-3">How we use your information</h4>
                    <p className="text-gray-700 mb-4">
                      We will typically collect and use this information for the following purposes: to take steps to enter into a contract, 
                      for compliance with legal obligations, for the performance of tasks carried out in the public interest, 
                      and for our legitimate interests in the recruitment process.
                    </p>

                    <h4 className="text-md font-semibold text-orange-700 mt-6 mb-3">Your rights</h4>
                    <p className="text-gray-700 mb-4">
                      Please contact our HR Team at HRTeam@swiis.com or 0203 219 2865 if you would like to correct or request access to 
                      information that we hold relating to you or if you have any questions about this notice.
                    </p>
                  </div>

                  <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <input 
                        type="checkbox" 
                        id="privacy-acknowledge" 
                        className="mt-1 h-4 w-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500" 
                        required
                      />
                      <label htmlFor="privacy-acknowledge" className="text-sm text-gray-700 leading-relaxed">
                        <strong>I acknowledge that I have read and understood the privacy notice.</strong>
                        <br />
                        By checking this box, I consent to the processing of my personal data for recruitment purposes as described above.
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 1 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-orange-800">Personal Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Position Applied For</label>
                      <input 
                        type="text" 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="Enter the position you are applying for"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
                        <option value="">Select title</option>
                        <option value="mr">Mr</option>
                        <option value="mrs">Mrs</option>
                        <option value="miss">Miss</option>
                        <option value="ms">Ms</option>
                        <option value="dr">Dr</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Pronouns</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
                        <option value="">Select pronouns</option>
                        <option value="she/her">She/Her</option>
                        <option value="he/him">He/Him</option>
                        <option value="they/them">They/Them</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                      <input 
                        type="text" 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="John"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Middle Name(s)</label>
                      <input 
                        type="text" 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="Optional"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Surname</label>
                      <input 
                        type="text" 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="Smith"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                      <input 
                        type="email" 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="john.smith@example.com"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Have you ever been known by any other name?</label>
                      <input 
                        type="text" 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="Enter previous names if applicable"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Permanent Address</label>
                      <textarea 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        rows={3}
                        placeholder="123 Main Street, City"
                      ></textarea>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Post Code</label>
                      <input 
                        type="text" 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="SW1A 1AA"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Home Telephone Number</label>
                      <input 
                        type="tel" 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="020 XXXX XXXX"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Telephone Number</label>
                      <input 
                        type="tel" 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="07XX XXX XXXX"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nationality</label>
                      <input 
                        type="text" 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="British"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Do you hold a full current driving licence?</label>
                      <div className="flex items-center space-x-4">
                        <label className="flex items-center">
                          <input type="radio" name="driving-licence" value="yes" className="mr-2 text-orange-600" />
                          Yes
                        </label>
                        <label className="flex items-center">
                          <input type="radio" name="driving-licence" value="no" className="mr-2 text-orange-600" />
                          No
                        </label>
                      </div>
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">How did you hear about us?</label>
                      <textarea 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        rows={2}
                        placeholder="Please let us know how you found out about this opportunity"
                      ></textarea>
                    </div>
                  </div>
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