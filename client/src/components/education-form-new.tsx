import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Plus, Trash, GraduationCap } from "lucide-react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Create a schema for a single education entry
const educationEntrySchema = z.object({
  institution: z.string().min(1, { message: "Institution name is required" }),
  qualification: z.string().min(1, { message: "Qualification is required" }),
  startDate: z.string().min(1, { message: "Start date is required" }),
  endDate: z.string().min(1, { message: "End date is required" }),
  details: z.string().optional(),
  grade: z.string().optional(),
});

// Create a schema for the entire form with multiple education entries
const educationFormSchema = z.object({
  applicantId: z.number(),
  educationEntries: z.array(educationEntrySchema).min(1, { message: "At least one education entry is required" }),
  breakExplanation: z.string().optional(),
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
  
  // Fetch existing education entries if available
  const { data: existingEntries = [] } = useQuery({
    queryKey: [`/api/applicants/${applicantId}/education`],
    enabled: !!applicantId,
  });
  
  // Set up the form
  const form = useForm<EducationFormValues>({
    resolver: zodResolver(educationFormSchema),
    defaultValues: {
      applicantId,
      educationEntries: existingEntries?.length > 0 
        ? existingEntries 
        : [
            {
              institution: "",
              qualification: "",
              startDate: "",
              endDate: "",
              details: "",
              grade: "",
            },
          ],
      breakExplanation: "",
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
      return await apiRequest(`/api/applicants/${applicantId}/education`, "POST", values);
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
        // Add the breakExplanation to the details if it exists
        if (values.breakExplanation) {
          entry.details = entry.details ? 
            `${entry.details}\n\nBreak explanation: ${values.breakExplanation}` : 
            `Break explanation: ${values.breakExplanation}`;
        }
        
        // Ensure we pass a properly formatted entry
        const formattedEntry = {
          applicantId: applicantId,
          institution: entry.institution,
          qualification: entry.qualification,
          startDate: entry.startDate,
          endDate: entry.endDate,
          details: entry.details || "",
          grade: entry.grade || ""
        };
        
        await createEducationEntry.mutateAsync(formattedEntry);
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card className="border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-4">
              <GraduationCap className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-medium text-primary">Educational History</h2>
            </div>
            <p className="text-md text-neutral-700 mb-4">
              Please provide details of examination passes, qualifications obtained etc. You will be required to provide 
              proof of relevant professional qualifications. Please provide details in sequence with the most recent first. 
              Where you have had a break in your educational history, please give details.
            </p>
          </CardContent>
        </Card>

        {fields.map((field, index) => (
          <Card 
            key={field.id}
            className="border-primary/10 overflow-hidden"
          >
            <div className="bg-primary/5 px-6 py-3 flex justify-between items-center">
              <h3 className="text-md font-medium text-primary">Education Entry {index + 1}</h3>
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
            
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <FormField
                  control={form.control}
                  name={`educationEntries.${index}.institution`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>School/College/University</FormLabel>
                      <FormControl>
                        <Input {...field} />
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
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name={`educationEntries.${index}.grade`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Grade/Result</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name={`educationEntries.${index}.details`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Details</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
        ))}
        
        <Button
          type="button"
          variant="outline"
          onClick={() => append({
            institution: "",
            qualification: "",
            startDate: "",
            endDate: "",
            details: "",
            grade: "",
          })}
          className="mt-2 w-full"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Another Education Entry
        </Button>
        
        <Card className="border-primary/20">
          <CardContent className="pt-6">
            <FormField
              control={form.control}
              name="breakExplanation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Other relevant training courses (including in-house) completed which are relevant to the post</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="List any relevant training courses with the organizing body, course content, dates attended and qualifications (if applicable)"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    If you had a break in your educational history, please explain the reason here.
                  </FormDescription>
                  <FormMessage />
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
            Back: Personal Info
          </Button>
          
          <Button type="submit" disabled={submitting} className="bg-primary hover:bg-primary/90">
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