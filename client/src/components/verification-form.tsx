import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Upload, CheckCircle } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Create schema for DBS check
const dbsCheckSchema = z.object({
  existingDbs: z.boolean(),
  dbsNumber: z.string().optional(),
  nationalInsurance: z.string().optional(),
  birthPlace: z.string().optional(),
  fiveYearAddressHistory: z.boolean().default(true),
});

// Create schema for declaration
const declarationSchema = z.object({
  accurateInfo: z.boolean().refine(value => value === true, {
    message: "You must confirm the accuracy of your information",
  }),
  falseInfoConsequences: z.boolean().refine(value => value === true, {
    message: "You must accept this declaration",
  }),
  consentToChecks: z.boolean().refine(value => value === true, {
    message: "You must consent to reference and DBS checks",
  }),
  dataProtection: z.boolean().refine(value => value === true, {
    message: "You must consent to data processing",
  }),
});

// Combine schemas for the entire form
const verificationFormSchema = z.object({
  dbsCheck: dbsCheckSchema,
  declaration: declarationSchema,
});

type VerificationFormValues = z.infer<typeof verificationFormSchema>;

interface VerificationFormProps {
  applicantId: number;
  onSuccess: () => void;
  onBack: () => void;
}

export function VerificationForm({ applicantId, onSuccess, onBack }: VerificationFormProps) {
  const { toast } = useToast();
  const [dbsFile, setDbsFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  
  // Fetch applicant data
  const { data: applicant } = useQuery({
    queryKey: [`/api/applicants/${applicantId}`],
    enabled: !!applicantId,
  });
  
  // Set up the form
  const form = useForm<VerificationFormValues>({
    resolver: zodResolver(verificationFormSchema),
    defaultValues: {
      dbsCheck: {
        existingDbs: false,
        dbsNumber: "",
        nationalInsurance: "",
        birthPlace: "",
        fiveYearAddressHistory: true,
      },
      declaration: {
        accurateInfo: false,
        falseInfoConsequences: false,
        consentToChecks: false,
        dataProtection: false,
      },
    },
  });
  
  // Create DBS check mutation
  const createDbsCheck = useMutation({
    mutationFn: async (values: any) => {
      const res = await apiRequest("POST", `/api/applicants/${applicantId}/dbs`, values);
      return res.json();
    },
  });
  
  // Submit application mutation
  const submitApplication = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", `/api/applicants/${applicantId}/submit`, {});
      return res.json();
    },
  });

  // Watch existingDbs value to conditionally show fields
  const hasExistingDbs = form.watch("dbsCheck.existingDbs");
  
  // Handle form submission
  async function onSubmit(values: VerificationFormValues) {
    setIsSubmitting(true);
    try {
      // Submit DBS check
      await createDbsCheck.mutateAsync(values.dbsCheck);
      
      // Submit final application
      await submitApplication.mutateAsync();
      
      toast({
        title: "Application submitted successfully!",
        description: "Your fostering application has been submitted. You will receive confirmation by email shortly.",
      });
      
      setIsComplete(true);
      onSuccess();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }
  
  const handleDbsFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setDbsFile(file);
  };
  
  if (isComplete) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-6">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        <h2 className="text-2xl font-medium text-center mb-2">Application Submitted</h2>
        <p className="text-neutral-700 text-center mb-6 max-w-md">
          Your fostering application has been successfully submitted. We'll review your information and be in touch soon.
        </p>
        <Alert className="max-w-md">
          <AlertTitle>What happens next?</AlertTitle>
          <AlertDescription>
            <p className="mt-2">
              1. You'll receive a confirmation email shortly
            </p>
            <p className="mt-1">
              2. We'll process your references and DBS checks
            </p>
            <p className="mt-1">
              3. A fostering advisor will contact you to discuss next steps
            </p>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* DBS Check Section */}
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-3">DBS (Disclosure and Barring Service) Check</h3>
          
          <div className="bg-neutral-50 border border-neutral-200 rounded-md p-4">
            <p className="text-sm text-neutral-700 mb-4">
              An enhanced DBS check is required for all fostering applicants to ensure the safety of vulnerable children.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <FormField
                control={form.control}
                name="dbsCheck.existingDbs"
                render={({ field }) => (
                  <FormItem className="col-span-full">
                    <FormLabel>Do you have an existing DBS certificate issued within the last 12 months?</FormLabel>
                    <FormControl>
                      <RadioGroup 
                        onValueChange={(value) => field.onChange(value === "yes")}
                        defaultValue={field.value ? "yes" : "no"}
                        className="flex items-center space-x-4 mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="yes" id="dbs-yes" />
                          <FormLabel htmlFor="dbs-yes" className="font-normal">Yes</FormLabel>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="no" id="dbs-no" />
                          <FormLabel htmlFor="dbs-no" className="font-normal">No</FormLabel>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {hasExistingDbs && (
                <>
                  <FormField
                    control={form.control}
                    name="dbsCheck.dbsNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>DBS Certificate Number</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. 001234567890" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="md:col-span-2">
                    <FormLabel htmlFor="dbsUpload">Upload DBS Certificate</FormLabel>
                    <div className="flex items-center justify-center w-full mt-1">
                      <label
                        htmlFor="dbsUpload"
                        className="flex flex-col items-center justify-center w-full h-24 border-2 border-neutral-200 border-dashed rounded-lg cursor-pointer bg-neutral-50 hover:bg-neutral-100"
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="text-neutral-400 mb-1 h-5 w-5" />
                          <p className="mb-1 text-sm text-neutral-700">
                            <span className="font-medium">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-neutral-500">PDF, JPG, or PNG (max. 5MB)</p>
                        </div>
                        <input
                          id="dbsUpload"
                          type="file"
                          className="hidden"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={handleDbsFileChange}
                        />
                      </label>
                    </div>
                    {dbsFile && (
                      <p className="text-sm text-green-600 mt-2">
                        File selected: {dbsFile.name}
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>
            
            {!hasExistingDbs && (
              <div id="new-dbs-section">
                <p className="text-sm text-neutral-700 mb-4">
                  To process a new DBS check, we need to collect additional personal information:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="dbsCheck.nationalInsurance"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>National Insurance Number</FormLabel>
                        <FormControl>
                          <Input placeholder="AB123456C" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="dbsCheck.birthPlace"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Place of Birth</FormLabel>
                        <FormControl>
                          <Input placeholder="E.g. London, UK" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="dbsCheck.fiveYearAddressHistory"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Have you lived at your current address for at least 5 years?</FormLabel>
                        <FormControl>
                          <RadioGroup 
                            onValueChange={(value) => field.onChange(value === "yes")}
                            defaultValue={field.value ? "yes" : "no"}
                            className="flex items-center space-x-4 mt-2"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="yes" id="address-yes" />
                              <FormLabel htmlFor="address-yes" className="font-normal">Yes</FormLabel>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="no" id="address-no" />
                              <FormLabel htmlFor="address-no" className="font-normal">No</FormLabel>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <p className="text-sm mt-4 text-neutral-700">
                  By proceeding, you consent to a DBS check being performed. You'll receive further instructions about ID verification for the DBS check.
                </p>
              </div>
            )}
          </div>
        </div>
        
        {/* Declaration Section */}
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-3">Final Declaration</h3>
          
          <div className="bg-neutral-50 border border-neutral-200 rounded-md p-4">
            <p className="text-sm text-neutral-700 mb-4">Please read and confirm the following statements:</p>
            
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="declaration.accurateInfo"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        I confirm that the information provided in this application is complete and accurate to the best of my knowledge.
                      </FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="declaration.falseInfoConsequences"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        I understand that providing false information may result in my application being rejected or approval being withdrawn if already granted.
                      </FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="declaration.consentToChecks"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        I consent to references being sought, DBS checks being conducted, and right to work verification as part of my application process.
                      </FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="declaration.dataProtection"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        I understand that my personal data will be processed in accordance with the Data Protection Act 2018 and GDPR for the purpose of assessing my application.
                      </FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
        
        <div className="mt-8 flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
          >
            Back: References
          </Button>
          
          <Button 
            type="submit" 
            variant="default"
            className="bg-green-600 hover:bg-green-700"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing
              </>
            ) : (
              "Submit Application"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
