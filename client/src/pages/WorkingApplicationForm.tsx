import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
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
  const [submittedApplicationId, setSubmittedApplicationId] = useState<number | null>(null);
  const { toast } = useToast();

  // Form data state
  const [formData, setFormData] = useState({
    // Personal Information
    title: '',
    firstName: '',
    middleName: '',
    lastName: '',
    preferredName: '',
    dateOfBirth: '',
    nationalInsuranceNumber: '',
    address: '',
    postcode: '',
    phoneNumber: '',
    mobileNumber: '',
    email: '',
    rightToWork: '',
    workDocumentType: '',
    dbsRegistered: '',
    dbsCertificateNumber: '',
    dbsIssuedDate: '',
    professionalRegistration: '',
    professionalBody: '',
    professionalNumber: '',
    professionalExpiryDate: '',
    
    // Education (will be stored separately)
    education: [],
    
    // Employment (will be stored separately)
    employment: [],
    
    // Skills
    skills: '',
    
    // References
    references: '',
    
    // Disciplinary
    criminalConvictions: false,
    criminalConvictionsDetails: '',
    disciplinaryAction: false,
    disciplinaryActionDetails: '',
    safeguardingConcerns: false,
    safeguardingConcernsDetails: '',
    
    // Declaration
    declaration: false,
    signature: '',
    signatureDate: ''
  });

  // Submit application mutation
  const submitApplication = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch('/api/applications/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit application');
      }
      
      return response.json();
    },
    onSuccess: (result) => {
      setSubmittedApplicationId(result.id);
      setIsComplete(true);
      toast({
        title: "Application Submitted",
        description: "Your application has been successfully submitted."
      });
    },
    onError: (error) => {
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Helper function to update form data
  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const nextStep = () => {
    console.log('Next step clicked, current step:', currentStep);
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      console.log('Moving to step:', currentStep + 1);
    } else {
      // Submit the application
      submitApplication.mutate(formData);
      console.log('Application submitted');
    }
  };

  const prevStep = () => {
    console.log('Previous step clicked, current step:', currentStep);
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      console.log('Moving to step:', currentStep - 1);
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
              <button
                key={step.id}
                onClick={() => setCurrentStep(index)}
                className={`flex flex-col items-center min-w-0 px-3 py-2 rounded-lg transition-colors hover:opacity-80 ${
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
                <span className="text-xs text-center break-words max-w-20 leading-tight">{step.title}</span>
              </button>
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
                <div className="space-y-6 max-w-none">
                  <h3 className="text-2xl font-bold text-orange-800 mb-4">Data Protection Privacy Notice (Recruitment)</h3>
                  
                  <div className="space-y-6 text-gray-700 text-sm leading-relaxed max-h-96 overflow-y-auto border border-gray-200 p-4 rounded-lg">
                    <p>
                      This notice explains what personal data (information) we will hold about you, how we collect it, and how we will use 
                      and may share information about you during the application process. We are required to notify you of this information, 
                      under data protection legislation. Please ensure that you read this notice (sometimes referred to as a 'privacy notice') 
                      and any other similar notice we may provide to you from time to time when we collect or process personal information 
                      about you.
                    </p>
                    
                    <div>
                      <h4 className="text-lg font-semibold text-orange-600 mb-2">Who collects the information</h4>
                      <p>
                        Swiis Foster Care ('Company') is a 'data controller' and gathers and uses certain information about you. This information is also 
                        used by our affiliated entities and group companies, namely Swiis UK Ltd, Swiis Foster Care Ltd, Swiis Foster Care 
                        Scotland Ltd, (our 'group companies') and so, in this notice, references to 'we' or 'us' mean the Company and our 
                        group companies.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="text-lg font-semibold text-orange-600 mb-2">Data protection principles</h4>
                      <p>
                        We will comply with the data protection principles when gathering and using personal information, as set out in our 
                        GDPR Data Protection Policy and GDPR Data Retention Policy.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="text-lg font-semibold text-orange-600 mb-2">About the information we collect and hold</h4>
                      <h5 className="font-medium mb-2">What information</h5>
                      <p className="mb-2">
                        We may collect the following information up to and including the shortlisting stage of the recruitment process:
                      </p>
                      <ul className="list-disc ml-6 mb-4 space-y-1">
                        <li>Your name and contact details (i.e. address, home and mobile phone numbers, email address)</li>
                        <li>Details of your qualifications, experience, employment history (including job titles, salary and working hours) and interests</li>
                        <li>Your racial or ethnic origin, sex and sexual orientation, religious or similar beliefs</li>
                        <li>Information regarding your criminal record</li>
                        <li>Details of your referees</li>
                        <li>Information about your health, including any medical condition, health, and sickness records for the purposes of establishing if any adjustments need to be made to the recruitment process</li>
                      </ul>
                      
                      <p className="mb-2">
                        We may collect the following information after the shortlisting stage, and before making a final decision to recruit:
                      </p>
                      <ul className="list-disc ml-6 mb-4 space-y-1">
                        <li>Information about your previous academic and/or employment history, including details of any conduct, grievance or performance issues, appraisals, time and attendance and references obtained about you from previous employers and/or education providers</li>
                        <li>Information regarding your academic and professional qualifications</li>
                        <li>Information regarding your criminal record, in criminal records certificates and enhanced criminal records certificates (DBS)</li>
                        <li>Your nationality and immigration status and information from related documents, such as your passport or other identification and immigration information</li>
                        <li>A copy of your driving licence</li>
                        <li>Information about your health, including any medical condition, health and sickness records for the purposes of assessing the ability to carry out intrinsic elements of the role</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-orange-600 mb-2">How we collect the information</h4>
                      <p>
                        We may collect this information from you, your referees (details of whom you will have provided), your education provider, the relevant professional body, The Disclosure and Barring Service (DBS), the Home Office.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="text-lg font-semibold text-orange-600 mb-2">Why we collect the information and how we use it</h4>
                      <p className="mb-2">
                        We will typically collect and use this information for the following purposes (other purposes that may also apply are explained in our GDPR Data Protection Policy):
                      </p>
                      <ul className="list-disc ml-6 mb-4 space-y-1">
                        <li>to take steps to enter into a contract</li>
                        <li>for compliance with a legal obligation (e.g. our obligation to check that you are eligible to work in the United Kingdom)</li>
                        <li>for the performance of a task carried out in the public interest</li>
                        <li>for the purposes of our legitimate interests or those of a relevant third party (such as a benefits provider), but only if these are not overridden by your interests, rights or freedoms</li>
                        <li>because it is necessary for carrying out obligations or exercising rights in employment law</li>
                        <li>(i.e. equality of opportunity or treatment, promoting or retaining racial and ethnic diversity at senior level, preventing or detecting unlawful acts); and</li>
                        <li>to establish, exercise and/or defend any legal claims that may be brought by or against us in connection with your recruitment</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-orange-600 mb-2">How we may share the information</h4>
                      <p>
                        We may also need to share some of the above categories of personal information with other parties, such as HR consultants and professional advisers. Usually, information will be anonymised but this may not always be possible. The recipient of the information will be bound by confidentiality obligations. We may also be required to share some personal information with our regulators or as required to comply with the law.
                      </p>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-orange-600 mb-2">Sensitive personal information and criminal records information</h4>
                      <p>
                        Further details on how we handle sensitive personal information and information relating to criminal convictions and offences are set out in our Criminal Convictions Policy and GDPR Retention Policy, which are available from the HR Team.
                      </p>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-orange-600 mb-2">Where information may be held</h4>
                      <p>
                        Information may be held at our offices and those of our group companies, and third party agencies, service providers, representatives and agents as described above.
                      </p>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-orange-600 mb-2">How long we keep your information</h4>
                      <p className="mb-2">
                        We keep the personal information that we obtain about you during the recruitment process for no longer than is necessary for the purposes for which it is processed. How long we keep your information will depend on whether your application is successful and you become employed by us, the nature of the information concerned and the purposes for which it is processed.
                      </p>
                      <p>
                        We will keep recruitment information (including interview notes) for no longer than is reasonable, taking into account the limitation periods for potential claims such as race or sex discrimination (as extended to take account of early conciliation), after which they will be destroyed.
                      </p>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-orange-600 mb-2">Your rights to correct and access your information</h4>
                      <p>
                        Please contact our HR Team at T: 0203 219 2865 E: HRTeam@swiis.com if (in accordance with applicable law) you would like to correct or request access to information that we hold relating to you or if you have any questions about this notice.
                      </p>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-orange-600 mb-2">Keeping your personal information secure</h4>
                      <p>
                        We have appropriate security measures in place to prevent personal information from being accidentally lost, used or accessed in an unauthorised way. We limit access to your personal information to those who have a genuine business need to know it.
                      </p>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-orange-600 mb-2">How to complain</h4>
                      <p>
                        We hope that our Data Protection Officer can resolve any query or concern you raise about our use of your information. If not, please contact the Information Commissioner at https://ico.org.uk/concerns/ or telephone: 0303 123 1113 for further information about your rights and how to make a formal complaint.
                      </p>
                    </div>
                  </div>

                  <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <input 
                        type="checkbox" 
                        id="privacy-acknowledge" 
                        className="mt-1 h-4 w-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500" 
                        checked={formData.declaration}
                        onChange={(e) => updateFormData('declaration', e.target.checked)}
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
                        value={formData.firstName}
                        onChange={(e) => updateFormData('firstName', e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Middle Name(s)</label>
                      <input 
                        type="text" 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="Optional"
                        value={formData.middleName}
                        onChange={(e) => updateFormData('middleName', e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Surname</label>
                      <input 
                        type="text" 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="Smith"
                        value={formData.lastName}
                        onChange={(e) => updateFormData('lastName', e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                      <input 
                        type="email" 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="john.smith@example.com"
                        value={formData.email}
                        onChange={(e) => updateFormData('email', e.target.value)}
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
                        value={formData.address}
                        onChange={(e) => updateFormData('address', e.target.value)}
                      ></textarea>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Post Code</label>
                      <input 
                        type="text" 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="SW1A 1AA"
                        value={formData.postcode}
                        onChange={(e) => updateFormData('postcode', e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Home Telephone Number</label>
                      <input 
                        type="tel" 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="020 XXXX XXXX"
                        value={formData.phoneNumber}
                        onChange={(e) => updateFormData('phoneNumber', e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Telephone Number</label>
                      <input 
                        type="tel" 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="07XX XXX XXXX"
                        value={formData.mobileNumber}
                        onChange={(e) => updateFormData('mobileNumber', e.target.value)}
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

                  {/* Visa and Immigration Section */}
                  <div className="border-t pt-6">
                    <h4 className="text-lg font-semibold text-orange-800 mb-4">Right to Work in the UK</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2 mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Do you have the right to work in the UK?</label>
                        <div className="flex items-center space-x-4">
                          <label className="flex items-center">
                            <input 
                              type="radio" 
                              name="right-to-work" 
                              value="yes" 
                              className="mr-2 text-orange-600"
                              checked={formData.rightToWork === 'yes'}
                              onChange={(e) => updateFormData('rightToWork', e.target.value)}
                            />
                            Yes
                          </label>
                          <label className="flex items-center">
                            <input 
                              type="radio" 
                              name="right-to-work" 
                              value="no" 
                              className="mr-2 text-orange-600"
                              checked={formData.rightToWork === 'no'}
                              onChange={(e) => updateFormData('rightToWork', e.target.value)}
                            />
                            No
                          </label>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Visa Type (if applicable)</label>
                        <input 
                          type="text" 
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                          placeholder="e.g., Tier 2, Spouse visa"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Visa Expiry Date (if applicable)</label>
                        <input 
                          type="date" 
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">National Insurance Number</label>
                        <input 
                          type="text" 
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                          placeholder="AB123456C"
                        />
                      </div>
                      
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Work Document Type</label>
                        <select 
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                          value={formData.workDocumentType}
                          onChange={(e) => updateFormData('workDocumentType', e.target.value)}
                        >
                          <option value="">Select document type</option>
                          <option value="passport">UK/EU Passport</option>
                          <option value="birth-certificate">Birth Certificate + National Insurance</option>
                          <option value="visa">Visa/Work Permit</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Upload Work Document(s)
                        </label>
                        <input
                          type="file"
                          multiple
                          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Please upload the documents that prove your right to work in the UK. Accepted formats: PDF, Word documents, JPEG, PNG.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* DBS Section */}
                  <div className="border-t pt-6">
                    <h4 className="text-lg font-semibold text-orange-800 mb-4">DBS Registration</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Are you registered with the Disclosure and Barring Scheme Update Service?</label>
                        <div className="flex items-center space-x-4">
                          <label className="flex items-center">
                            <input 
                              type="radio" 
                              name="dbs-registered" 
                              value="yes" 
                              className="mr-2 text-orange-600"
                              checked={formData.dbsRegistered === 'yes'}
                              onChange={(e) => updateFormData('dbsRegistered', e.target.value)}
                            />
                            Yes
                          </label>
                          <label className="flex items-center">
                            <input 
                              type="radio" 
                              name="dbs-registered" 
                              value="no" 
                              className="mr-2 text-orange-600"
                              checked={formData.dbsRegistered === 'no'}
                              onChange={(e) => updateFormData('dbsRegistered', e.target.value)}
                            />
                            No
                          </label>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">DBS Certificate Number (if applicable)</label>
                        <input 
                          type="text" 
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                          placeholder="Enter DBS number"
                          value={formData.dbsCertificateNumber}
                          onChange={(e) => updateFormData('dbsCertificateNumber', e.target.value)}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">DBS Issue Date (if applicable)</label>
                        <input 
                          type="date" 
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                          value={formData.dbsIssuedDate}
                          onChange={(e) => updateFormData('dbsIssuedDate', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Professional Registration Section */}
                  <div className="border-t pt-6">
                    <h4 className="text-lg font-semibold text-orange-800 mb-4">Professional Registration</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Professional Registration Number (if applicable)</label>
                        <input 
                          type="text" 
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                          placeholder="e.g., Social Work England number"
                          value={formData.professionalNumber}
                          onChange={(e) => updateFormData('professionalNumber', e.target.value)}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Professional Registration Expiry Date (if applicable)</label>
                        <input 
                          type="date" 
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                          value={formData.professionalExpiryDate}
                          onChange={(e) => updateFormData('professionalExpiryDate', e.target.value)}
                        />
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-orange-800">Education History</h3>
                  <p className="text-gray-600 mb-4">Please provide details of your educational background, starting with the most recent.</p>
                  
                  <div className="space-y-6">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-800 mb-3">Education Entry 1</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Institution Name</label>
                          <input 
                            type="text" 
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                            placeholder="University/College/School name"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Qualification Obtained</label>
                          <input 
                            type="text" 
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                            placeholder="e.g., BSc Psychology, A-Levels"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                          <input 
                            type="date" 
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                          <input 
                            type="date" 
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Grade/Result</label>
                          <input 
                            type="text" 
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                            placeholder="e.g., 2:1, Pass, A*AA"
                          />
                        </div>
                        
                        <div className="md:col-span-1">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Additional Details</label>
                          <textarea 
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                            rows={3}
                            placeholder="Any additional relevant details about this qualification"
                          ></textarea>
                        </div>
                      </div>
                    </div>
                    
                    <button 
                      type="button"
                      className="flex items-center px-4 py-2 text-orange-600 border border-orange-300 rounded-md hover:bg-orange-50"
                    >
                      <span className="mr-2">+</span>
                      Add Another Education Entry
                    </button>
                    
                    <div className="border-t pt-6">
                      <h4 className="text-lg font-semibold text-orange-800 mb-4">Education Gaps or Breaks</h4>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Please explain any gaps or breaks in your education (if applicable)
                        </label>
                        <textarea 
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                          rows={3}
                          placeholder="Explain any periods where you were not in education, including reasons and what you did during those times"
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-orange-800">Employment History</h3>
                  <p className="text-gray-600 mb-4">Please provide details of your employment history, starting with your most recent position.</p>
                  
                  <div className="space-y-6">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-800 mb-3">Employment Entry 1</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Employer Name</label>
                          <input 
                            type="text" 
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                            placeholder="Company/Organization name"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Position/Job Title</label>
                          <input 
                            type="text" 
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                            placeholder="Your position/role"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Employer Address</label>
                          <textarea 
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                            rows={2}
                            placeholder="Full address"
                          ></textarea>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Employer Postcode</label>
                          <input 
                            type="text" 
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                            placeholder="SW1A 1AA"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Employer Phone</label>
                          <input 
                            type="tel" 
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                            placeholder="020 XXXX XXXX"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Employer Mobile</label>
                          <input 
                            type="tel" 
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                            placeholder="07XX XXX XXXX"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                          <input 
                            type="date" 
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                          <input 
                            type="date" 
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                          />
                        </div>
                        
                        <div className="md:col-span-2">
                          <label className="flex items-center space-x-2">
                            <input 
                              type="checkbox" 
                              className="h-4 w-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                            />
                            <span className="text-sm text-gray-700">This is my current position</span>
                          </label>
                        </div>
                        
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Duties and Responsibilities</label>
                          <textarea 
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                            rows={3}
                            placeholder="Describe your main duties and responsibilities"
                          ></textarea>
                        </div>
                        
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Leaving</label>
                          <input 
                            type="text" 
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                            placeholder="Career progression, relocation, etc."
                          />
                        </div>
                        
                        <div className="md:col-span-2">
                          <h5 className="font-medium text-gray-700 mb-2">Reference Details</h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-3 rounded">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Reference Name</label>
                              <input 
                                type="text" 
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                placeholder="Manager/Supervisor name"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Reference Email</label>
                              <input 
                                type="email" 
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                placeholder="reference@company.com"
                              />
                            </div>
                            
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-gray-700 mb-1">Reference Phone</label>
                              <input 
                                type="tel" 
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                placeholder="020 XXXX XXXX"
                              />
                            </div>
                          </div>
                        </div>
                        
                        <div className="md:col-span-2">
                          <label className="flex items-center space-x-2">
                            <input 
                              type="checkbox" 
                              className="h-4 w-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                            />
                            <span className="text-sm text-gray-700">Did this work involve working with vulnerable children or adults?</span>
                          </label>
                        </div>
                      </div>
                    </div>
                    
                    <button 
                      type="button"
                      className="flex items-center px-4 py-2 text-orange-600 border border-orange-300 rounded-md hover:bg-orange-50"
                    >
                      <span className="mr-2">+</span>
                      Add Another Employment Entry
                    </button>
                    
                    <div className="border-t pt-6">
                      <h4 className="text-lg font-semibold text-orange-800 mb-4">Employment Gaps</h4>
                      <p className="text-gray-600 mb-4">Please explain any gaps in your employment history.</p>
                      
                      <div className="bg-orange-50 p-4 rounded-lg mb-4">
                        <p className="text-sm text-orange-800">
                          <strong>Note:</strong> Any employment gaps will be automatically calculated based on your employment dates. 
                          You'll need to provide explanations for any gaps between positions.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-orange-800">Skills and Experience</h3>
                  <div className="space-y-4">
                    <p className="text-gray-700 text-base">
                      In your own words, please explain why you consider yourself suited to this position outlining what you would
                      contribute to the post if appointed, by reference to the job description and/or person specification.
                    </p>
                    
                    <div>
                      <textarea 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        rows={12}
                        placeholder="Please provide details about your relevant skills, qualities, and experience..."
                        value={formData.skills}
                        onChange={(e) => updateFormData('skills', e.target.value)}
                      ></textarea>
                      <p className="text-sm text-gray-500 mt-1">Minimum 50 characters required</p>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 5 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-orange-800">References</h3>
                  <p className="text-gray-600 mb-4">We will seek references from your last two employers and all previous positions where you worked with children or vulnerable adults.</p>
                  
                  <div className="bg-orange-50 p-4 rounded-lg mb-6">
                    <p className="text-sm text-orange-800">
                      <strong>Note:</strong> References will be automatically pulled from the employment history you provided. 
                      We will contact the references you specified for each employment position.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="text-lg font-medium text-gray-800">Reference Summary</h4>
                    <p className="text-gray-600">Based on your employment history, we will contact:</p>
                    
                    <div className="space-y-3">
                      <div className="bg-gray-50 p-3 rounded border">
                        <p className="font-medium text-gray-700">Employment Reference 1</p>
                        <p className="text-sm text-gray-600">From your most recent employment position</p>
                        <p className="text-sm text-gray-500">Reference details will be taken from Employment History section</p>
                      </div>
                      
                      <div className="bg-gray-50 p-3 rounded border">
                        <p className="font-medium text-gray-700">Employment Reference 2</p>
                        <p className="text-sm text-gray-600">From your second most recent employment position</p>
                        <p className="text-sm text-gray-500">Reference details will be taken from Employment History section</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 6 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-orange-800">Disciplinary Questions</h3>
                  <p className="text-gray-600 mb-4">Please answer the following questions honestly. All information will be treated confidentially.</p>
                  
                  <div className="space-y-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Have you ever been convicted of a criminal offence (including cautions, reprimands, and final warnings)?
                      </label>
                      <div className="flex items-center space-x-4 mb-3">
                        <label className="flex items-center">
                          <input 
                            type="radio" 
                            name="criminal-conviction" 
                            value="yes" 
                            className="mr-2 text-orange-600"
                            checked={formData.criminalConvictions === true}
                            onChange={(e) => updateFormData('criminalConvictions', e.target.value === 'yes')}
                          />
                          Yes
                        </label>
                        <label className="flex items-center">
                          <input 
                            type="radio" 
                            name="criminal-conviction" 
                            value="no" 
                            className="mr-2 text-orange-600"
                            checked={formData.criminalConvictions === false}
                            onChange={(e) => updateFormData('criminalConvictions', false)}
                          />
                          No
                        </label>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">If yes, please provide details:</label>
                        <textarea 
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                          rows={3}
                          placeholder="Please provide full details including dates and circumstances"
                          value={formData.criminalConvictionsDetails}
                          onChange={(e) => updateFormData('criminalConvictionsDetails', e.target.value)}
                        ></textarea>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Have you ever been subject to disciplinary action or investigation by an employer?
                      </label>
                      <div className="flex items-center space-x-4 mb-3">
                        <label className="flex items-center">
                          <input 
                            type="radio" 
                            name="disciplinary-action" 
                            value="yes" 
                            className="mr-2 text-orange-600"
                            checked={formData.disciplinaryAction === true}
                            onChange={(e) => updateFormData('disciplinaryAction', true)}
                          />
                          Yes
                        </label>
                        <label className="flex items-center">
                          <input 
                            type="radio" 
                            name="disciplinary-action" 
                            value="no" 
                            className="mr-2 text-orange-600"
                            checked={formData.disciplinaryAction === false}
                            onChange={(e) => updateFormData('disciplinaryAction', false)}
                          />
                          No
                        </label>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">If yes, please provide details:</label>
                        <textarea 
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                          rows={3}
                          placeholder="Please provide full details including dates and outcomes"
                          value={formData.disciplinaryActionDetails}
                          onChange={(e) => updateFormData('disciplinaryActionDetails', e.target.value)}
                        ></textarea>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Have you ever been refused employment, dismissed from employment, or asked to resign from any position?
                      </label>
                      <div className="flex items-center space-x-4 mb-3">
                        <label className="flex items-center">
                          <input type="radio" name="employment-issues" value="yes" className="mr-2 text-orange-600" />
                          Yes
                        </label>
                        <label className="flex items-center">
                          <input type="radio" name="employment-issues" value="no" className="mr-2 text-orange-600" />
                          No
                        </label>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">If yes, please provide details:</label>
                        <textarea 
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                          rows={3}
                          placeholder="Please provide full details including reasons and circumstances"
                        ></textarea>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Are you currently subject to any professional investigation or disciplinary proceedings?
                      </label>
                      <div className="flex items-center space-x-4 mb-3">
                        <label className="flex items-center">
                          <input type="radio" name="current-investigation" value="yes" className="mr-2 text-orange-600" />
                          Yes
                        </label>
                        <label className="flex items-center">
                          <input type="radio" name="current-investigation" value="no" className="mr-2 text-orange-600" />
                          No
                        </label>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">If yes, please provide details:</label>
                        <textarea 
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                          rows={3}
                          placeholder="Please provide full details of the investigation or proceedings"
                        ></textarea>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Do you have any health conditions that may affect your ability to carry out the role?
                      </label>
                      <div className="flex items-center space-x-4 mb-3">
                        <label className="flex items-center">
                          <input type="radio" name="health-conditions" value="yes" className="mr-2 text-orange-600" />
                          Yes
                        </label>
                        <label className="flex items-center">
                          <input type="radio" name="health-conditions" value="no" className="mr-2 text-orange-600" />
                          No
                        </label>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">If yes, please provide details and any adjustments needed:</label>
                        <textarea 
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                          rows={3}
                          placeholder="Please describe any conditions and reasonable adjustments that may be required"
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 7 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-orange-800">Declaration</h3>
                  <p className="text-gray-600 mb-4">Please read and confirm the following declarations to complete your application.</p>
                  
                  <div className="space-y-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-800 mb-3">Application Declaration</h4>
                      <div className="space-y-3 text-sm text-gray-700">
                        <p>I declare that:</p>
                        <ul className="list-disc ml-6 space-y-2">
                          <li>The information I have provided in this application is true and complete to the best of my knowledge</li>
                          <li>I understand that any false information may lead to the refusal of my application or cancellation of employment</li>
                          <li>I consent to Swiis Foster Care making such enquiries as may be necessary to verify the information given</li>
                          <li>I understand that this position is subject to an enhanced DBS check</li>
                          <li>I understand that references will be sought for all employment</li>
                          <li>I understand that any offer of employment will be subject to satisfactory references, health clearance, and right to work verification</li>
                        </ul>
                      </div>
                      
                      <div className="mt-4">
                        <label className="flex items-start space-x-3">
                          <input 
                            type="checkbox" 
                            className="mt-1 h-4 w-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500" 
                            required
                            checked={formData.declaration}
                            onChange={(e) => updateFormData('declaration', e.target.checked)}
                          />
                          <span className="text-sm text-gray-700">
                            <strong>I confirm that I have read and agree to the above declaration.</strong>
                          </span>
                        </label>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-800 mb-3">Equal Opportunities</h4>
                      <div className="space-y-3 text-sm text-gray-700">
                        <p>Swiis Foster Care is committed to equal opportunities and values diversity. We welcome applications from all qualified candidates regardless of age, disability, gender reassignment, marriage and civil partnership, pregnancy and maternity, race, religion or belief, sex, or sexual orientation.</p>
                      </div>
                      
                      <div className="mt-4">
                        <label className="flex items-start space-x-3">
                          <input 
                            type="checkbox" 
                            className="mt-1 h-4 w-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500" 
                            required
                          />
                          <span className="text-sm text-gray-700">
                            <strong>I acknowledge the equal opportunities statement.</strong>
                          </span>
                        </label>
                      </div>
                    </div>
                    
                    <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg">
                      <h4 className="font-medium text-orange-800 mb-3">Final Submission</h4>
                      <p className="text-sm text-gray-700 mb-3">
                        By submitting this application, you confirm that all information provided is accurate and complete. 
                        You understand that your application will be reviewed and you may be contacted for further information or to arrange an interview.
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name (Digital Signature)</label>
                          <input 
                            type="text" 
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                            placeholder="Type your full name as digital signature"
                            required
                            value={formData.signature}
                            onChange={(e) => updateFormData('signature', e.target.value)}
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                          <input 
                            type="date" 
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                            value={formData.signatureDate || new Date().toISOString().split('T')[0]}
                            onChange={(e) => updateFormData('signatureDate', e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <button 
                          type="submit"
                          className="px-8 py-3 bg-orange-600 text-white font-semibold rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                        >
                          Submit Application
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 0}
                className={`px-4 py-2 border border-gray-300 rounded-md flex items-center ${
                  currentStep === 0 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </button>

              <button
                type="button"
                onClick={nextStep}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-md flex items-center"
              >
                {currentStep === steps.length - 1 ? 'Complete Application' : 'Continue'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}