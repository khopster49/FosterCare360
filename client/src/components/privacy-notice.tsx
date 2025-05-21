import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const privacyNoticeSchema = z.object({
  acknowledged: z.boolean().refine(val => val === true, {
    message: "You must acknowledge that you have read and understood the privacy notice",
  }),
});

type PrivacyNoticeValues = z.infer<typeof privacyNoticeSchema>;

interface PrivacyNoticeProps {
  applicantId: number;
  onSuccess: () => void;
  onBack: () => void;
}

export function PrivacyNotice({ applicantId, onSuccess, onBack }: PrivacyNoticeProps) {
  const form = useForm<PrivacyNoticeValues>({
    resolver: zodResolver(privacyNoticeSchema),
    defaultValues: {
      acknowledged: false,
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (values: PrivacyNoticeValues) => {
      return await apiRequest(`/api/applicants/${applicantId}/privacy-notice`, "POST", values);
    },
    onSuccess: () => {
      toast({
        title: "Privacy Notice Acknowledged",
        description: "Thank you for acknowledging the privacy notice.",
      });
      onSuccess();
    },
    onError: (error) => {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "There was a problem saving your acknowledgment.",
        variant: "destructive",
      });
    },
  });

  async function onSubmit(values: PrivacyNoticeValues) {
    mutate(values);
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold mb-4">Data Protection Privacy Notice (Recruitment)</h1>
        
        <div className="space-y-6 bg-white p-6 rounded-lg border border-gray-200 text-gray-700 text-sm leading-relaxed">
          <div>
            <p className="mb-4">
              This notice explains what personal data (information) we will hold about you, how we collect it, and how we will use 
              and may share information about you during the application process. We are required to notify you of this information, 
              under data protection legislation. Please ensure that you read this notice (sometimes referred to as a 'privacy notice') 
              and any other similar notice we may provide to you from time to time when we collect or process personal information 
              about you.
            </p>
            
            <h2 className="text-xl font-semibold text-orange-500 my-4">Who collects the information.</h2>
            <p className="mb-4">
              Swiis Foster Care ('Company') is a 'data controller' and gathers and uses certain information about you. This information is also 
              used by our affiliated entities and group companies, namely Swiis UK Ltd, Swiis Foster Care Ltd, Swiis Foster Care 
              Scotland Ltd, (our 'group companies') and so, in this notice, references to 'we' or 'us' mean the Company and our 
              group companies.
            </p>
            
            <h2 className="text-xl font-semibold text-orange-500 my-4">Data protection principles.</h2>
            <p className="mb-4">
              We will comply with the data protection principles when gathering and using personal information, as set out in our 
              GDPR Data Protection Policy and GDPR Data Retention Policy.
            </p>
            
            <h2 className="text-xl font-semibold text-orange-500 my-4">About the information we collect and hold.</h2>
            <h3 className="text-lg font-medium my-3">What information.</h3>
            <p className="mb-2">
              We may collect the following information up to and including the shortlisting stage of the recruitment process:
            </p>
            <ul className="list-disc ml-8 mb-4 space-y-2">
              <li>Your name and contact details (i.e. address, home and mobile phone numbers, email address).</li>
              <li>Details of your qualifications, experience, employment history (including job titles, salary and working hours) and interests.</li>
              <li>Your racial or ethnic origin, sex and sexual orientation, religious or similar beliefs.</li>
              <li>Information regarding your criminal record.</li>
              <li>Details of your referees.</li>
              <li>Information about your health, including any medical condition, health, and sickness records for the purposes of establishing if any adjustments need to be made to the recruitment process.</li>
            </ul>
            
            <p className="mb-2">
              We may collect the following information after the shortlisting stage, and before making a final decision to recruit:
            </p>
            <ul className="list-disc ml-8 mb-4 space-y-2">
              <li>Information about your previous academic and/or employment history, including details of any conduct, grievance or performance issues, appraisals, time and attendance and references obtained about you from previous employers and/or education providers.</li>
              <li>Information regarding your academic and professional qualifications.</li>
              <li>Information regarding your criminal record, in criminal records certificates and enhanced criminal records certificates (DBS).</li>
              <li>Your nationality and immigration status and information from related documents, such as your passport or other identification and immigration information.</li>
              <li>A copy of your driving licence.</li>
              <li>Information about your health, including any medical condition, health and sickness records for the purposes of assessing the ability to carry out intrinsic elements of the role.</li>
            </ul>
            
            <p className="mb-4">
              You are required (by law or in order to enter into your contract of employment) to provide the categories of information marked 'Δ' above to us to enable us to verify your right to work and suitability for the position.
            </p>
            
            <h2 className="text-xl font-semibold text-orange-500 my-4">How we collect the information.</h2>
            <p className="mb-4">
              We may collect this information from you, your referees (details of whom you will have provided), your education provider, the relevant professional body, The Disclosure and Barring Service (DBS), the Home Office.
            </p>
            
            <h2 className="text-xl font-semibold text-orange-500 my-4">Why we collect the information and how we use it.</h2>
            <p className="mb-2">
              We will typically collect and use this information for the following purposes (other purposes that may also apply are explained in our GDPR Data Protection Policy):
            </p>
            <ul className="list-disc ml-8 mb-4 space-y-2">
              <li>to take steps to enter into a contract;</li>
              <li>for compliance with a legal obligation (e.g. our obligation to check that you are eligible to work in the United Kingdom);</li>
              <li>for the performance of a task carried out in the public interest;</li>
              <li>for the purposes of our legitimate interests or those of a relevant third party (such as a benefits provider), but only if these are not overridden by your interests, rights or freedoms;</li>
              <li>because it is necessary for carrying out obligations or exercising rights in employment law;</li>
              <li>(i.e. equality of opportunity or treatment, promoting or retaining racial and ethnic diversity at senior level, preventing or detecting unlawful acts); and</li>
              <li>to establish, exercise and/or defend any legal claims that may be brought by or against us in connection with your recruitment.</li>
            </ul>
            
            <p className="mb-4">
              We seek to ensure that our information collection and processing is always proportionate. We will notify you of any changes to information we collect or to the purposes for which we collect and process it.
            </p>
            
            <h2 className="text-xl font-semibold text-orange-500 my-4">How we may share the information.</h2>
            <p className="mb-4">
              We may also need to share some of the above categories of personal information with other parties, such as HR consultants and professional advisers. Usually, information will be anonymised but this may not always be possible. The recipient of the information will be bound by confidentiality obligations. We may also be required to share some personal information with our regulators or as required to comply with the law.
            </p>
            
            <h2 className="text-xl font-semibold text-orange-500 my-4">Sensitive personal information and criminal records information.</h2>
            <p className="mb-4">
              Further details on how we handle sensitive personal information and information relating to criminal convictions and offences are set out in our Criminal Convictions Policy and GDPR Retention Policy, which are available from the HR Team.
            </p>
            
            <h2 className="text-xl font-semibold text-orange-500 my-4">Where information may be held.</h2>
            <p className="mb-4">
              Information may be held at our offices and those of our group companies, and third party agencies, service providers, representatives and agents as described above.
            </p>
            
            <h2 className="text-xl font-semibold text-orange-500 my-4">How long we keep your information.</h2>
            <p className="mb-4">
              We keep the personal information that we obtain about you during the recruitment process for no longer than is necessary for the purposes for which it is processed. How long we keep your information will depend on whether your application is successful and you become employed by us, the nature of the information concerned and the purposes for which it is processed.
            </p>
            <p className="mb-4">
              We will keep recruitment information (including interview notes) for no longer than is reasonable, taking into account the limitation periods for potential claims such as race or sex discrimination (as extended to take account of early conciliation), after which they will be destroyed. If there is a clear business reason for keeping recruitment records for longer than the recruitment period, we may do so, but will first consider whether the records can be pseudonymised, and the longer period for which they will be kept.
            </p>
            <p className="mb-4">
              If your application is successful, we will keep only the recruitment information that is necessary in relation to your employment. For further information, please see our GDPR Data Protection Policy and GDPR Data Retention Policy.
            </p>
            <p className="mb-4">
              Further details on our approach to information retention and destruction are available in our GDPR Data Protection Policy.
            </p>
            
            <h2 className="text-xl font-semibold text-orange-500 my-4">Your right to object to us processing your information.</h2>
            <p className="mb-4">
              Where our processing of your information is based solely on our legitimate interests (or those of a third party), you have the right to object to that processing if you give us specific reasons as to why you are objecting, which are based on your particular situation. If you object, we can no longer process your information unless we can demonstrate legitimate grounds for the processing, which override your interests, rights and freedoms, or the processing is for the establishment, exercise, or defence of legal claims.
            </p>
            <p className="mb-4">
              Please contact our HR Team who can be contacted:
            </p>
            <p className="mb-4">
              T: 0203 219 2865 E: HRTeam@swiis.com if you wish to object in this way.
            </p>
            
            <h2 className="text-xl font-semibold text-orange-500 my-4">Your rights to correct and access your information and to ask for it to be erased.</h2>
            <p className="mb-4">
              Please contact our HR Team who can be contacted:
            </p>
            <p className="mb-4">
              T: 0203 219 2865 E: HRTeam@swiis.com if (in accordance with applicable law) you would like to correct or request access to information that we hold relating to you or if you have any questions about this notice. You also have the right to ask our HR Team for some but not all of the information we hold and process to be erased (the 'right to be forgotten') in certain circumstances. Our HR Team will provide you with further information about the right to be forgotten, if you ask for it.
            </p>
            
            <h2 className="text-xl font-semibold text-orange-500 my-4">Keeping your personal information secure.</h2>
            <p className="mb-4">
              We have appropriate security measures in place to prevent personal information from being accidentally lost, used or accessed in an unauthorised way. We limit access to your personal information to those who have a genuine business need to know it. Those processing your information will do so only in an authorised manner and are subject to a duty of confidentiality.
            </p>
            <p className="mb-4">
              We also have procedures in place to deal with any suspected data security breach. We will notify you and any applicable regulator of a suspected data security breach where we are legally required to do so.
            </p>
            
            <h2 className="text-xl font-semibold text-orange-500 my-4">How to complain.</h2>
            <p className="mb-4">
              We hope that our Data Protection Officer can resolve any query or concern you raise about our use of your information. If not, please contact the Information Commissioner at https://ico.org.uk/concerns/ or telephone: 0303 123 1113 for further information about your rights and how to make a formal complaint.
            </p>
          </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox"
                  id="acknowledged"
                  className="w-5 h-5"
                  checked={form.watch("acknowledged")}
                  onChange={(e) => form.setValue("acknowledged", e.target.checked)}
                />
                <label htmlFor="acknowledged" className="font-medium">
                  I acknowledge that I have read and understood the privacy notice.
                </label>
              </div>
              
              {form.formState.errors.acknowledged && (
                <p className="text-red-500">{form.formState.errors.acknowledged.message}</p>
              )}
              
              <div className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onBack}
                >
                  Back
                </Button>
                <Button 
                  type="submit"
                  disabled={isPending}
                >
                  {isPending ? "Submitting..." : "Complete Application"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}