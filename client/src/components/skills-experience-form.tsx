import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, PenLine } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// Create schema for the form
const skillsExperienceSchema = z.object({
  applicantId: z.number(),
  skillsAndExperience: z.string().min(50, {
    message: "Your answer must be at least 50 characters. Please provide a detailed explanation."
  }),
});

type SkillsExperienceFormValues = z.infer<typeof skillsExperienceSchema>;

interface SkillsExperienceFormProps {
  applicantId: number;
  onSuccess: () => void;
  onBack: () => void;
}

export function SkillsExperienceForm({ applicantId, onSuccess, onBack }: SkillsExperienceFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Fetch applicant data to see if we have existing skills and experience text
  const { data: applicant } = useQuery({
    queryKey: [`/api/applicants/${applicantId}`],
    enabled: !!applicantId,
  });
  
  // Set up the form
  const form = useForm<SkillsExperienceFormValues>({
    resolver: zodResolver(skillsExperienceSchema),
    defaultValues: {
      applicantId,
      skillsAndExperience: applicant?.skillsAndExperience || "",
    },
  });

  // Update form when applicant data loads
  if (applicant?.skillsAndExperience && !form.getValues("skillsAndExperience")) {
    form.setValue("skillsAndExperience", applicant.skillsAndExperience);
  }
  
  // Create mutation for updating applicant
  const updateApplicant = useMutation({
    mutationFn: async (values: SkillsExperienceFormValues) => {
      const res = await apiRequest("PATCH", `/api/applicants/${applicantId}`, {
        skillsAndExperience: values.skillsAndExperience,
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`/api/applicants/${applicantId}`],
      });
    },
  });
  
  // Handle form submission
  async function onSubmit(values: SkillsExperienceFormValues) {
    setIsSubmitting(true);
    try {
      await updateApplicant.mutateAsync(values);
      
      toast({
        title: "Skills and experience saved",
        description: "Your skills and experience have been saved successfully.",
      });
      
      onSuccess();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save your skills and experience. Please try again.",
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
            <div className="flex items-center gap-3 mb-4">
              <PenLine className="h-6 w-6 text-primary" />
              <h3 className="text-lg font-medium text-primary">Skills and Experience</h3>
            </div>
            
            <FormField
              control={form.control}
              name="skillsAndExperience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-md font-medium">Why are you suited to be a foster carer?</FormLabel>
                  <FormDescription className="text-neutral-700">
                    In your own words, please explain why you consider yourself suited to this position outlining what you would
                    contribute to the post if appointed, by reference to the job description and/or person specification.
                  </FormDescription>
                  <FormControl>
                    <Textarea
                      placeholder="Please provide details about your relevant skills, qualities, and experience..."
                      className="min-h-[250px]"
                      {...field}
                    />
                  </FormControl>
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
            Back: Employment History
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
              "Next: References"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}