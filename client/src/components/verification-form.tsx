import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Upload, CheckCircle, ShieldCheck, FileSignature } from "lucide-react";
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
  FormDescription,
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
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

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
  consentToOnlineDbsCheck: z.boolean().refine(value => value === true, {
    message: "You must consent to online DBS check verification",
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
  const [isSuccess, setIsSuccess] = useState(false);
  
  // Fetch applicant data - but don't block rendering if no data available
  const { data: applicant } = useQuery({
    queryKey: [`/api/applicants/${applicantId}`],
    enabled: !!applicantId,
    retry: false,
    refetchOnWindowFocus: false,
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
        consentToOnlineDbsCheck: false,
        dataProtection: false,
      },
    },
  });
  
  // Create DBS check mutation
  const createDbsCheck = useMutation({
    mutationFn: async (values: any) => {
      if (!applicantId) {
        toast({
          title: "Information Only",
          description: "This is a preview. In the actual form, your DBS information would be saved.",
        });
        return { success: true };
      }
      const res = await apiRequest("POST", `/api/applicants/${applicantId}/dbs`, values);
      return res.json();
    },
  });
  
  // Submit application mutation
  const submitApplication = useMutation({
    mutationFn: async () => {
      if (!applicantId) {
        toast({
          title: "Information Only",
          description: "This is a preview. In the actual form, your application would be submitted.",
        });
        return { success: true };
      }
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
        description: "Your application has been submitted. You will receive confirmation by email shortly.",
      });
      
      setIsComplete(true);
      setIsSuccess(true);
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
      <Card className="border-green-200">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-10">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-6">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-medium text-center mb-4">Application Submitted</h2>
            <p className="text-neutral-700 text-center mb-8 max-w-md">
              Your application has been successfully submitted. We'll review your information and be in touch soon.
            </p>
            
            <div className="w-full max-w-md">
              <div className="flex items-center gap-2 mb-4">
                <h3 className="text-lg font-medium text-green-700">What happens next?</h3>
                <Separator className="flex-1" />
              </div>
              
              <ol className="space-y-4 text-sm text-neutral-700">
                <li className="flex items-start gap-2">
                  <span className="bg-green-100 text-green-700 font-bold rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">1</span>
                  <div>
                    <p className="font-medium">Confirmation Email</p>
                    <p>You'll receive a confirmation email shortly with details about your application.</p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-green-100 text-green-700 font-bold rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">2</span>
                  <div>
                    <p className="font-medium">Background Checks</p>
                    <p>We'll process your references and DBS checks as required by UK regulations.</p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-green-100 text-green-700 font-bold rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">3</span>
                  <div>
                    <p className="font-medium">Initial Contact</p>
                    <p>A team member will contact you to discuss next steps in the assessment process.</p>
                  </div>
                </li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* DBS Check Section */}
        <Card className="border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-4">
              <ShieldCheck className="h-6 w-6 text-primary" />
              <h3 className="text-lg font-medium text-primary">DBS (Disclosure and Barring Service) Check</h3>
            </div>
            <p className="text-sm text-neutral-600 mb-4">
              An enhanced DBS check is required for all applicants to ensure the safety of vulnerable children and adults.
              This is a mandatory requirement under UK regulations.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <FormField
                control={form.control}
                name="dbsCheck.existingDbs"
                render={({ field }) => (
                  <FormItem className="col-span-full">
                    <FormLabel>Are you registered with the Disclosure and Barring Scheme Update Service?</FormLabel>
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
                <div className="col-span-full space-y-6">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="text-md font-medium text-primary">DBS Certificate Details</h4>
                    <Separator className="flex-1" />
                  </div>
                
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="dbsCheck.dbsNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>DBS/PVG Certificate or Membership Number</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. 001234567890" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="col-span-full">
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
                  </div>
                </div>
              )}
            </div>
            
            {!hasExistingDbs && (
              <div id="new-dbs-section">
                <div className="flex items-center gap-2 mb-4 mt-6">
                  <h4 className="text-md font-medium text-primary">DBS Application Information</h4>
                  <Separator className="flex-1" />
                </div>
                
                <p className="text-sm text-neutral-600 mb-4">
                  To process a new DBS check, we need to collect the following additional personal information:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        <FormDescription>
                          If no, you will need to provide a full 5-year address history as part of the DBS check process.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="bg-primary/5 border border-primary/10 rounded-md p-4 mt-6">
                  <p className="text-sm text-neutral-700">
                    By proceeding, you consent to a DBS check being performed. You'll receive further instructions about ID verification for the DBS check via email.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Declaration Section */}
        <Card className="border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-4">
              <FileSignature className="h-6 w-6 text-primary" />
              <h3 className="text-lg font-medium text-primary">Final Declaration</h3>
            </div>
            
            <p className="text-sm text-neutral-600 mb-6">
              Please read and confirm the following statements by checking each box. These declarations are required 
              to complete your application in compliance with UK regulations.
            </p>
            
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="declaration.accurateInfo"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 bg-primary/5 p-4 rounded-md border border-primary/10">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="mt-1"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="font-medium">
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
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 bg-primary/5 p-4 rounded-md border border-primary/10">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="mt-1"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="font-medium">
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
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 bg-primary/5 p-4 rounded-md border border-primary/10">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="mt-1"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="font-medium">
                        I consent to the necessary checks being carried out in relation to my application, including reference checks, employment verification, DBS checks, and health assessments.
                      </FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="declaration.consentToOnlineDbsCheck"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 bg-primary/5 p-4 rounded-md border border-primary/10">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="mt-1"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="font-medium">
                        I consent to online verification of my DBS status
                      </FormLabel>
                      <FormDescription className="text-sm">
                        This allows Swiis to verify my DBS status through the online DBS Update Service, which may speed up the application process.
                      </FormDescription>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="declaration.dataProtection"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 bg-primary/5 p-4 rounded-md border border-primary/10">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="mt-1"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="font-medium">
                        I understand that my personal information will be processed in accordance with data protection regulations and will only be used for the purposes of assessing my suitability as a foster carer.
                      </FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>
        
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
            disabled={isSubmitting}
            className="bg-primary hover:bg-primary/90"
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
          {isSuccess && (
            <Button 
              type="button"
              onClick={() => window.open(`/api/applicants/${applicantId}/pdf`, '_blank')}
              variant="outline"
            >
              Download Application PDF
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}