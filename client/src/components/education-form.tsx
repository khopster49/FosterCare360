import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Plus, Trash } from "lucide-react";
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

// Create a schema for a single education entry
const educationEntrySchema = z.object({
  institution: z.string().min(1, { message: "Institution name is required" }),
  qualification: z.string().min(1, { message: "Qualification is required" }),
  startDate: z.string().min(1, { message: "Start date is required" }),
  endDate: z.string().min(1, { message: "End date is required" }),
  details: z.string().optional(),
});

// Create a schema for the entire form with multiple education entries
const educationFormSchema = z.object({
  applicantId: z.number(),
  educationEntries: z.array(educationEntrySchema).min(1, { message: "At least one education entry is required" }),
});

type EducationFormValues = z.infer<typeof educationFormSchema>;

interface EducationFormProps {
  applicantId: number;
  onSuccess: () => void;
  onBack: () => void;
}

export function EducationForm({ applicantId, onSuccess, onBack }: EducationFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [submitting, setSubmitting] = useState(false);
  
  // Set up the form
  const form = useForm<EducationFormValues>({
    resolver: zodResolver(educationFormSchema),
    defaultValues: {
      applicantId,
      educationEntries: [
        {
          institution: "",
          qualification: "",
          startDate: "",
          endDate: "",
          details: "",
        },
      ],
    },
  });
  
  // Set up field array for education entries
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "educationEntries",
  });
  
  // Create education entry mutation
  const createEducationEntry = useMutation({
    mutationFn: async (values: any) => {
      const res = await apiRequest("POST", `/api/applicants/${applicantId}/education`, values);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/applicants/${applicantId}/education`] });
    },
  });
  
  // Handle form submission
  async function onSubmit(values: EducationFormValues) {
    setSubmitting(true);
    try {
      // Submit each education entry separately
      for (const entry of values.educationEntries) {
        await createEducationEntry.mutateAsync(entry);
      }
      
      toast({
        title: "Education information saved",
        description: "Your education history has been saved successfully.",
      });
      
      onSuccess();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save education information. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {fields.map((field, index) => (
          <div 
            key={field.id}
            className="education-entry bg-neutral-50 border border-neutral-200 rounded-md p-4 mb-4"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Education Entry {index + 1}</h3>
              {fields.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => remove(index)}
                  className="text-neutral-700 hover:text-destructive"
                >
                  <Trash className="h-5 w-5" />
                </Button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <FormField
                control={form.control}
                name={`educationEntries.${index}.institution`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Institution Name</FormLabel>
                    <FormControl>
                      <Input placeholder="University of Example" {...field} />
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
                    <FormLabel>Qualification</FormLabel>
                    <FormControl>
                      <Input placeholder="BSc Social Work" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
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
                      placeholder="Add any relevant details about your studies, achievements, etc."
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        ))}
        
        <div className="mb-6">
          <Button
            type="button"
            variant="outline"
            className="text-primary border-primary hover:bg-blue-50"
            onClick={() =>
              append({
                institution: "",
                qualification: "",
                startDate: "",
                endDate: "",
                details: "",
              })
            }
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Another Education
          </Button>
        </div>
        
        <div className="mt-8 flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
          >
            Back: Personal Info
          </Button>
          
          <Button type="submit" disabled={submitting}>
            {submitting ? (
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
