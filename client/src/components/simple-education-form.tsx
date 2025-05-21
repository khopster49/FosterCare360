import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { GraduationCap, Loader2, Plus, Trash } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

// Define schemas
const educationEntrySchema = z.object({
  institution: z.string().min(1, "Institution is required"),
  qualification: z.string().min(1, "Qualification is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  details: z.string().optional(),
});

const formSchema = z.object({
  educationEntries: z.array(educationEntrySchema).min(1, "At least one education entry is required"),
  otherTraining: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface EducationFormProps {
  applicantId: number;
  onSuccess: () => void;
  onBack: () => void;
}

export function EducationForm({ applicantId, onSuccess, onBack }: EducationFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Set up form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      educationEntries: [
        { institution: "", qualification: "", startDate: "", endDate: "", details: "" }
      ],
      otherTraining: "",
    }
  });

  // Set up education entries field array
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "educationEntries"
  });

  // Set up create education entry mutation
  const createEducationEntry = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest(`/api/applicants/${applicantId}/education`, "POST", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/applicants/${applicantId}/education`] });
    }
  });

  // Handle form submission
  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);
    
    try {
      // Process each education entry
      for (const entry of values.educationEntries) {
        const formattedEntry = {
          applicantId,
          institution: entry.institution,
          qualification: entry.qualification,
          startDate: entry.startDate,
          endDate: entry.endDate,
          details: entry.details || ""
        };
        
        await createEducationEntry.mutateAsync(formattedEntry);
      }
      
      toast({
        title: "Education information saved",
        description: "Your education history has been successfully saved."
      });
      
      onSuccess();
    } catch (error: any) {
      toast({
        title: "Error saving education information",
        description: error.message || "An error occurred while saving your education information.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-4">
              <GraduationCap className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-medium text-primary">Education History</h2>
            </div>
            <p className="text-sm text-neutral-700 mb-6">
              Please provide details of examination passes, qualifications obtained etc. You will be required to provide 
              proof of relevant professional qualifications. Please provide details in sequence with the most recent first. 
              Where you have had a break in your educational history, please give details.
            </p>
          </CardContent>
        </Card>

        {fields.map((field, index) => (
          <Card key={field.id} className="border-primary/10">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-primary">Education Entry {index + 1}</h3>
                {fields.length > 1 && (
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={() => remove(index)}
                  >
                    <Trash className="h-4 w-4 mr-2" />
                    Remove
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <FormField
                  control={form.control}
                  name={`educationEntries.${index}.institution`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>School/College/University</FormLabel>
                      <FormControl>
                        <Input placeholder="Institution name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`educationEntries.${index}.qualification`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Qualification/Subject</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Bachelor's Degree, GCSE" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <FormField
                  control={form.control}
                  name={`educationEntries.${index}.startDate`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`educationEntries.${index}.endDate`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name={`educationEntries.${index}.details`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Details</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Any additional information about this qualification" 
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        ))}

        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => append({ 
            institution: "", 
            qualification: "", 
            startDate: "", 
            endDate: "", 
            details: "" 
          })}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Another Education Entry
        </Button>

        <Card>
          <CardContent className="pt-6">
            <FormField
              control={form.control}
              name="otherTraining"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Other relevant training courses</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="List any relevant training courses with the organizing body, course content, dates attended and qualifications (if applicable)"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="flex justify-between mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
          >
            Back: Personal Info
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
              "Next: Employment History"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}