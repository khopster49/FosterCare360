import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Shield, FileText } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

// Create schema for the data protection form
const dataProtectionSchema = z.object({
  applicantId: z.number(),
  fullName: z.string().min(1, { message: "Full name is required" }),
  signatureConfirmation: z.boolean().refine(val => val === true, {
    message: "You must confirm your signature",
  }),
  dataProtectionAgreement: z.boolean().refine(val => val === true, {
    message: "You must agree to the data protection terms",
  }),
});

type DataProtectionFormValues = z.infer<typeof dataProtectionSchema>;

interface DataProtectionFormProps {
  applicantId: number;
  onSuccess: () => void;
  onBack: () => void;
}

export function DataProtectionForm({ applicantId, onSuccess, onBack }: DataProtectionFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Fetch applicant data to get name
  const { data: applicant } = useQuery({
    queryKey: [`/api/applicants/${applicantId}`],
    enabled: !!applicantId,
  });
  
  // Format the current date
  const currentDate = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
  
  // Set up the form
  const form = useForm<DataProtectionFormValues>({
    resolver: zodResolver(dataProtectionSchema),
    defaultValues: {
      applicantId,
      fullName: applicant ? `${applicant.firstName} ${applicant.lastName}` : "",
      signatureConfirmation: false,
      dataProtectionAgreement: false,
    },
  });
  
  // Update name when applicant data loads
  if (applicant && !form.getValues("fullName")) {
    form.setValue("fullName", `${applicant.firstName} ${applicant.lastName}`);
  }
  
  // Handle form submission
  async function onSubmit(values: DataProtectionFormValues) {
    setIsSubmitting(true);
    try {
      // Save to localStorage
      localStorage.setItem(`data_protection_${applicantId}`, JSON.stringify({
        ...values,
        signedDate: new Date().toISOString()
      }));
      
      toast({
        title: "Data Protection Agreement Completed",
        description: "Your declaration and confidentiality agreement has been saved.",
      });
      
      onSuccess();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save your information. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card className="border-primary/20">
          <CardContent className="pt-6">
            <h3 className="text-3xl font-medium text-primary mb-6">Data Protection/Declaration & Confidentiality Agreement</h3>
            
            <div className="space-y-6 mb-6">
              <p className="text-neutral-800">
                I declare that the details which I have given on this form are true and accurate and that I am not banned or disqualified
                from working with children or vulnerable adults, nor subject to any sanctions or conditions on my employment
                imposed by The Disclosure and Barring Service, the Secretary of State or a regulatory body.
              </p>
              
              <p className="text-neutral-800">
                I understand that providing any misleading or false information to support my application could mean that any job
                offer is withdrawn or that I will be dismissed for gross misconduct.
              </p>
              
              <p className="text-neutral-800">
                I hereby declare that I have understood and complied with the requirements laid down in the previous paragraph.
              </p>
              
              <p className="text-neutral-800">
                I will notify Swiis immediately should any circumstances change as detailed above. If I am shortlisted or selected, I
                agree to Swiis requesting DBS checks as appropriate.
              </p>
              
              <p className="text-neutral-800">
                I understand that due to the nature of the role I will be undertaking, I may come into contact with information of a
                sensitive, personal or confidential nature. I agree that: a: I will not disclose any such information except where this is
                necessary in carrying out my duties or where this is required by law, b: I will return any such information to the
                workplace when it is no longer needed, c: I will not use any information gained through my dealings with Swiis other
                than for the benefit of Swiis or its customers.
              </p>
              
              <p className="text-neutral-800">
                I understand that Swiis International Limited will request on my behalf, my personal and sensitive data from third
                parties to provide me with work, including employment references. I understand that reference information may
                include, but not be limited to, verbal and written inquiries or information about my previous or current employment.
              </p>
            </div>
            
            <div className="border-[1px] border-gray-300 mb-6">
              <div className="grid grid-cols-[200px_1fr] border-b-[1px] border-gray-300">
                <div className="p-4 border-r-[1px] border-gray-300 font-medium">Full Name</div>
                <div className="p-4">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input {...field} className="border-0 shadow-none p-0 h-auto focus-visible:ring-0" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-[200px_1fr] border-b-[1px] border-gray-300">
                <div className="p-4 border-r-[1px] border-gray-300 font-medium">Signature</div>
                <div className="p-4 flex items-center">
                  <FormField
                    control={form.control}
                    name="signatureConfirmation"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer">
                          I confirm this is my electronic signature
                        </FormLabel>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-[200px_1fr]">
                <div className="p-4 border-r-[1px] border-gray-300 font-medium">Date of Signature</div>
                <div className="p-4">{currentDate}</div>
              </div>
            </div>
            
            <div className="bg-neutral-50 p-4 border-[1px] border-gray-300 mb-6">
              <p className="text-sm mb-4">
                Information from this application may be processed for purposes permitted under the General Data Protection
                Regulations. Individuals have, on written request, the right of access to the personal data held about them.
              </p>
              
              <p className="text-sm mb-4">
                The Company treats personal data collected during the recruitment process in accordance with its data protection
                policy. Information about how your data is used and the basis for processing your data is provided in our privacy
                notice.
              </p>
              
              <p className="text-sm font-semibold">
                Note: Any false, incomplete or misleading statements may lead to dismissal.
              </p>
            </div>
            
            <FormField
              control={form.control}
              name="dataProtectionAgreement"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 bg-primary/5 p-4 rounded-md border border-primary/10">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="mt-1"
                    />
                  </FormControl>
                  <div className="space-y-2">
                    <FormLabel className="font-medium">
                      I agree to the data protection, declaration and confidentiality terms above
                    </FormLabel>
                    <FormDescription className="text-sm">
                      By checking this box, you confirm that all information provided is accurate and you agree to all terms.
                    </FormDescription>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
        
        <div className="mt-8 flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
          >
            Back to Disciplinary
          </Button>
          
          <Button 
            type="submit"
            disabled={isSubmitting}
            className="bg-primary hover:bg-primary/90"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting
              </>
            ) : (
              "Complete Application Form"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}