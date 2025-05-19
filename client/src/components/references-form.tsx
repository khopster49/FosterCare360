import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, BadgeCheck } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useReferences } from "@/hooks/use-references";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

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
  
  // Fetch employment entries
  const { data: employmentEntries = [] } = useQuery({
    queryKey: [`/api/applicants/${applicantId}/employment`],
    enabled: !!applicantId,
  });
  
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
  
  // Create reference request mutations
  const createReference = useMutation({
    mutationFn: async (employmentEntryId: number) => {
      const employmentEntry = employmentEntries.find((entry: any) => entry.id === employmentEntryId);
      if (!employmentEntry) return null;
      
      // Create reference from employment entry data
      const referenceData = {
        applicantId,
        employmentEntryId,
        name: employmentEntry.referenceName,
        email: employmentEntry.referenceEmail,
        phone: employmentEntry.referencePhone,
        employer: employmentEntry.employer,
        position: employmentEntry.position
      };
      
      const res = await apiRequest("POST", `/api/applicants/${applicantId}/references`, referenceData);
      return res.json();
    }
  });
  
  // Handle form submission
  async function onSubmit(values: ReferenceConsentValues) {
    setProcessing(true);
    try {
      // Request references for all required positions
      for (const reference of requiredReferences) {
        await createReference.mutateAsync(reference.id);
      }
      
      toast({
        title: "References requested",
        description: "Reference requests will be sent to all the specified contacts.",
      });
      
      onSuccess();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to process reference requests. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  }
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3">References to be Requested</h3>
          
          {requiredReferences.length === 0 ? (
            <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mb-4">
              <p className="text-amber-800">
                No employment entries found. Please go back and add your employment history.
              </p>
            </div>
          ) : (
            requiredReferences.map((reference: any) => (
              <Card key={reference.id} className="mb-4">
                <CardContent className="pt-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center">
                        <span className="text-base font-medium">{reference.employer}</span>
                        {reference.isCurrent && (
                          <Badge variant="secondary" className="ml-2">Current</Badge>
                        )}
                        {reference.workedWithVulnerable && (
                          <Badge variant="outline" className="ml-2 border-amber-500 text-amber-500">
                            Vulnerable
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-neutral-700 mt-1">
                        Reference: {reference.referenceName} ({reference.referenceEmail})
                      </p>
                      <p className="text-sm text-neutral-700">Position: {reference.position}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className="bg-blue-50 border-blue-200 text-blue-800">
                        Mandatory
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
        
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-3">Reference Consent</h3>
          
          <div className="bg-neutral-50 border border-neutral-200 rounded-md p-4">
            <p className="text-sm text-neutral-700 mb-4">I understand and agree that:</p>
            
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
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 mt-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      I consent to references being sought as described above
                    </FormLabel>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
          </div>
        </div>
        
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
          >
            {processing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing
              </>
            ) : (
              "Next: Verification Checks"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
