import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Shield, Loader2 } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";

// Create schema for the disciplinary form
const disciplinaryFormSchema = z.object({
  applicantId: z.number(),
  
  // Disciplinary fields
  hasDisciplinary: z.boolean().optional(),
  disciplinaryDetails: z.string().optional(),
  
  // Criminal record questions
  hasPoliceWarning: z.boolean().optional(),
  hasUnresolvedCharges: z.boolean().optional(),
  hasPoliceInvestigation: z.boolean().optional(),
  hasDismissedForMisconduct: z.boolean().optional(),
  hasProfessionalDisqualification: z.boolean().optional(),
  hasOngoingInvestigation: z.boolean().optional(),
  hasProhibition: z.boolean().optional(),
  
  criminalDetails: z.string().optional(),
  
  // Agreement field
  acknowledgment: z.boolean().default(false),
});

type DisciplinaryFormValues = z.infer<typeof disciplinaryFormSchema>;

interface DisciplinaryFormProps {
  applicantId: number;
  onSuccess: () => void;
  onBack: () => void;
}

export function DisciplinaryForm({ applicantId, onSuccess, onBack }: DisciplinaryFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDisciplinaryDetails, setShowDisciplinaryDetails] = useState(false);
  const [showCriminalDetails, setShowCriminalDetails] = useState(false);
  
  // Load data from localStorage
  const loadFromLocalStorage = (): DisciplinaryFormValues => {
    try {
      const stored = localStorage.getItem(`disciplinary_${applicantId}`);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Failed to load disciplinary data:', error);
    }
    
    return {
      applicantId,
      hasDisciplinary: false,
      disciplinaryDetails: "",
      hasPoliceWarning: false,
      hasUnresolvedCharges: false,
      hasPoliceInvestigation: false,
      hasDismissedForMisconduct: false,
      hasProfessionalDisqualification: false,
      hasOngoingInvestigation: false,
      hasProhibition: false,
      criminalDetails: "",
      acknowledgment: false,
    };
  };

  // Save data to localStorage
  const saveToLocalStorage = (values: DisciplinaryFormValues) => {
    try {
      localStorage.setItem(`disciplinary_${applicantId}`, JSON.stringify(values));
    } catch (error) {
      console.warn('Failed to save disciplinary data:', error);
    }
  };
  
  // Set up the form
  const form = useForm<DisciplinaryFormValues>({
    resolver: zodResolver(disciplinaryFormSchema),
    defaultValues: loadFromLocalStorage(),
  });
  
  // Handle form submission
  async function onSubmit(values: DisciplinaryFormValues) {
    setIsSubmitting(true);
    try {
      // Save to localStorage
      saveToLocalStorage(values);
      
      toast({
        title: "Disciplinary & Criminal record saved",
        description: "Your information has been saved successfully.",
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
  
  // Watch for changes to the hasDisciplinary field
  const watchHasDisciplinary = form.watch("hasDisciplinary");
  const anyYesAnswers = form.watch(["hasPoliceWarning", "hasUnresolvedCharges", "hasPoliceInvestigation", 
    "hasDismissedForMisconduct", "hasProfessionalDisqualification", "hasOngoingInvestigation", "hasProhibition"]);
  
  // Update the form state when the hasDisciplinary field changes
  useEffect(() => {
    setShowDisciplinaryDetails(!!watchHasDisciplinary);
  }, [watchHasDisciplinary]);
  
  // Update the form state when any of the criminal record fields change
  useEffect(() => {
    setShowCriminalDetails(anyYesAnswers.some(answer => !!answer));
  }, [anyYesAnswers]);
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card className="border-primary/20">
          <CardContent className="pt-6">
            <h3 className="text-3xl font-medium text-primary mb-6">Disciplinary & Criminal Issues</h3>
            
            {/* Disciplinary Section */}
            <div className="p-4 border-[1px] border-gray-300 mb-4">
              <FormField
                control={form.control}
                name="hasDisciplinary"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-2">
                    <div className="grid grid-cols-[1fr_200px] items-center w-full">
                      <FormLabel className="font-normal">
                        Have you ever been subject to a Disciplinary/Suspension or Dismissal?
                      </FormLabel>
                      <div className="flex items-center justify-start gap-6">
                        <div className="flex items-center space-x-2">
                          <FormLabel htmlFor="yes-disciplinary" className="font-normal cursor-pointer">Yes</FormLabel>
                          <FormControl>
                            <Checkbox
                              id="yes-disciplinary"
                              checked={field.value === true}
                              onCheckedChange={() => form.setValue("hasDisciplinary", true)}
                            />
                          </FormControl>
                        </div>
                        <div className="flex items-center space-x-2">
                          <FormLabel htmlFor="no-disciplinary" className="font-normal cursor-pointer">No</FormLabel>
                          <FormControl>
                            <Checkbox
                              id="no-disciplinary"
                              checked={field.value === false}
                              onCheckedChange={() => form.setValue("hasDisciplinary", false)}
                            />
                          </FormControl>
                        </div>
                      </div>
                    </div>
                  </FormItem>
                )}
              />
            </div>
            
            {showDisciplinaryDetails && (
              <div className="p-4 border-[1px] border-gray-300 mb-4">
                <FormField
                  control={form.control}
                  name="disciplinaryDetails"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-normal">
                        If yes, please give details below (please use a separate sheet if necessary)
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Provide details about disciplinary actions"
                          className="mt-2 min-h-[150px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
            
            {/* Legal notice */}
            <div className="mb-6 bg-neutral-50 p-4 border-l-4 border-primary/60 text-sm text-gray-700">
              <p className="mb-4">
                The position for which you have applied involves regulated activity with children and is exempt from the Rehabilitation
                of Offenders Act 1974 under the Rehabilitation of Offenders Act 1974 (Exceptions) Order 1975. You must not apply if
                you are on the children's barred list and your application will not be considered. As the role you are applying for is
                covered by the Exceptions Order, you must disclose all previous convictions even if they are considered "spent" (if
                applicable).
              </p>
            </div>
            
            {/* Criminal Record Questions */}
            <div className="space-y-2 mb-6">
              <div className="p-4 border-[1px] border-gray-300">
                <FormField
                  control={form.control}
                  name="hasPoliceWarning"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-[50px_1fr_200px] items-center gap-2">
                      <div className="text-right font-semibold">1.</div>
                      <FormLabel className="font-normal leading-tight">
                        Have you ever received a police caution, public order offence, reprimand, fine or final warning?
                      </FormLabel>
                      <div className="flex items-center justify-start gap-6">
                        <div className="flex items-center space-x-2">
                          <FormLabel htmlFor="yes-warning" className="font-normal cursor-pointer">Yes</FormLabel>
                          <FormControl>
                            <Checkbox
                              id="yes-warning"
                              checked={field.value === true}
                              onCheckedChange={() => form.setValue("hasPoliceWarning", true)}
                            />
                          </FormControl>
                        </div>
                        <div className="flex items-center space-x-2">
                          <FormLabel htmlFor="no-warning" className="font-normal cursor-pointer">No</FormLabel>
                          <FormControl>
                            <Checkbox
                              id="no-warning"
                              checked={field.value === false}
                              onCheckedChange={() => form.setValue("hasPoliceWarning", false)}
                            />
                          </FormControl>
                        </div>
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              <div className="p-4 border-[1px] border-gray-300">
                <FormField
                  control={form.control}
                  name="hasUnresolvedCharges"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-[50px_1fr_200px] items-center gap-2">
                      <div className="text-right font-semibold">2.</div>
                      <FormLabel className="font-normal leading-tight">
                        Have you ever been charged with any offence in the UK or, in any other country that has not
                        yet been disposed of? You must inform us immediately if you are charged with an offence
                        after you complete this form, and before taking up any position offered to you.
                      </FormLabel>
                      <div className="flex items-center justify-start gap-6">
                        <div className="flex items-center space-x-2">
                          <FormLabel htmlFor="yes-charges" className="font-normal cursor-pointer">Yes</FormLabel>
                          <FormControl>
                            <Checkbox
                              id="yes-charges"
                              checked={field.value === true}
                              onCheckedChange={() => form.setValue("hasUnresolvedCharges", true)}
                            />
                          </FormControl>
                        </div>
                        <div className="flex items-center space-x-2">
                          <FormLabel htmlFor="no-charges" className="font-normal cursor-pointer">No</FormLabel>
                          <FormControl>
                            <Checkbox
                              id="no-charges"
                              checked={field.value === false}
                              onCheckedChange={() => form.setValue("hasUnresolvedCharges", false)}
                            />
                          </FormControl>
                        </div>
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              <div className="p-4 border-[1px] border-gray-300">
                <FormField
                  control={form.control}
                  name="hasPoliceInvestigation"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-[50px_1fr_200px] items-center gap-2">
                      <div className="text-right font-semibold">3.</div>
                      <FormLabel className="font-normal leading-tight">
                        Are you aware of any current police investigation in the UK or in any other country following
                        allegations made against you?
                      </FormLabel>
                      <div className="flex items-center justify-start gap-6">
                        <div className="flex items-center space-x-2">
                          <FormLabel htmlFor="yes-investigation" className="font-normal cursor-pointer">Yes</FormLabel>
                          <FormControl>
                            <Checkbox
                              id="yes-investigation"
                              checked={field.value === true}
                              onCheckedChange={() => form.setValue("hasPoliceInvestigation", true)}
                            />
                          </FormControl>
                        </div>
                        <div className="flex items-center space-x-2">
                          <FormLabel htmlFor="no-investigation" className="font-normal cursor-pointer">No</FormLabel>
                          <FormControl>
                            <Checkbox
                              id="no-investigation"
                              checked={field.value === false}
                              onCheckedChange={() => form.setValue("hasPoliceInvestigation", false)}
                            />
                          </FormControl>
                        </div>
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              <div className="p-4 border-[1px] border-gray-300">
                <FormField
                  control={form.control}
                  name="hasDismissedForMisconduct"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-[50px_1fr_200px] items-center gap-2">
                      <div className="text-right font-semibold">4.</div>
                      <FormLabel className="font-normal leading-tight">
                        Have you ever been dismissed for misconduct from any employment, office or other position
                        held by you?
                      </FormLabel>
                      <div className="flex items-center justify-start gap-6">
                        <div className="flex items-center space-x-2">
                          <FormLabel htmlFor="yes-misconduct" className="font-normal cursor-pointer">Yes</FormLabel>
                          <FormControl>
                            <Checkbox
                              id="yes-misconduct"
                              checked={field.value === true}
                              onCheckedChange={() => form.setValue("hasDismissedForMisconduct", true)}
                            />
                          </FormControl>
                        </div>
                        <div className="flex items-center space-x-2">
                          <FormLabel htmlFor="no-misconduct" className="font-normal cursor-pointer">No</FormLabel>
                          <FormControl>
                            <Checkbox
                              id="no-misconduct"
                              checked={field.value === false}
                              onCheckedChange={() => form.setValue("hasDismissedForMisconduct", false)}
                            />
                          </FormControl>
                        </div>
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              <div className="p-4 border-[1px] border-gray-300">
                <FormField
                  control={form.control}
                  name="hasProfessionalDisqualification"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-[50px_1fr_200px] items-center gap-2">
                      <div className="text-right font-semibold">5.</div>
                      <FormLabel className="font-normal leading-tight">
                        Have you ever been disqualified from the practice of a profession or required to practice
                        subject to specified limitations following fitness to practice proceedings by a regulatory or
                        licensing body in the UK or in any other country?
                      </FormLabel>
                      <div className="flex items-center justify-start gap-6">
                        <div className="flex items-center space-x-2">
                          <FormLabel htmlFor="yes-disqualified" className="font-normal cursor-pointer">Yes</FormLabel>
                          <FormControl>
                            <Checkbox
                              id="yes-disqualified"
                              checked={field.value === true}
                              onCheckedChange={() => form.setValue("hasProfessionalDisqualification", true)}
                            />
                          </FormControl>
                        </div>
                        <div className="flex items-center space-x-2">
                          <FormLabel htmlFor="no-disqualified" className="font-normal cursor-pointer">No</FormLabel>
                          <FormControl>
                            <Checkbox
                              id="no-disqualified"
                              checked={field.value === false}
                              onCheckedChange={() => form.setValue("hasProfessionalDisqualification", false)}
                            />
                          </FormControl>
                        </div>
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              <div className="p-4 border-[1px] border-gray-300">
                <FormField
                  control={form.control}
                  name="hasOngoingInvestigation"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-[50px_1fr_200px] items-center gap-2">
                      <div className="text-right font-semibold">6.</div>
                      <FormLabel className="font-normal leading-tight">
                        Are you currently the subject of any investigation or fitness to practice proceedings by a
                        licensing or regulatory body in the UK or in any other country?
                      </FormLabel>
                      <div className="flex items-center justify-start gap-6">
                        <div className="flex items-center space-x-2">
                          <FormLabel htmlFor="yes-ongoing" className="font-normal cursor-pointer">Yes</FormLabel>
                          <FormControl>
                            <Checkbox
                              id="yes-ongoing"
                              checked={field.value === true}
                              onCheckedChange={() => form.setValue("hasOngoingInvestigation", true)}
                            />
                          </FormControl>
                        </div>
                        <div className="flex items-center space-x-2">
                          <FormLabel htmlFor="no-ongoing" className="font-normal cursor-pointer">No</FormLabel>
                          <FormControl>
                            <Checkbox
                              id="no-ongoing"
                              checked={field.value === false}
                              onCheckedChange={() => form.setValue("hasOngoingInvestigation", false)}
                            />
                          </FormControl>
                        </div>
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              <div className="p-4 border-[1px] border-gray-300">
                <FormField
                  control={form.control}
                  name="hasProhibition"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-[50px_1fr_200px] items-center gap-2">
                      <div className="text-right font-semibold">7.</div>
                      <FormLabel className="font-normal leading-tight">
                        Are you subject to any other prohibition, limitation, or restriction that means we are unable
                        to consider you for the position for which you are applying? This question relates to a
                        position which involves regular contact with children and vulnerable adults.
                      </FormLabel>
                      <div className="flex items-center justify-start gap-6">
                        <div className="flex items-center space-x-2">
                          <FormLabel htmlFor="yes-prohibition" className="font-normal cursor-pointer">Yes</FormLabel>
                          <FormControl>
                            <Checkbox
                              id="yes-prohibition"
                              checked={field.value === true}
                              onCheckedChange={() => form.setValue("hasProhibition", true)}
                            />
                          </FormControl>
                        </div>
                        <div className="flex items-center space-x-2">
                          <FormLabel htmlFor="no-prohibition" className="font-normal cursor-pointer">No</FormLabel>
                          <FormControl>
                            <Checkbox
                              id="no-prohibition"
                              checked={field.value === false}
                              onCheckedChange={() => form.setValue("hasProhibition", false)}
                            />
                          </FormControl>
                        </div>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <div className="p-4 border-[1px] border-gray-300 mb-6">
              <FormField
                control={form.control}
                name="criminalDetails"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-normal">
                      If you have answered yes to any of the questions above, please give full details here.
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Provide details about any 'Yes' answers above"
                        className="mt-2 min-h-[150px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
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
            Back to References
          </Button>
          
          <Button 
            type="submit"
            disabled={isSubmitting}
            className="bg-primary hover:bg-primary/90"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving
              </>
            ) : (
              "Next: Declaration & Confidentiality"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}