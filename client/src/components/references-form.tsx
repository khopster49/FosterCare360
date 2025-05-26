import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { BadgeCheck, FileCheck, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useReferences } from "@/hooks/use-references";

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
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

// Create schema for the form
const referenceConsentSchema = z.object({
  applicantId: z.number(),
  consent: z.boolean().refine(value => value === true, {
    message: "You must provide consent to proceed",
  }),
});

type ReferenceConsentValues = z.infer<typeof referenceConsentSchema>;

interface ReferencesFormProps {
  applicantId: number;
  onSuccess: () => void;
  onBack: () => void;
}

export function ReferencesForm({ applicantId, onSuccess, onBack }: ReferencesFormProps) {
  const { toast } = useToast();
  const [processing, setProcessing] = useState(false);
  const [employmentEntries, setEmploymentEntries] = useState([]);
  
  // Load employment entries from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`employment_${applicantId}`);
      if (saved) {
        const data = JSON.parse(saved);
        setEmploymentEntries(data.employmentEntries || []);
      }
    } catch (error) {
      console.warn('Failed to load employment data:', error);
    }
  }, [applicantId]);

  // Use the references hook to determine required references
  const { requiredReferences } = useReferences(employmentEntries);
  
  // Set up the form
  const form = useForm<ReferenceConsentValues>({
    resolver: zodResolver(referenceConsentSchema),
    defaultValues: {
      applicantId,
      consent: false,
    },
  });
  
  // Save references to localStorage
  const saveReferences = (references: any[]) => {
    try {
      localStorage.setItem(`references_${applicantId}`, JSON.stringify(references));
    } catch (error) {
      console.warn('Failed to save references data:', error);
    }
  };
  
  // Handle form submission
  async function onSubmit(values: ReferenceConsentValues) {
    setProcessing(true);
    try {
      // Save reference consent and data to localStorage
      const referenceData = requiredReferences.map(reference => ({
        applicantId,
        name: reference.referenceName,
        email: reference.referenceEmail,
        phone: reference.referencePhone,
        employer: reference.employer,
        employerAddress: reference.employerAddress || '',
        position: reference.position,
        consentGiven: true,
        requestedAt: new Date().toISOString()
      }));
      
      saveReferences(referenceData);
      
      toast({
        title: "References Consent Recorded",
        description: "Your consent for reference requests has been recorded successfully.",
      });
      
      onSuccess();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to save reference information. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  }
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card className="border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-4">
              <FileCheck className="h-6 w-6 text-primary" />
              <h3 className="text-lg font-medium text-primary">References</h3>
            </div>
            <p className="text-sm text-neutral-600 mb-4">
              As part of the fostering application process and in accordance with Schedule 1 of the UK fostering regulations,
              we are required to obtain references from current and previous employers, and from all roles where you worked with 
              children or vulnerable adults.
            </p>
            <p className="text-sm text-neutral-600 mb-4">
              Below are the references that will be requested based on the employment history you provided.
              Each reference is mandatory for compliance with fostering regulations.
            </p>
          </CardContent>
        </Card>
        
        {requiredReferences.length === 0 ? (
          <Card className="border-amber-300">
            <CardContent className="pt-6 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-amber-800 mb-1">No Employment History Found</h4>
                <p className="text-sm text-amber-700">
                  Please go back to the Employment History section and add your employment details. 
                  We need this information to request appropriate references for your fostering application.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-md font-medium text-primary">References to be Requested</h3>
              <Separator className="flex-1" />
            </div>
            
            {requiredReferences.map((reference: any) => (
              <Card key={reference.id} className="border-primary/10 overflow-hidden">
                <div className="bg-primary/5 px-6 py-3 flex justify-between items-center">
                  <h4 className="text-md font-medium text-primary">
                    {reference.employer}
                  </h4>
                  <div className="flex gap-2">
                    {reference.isCurrent && (
                      <Badge className="bg-primary text-white">Current</Badge>
                    )}
                    {reference.workedWithVulnerable && (
                      <Badge variant="outline" className="border-amber-500 text-amber-700 bg-amber-50">
                        Vulnerable
                      </Badge>
                    )}
                  </div>
                </div>
                
                <CardContent className="pt-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-neutral-700">Contact Information</p>
                      <div className="mt-2 space-y-1 text-sm">
                        <p><span className="font-medium">Name:</span> {reference.referenceName}</p>
                        <p><span className="font-medium">Email:</span> {reference.referenceEmail}</p>
                        <p><span className="font-medium">Phone:</span> {reference.referencePhone}</p>
                        <p><span className="font-medium">Employer Address:</span> {reference.employerAddress || 'Not provided'}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-neutral-700">Position Details</p>
                      <div className="mt-2 space-y-1 text-sm">
                        <p><span className="font-medium">Position:</span> {reference.position}</p>
                        <p><span className="font-medium">Reference Type:</span> 
                          {reference.isCurrent ? " Current Employer" : " Previous Employer"}
                          {reference.workedWithVulnerable ? ", Vulnerable Sector" : ""}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        
        <Card className="border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-md font-medium text-primary">Reference Consent</h3>
              <Separator className="flex-1" />
            </div>
            
            <div className="space-y-4">
              <p className="text-sm text-neutral-700">I understand and agree that:</p>
              
              <ul className="list-disc pl-5 mb-4 text-sm text-neutral-700 space-y-2">
                <li>References will be sought from my current and previous employers as listed above.</li>
                <li>Additional references will be sought from all roles where I worked with children or vulnerable adults.</li>
                <li>Reference requests will be sent automatically via email to the addresses I have provided.</li>
                <li>After receiving written references, the organization will conduct follow-up telephone verification calls with the referees.</li>
                <li>The information obtained through references will be used as part of the fostering assessment process in line with Schedule 1 of the UK fostering regulations.</li>
              </ul>
              
              <FormField
                control={form.control}
                name="consent"
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
                        I consent to references being sought as described above
                      </FormLabel>
                      <FormDescription className="text-sm">
                        This consent is required to proceed with your fostering application according to UK regulations.
                      </FormDescription>
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
            Back: Employment History
          </Button>
          
          <Button 
            type="submit" 
            disabled={processing || requiredReferences.length === 0}
            className="bg-primary hover:bg-primary/90"
          >
            {processing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing
              </>
            ) : (
              "Next: Disciplinary & Criminal Issues"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
