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
  
  // Load existing data from localStorage
  const loadFromLocalStorage = () => {
    try {
      const saved = localStorage.getItem(`skills_${applicantId}`);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.warn('Failed to load skills data from localStorage:', error);
    }
    return {
      applicantId,
      skillsAndExperience: "",
    };
  };
  
  // Set up the form
  const form = useForm<SkillsExperienceFormValues>({
    resolver: zodResolver(skillsExperienceSchema),
    defaultValues: loadFromLocalStorage(),
  });
  
  // Save to localStorage function
  const saveToLocalStorage = (values: SkillsExperienceFormValues) => {
    try {
      localStorage.setItem(`skills_${applicantId}`, JSON.stringify(values));
    } catch (error) {
      console.warn('Failed to save skills data to localStorage:', error);
    }
  };
  
  // Handle form submission
  async function onSubmit(values: SkillsExperienceFormValues) {
    setIsSubmitting(true);
    try {
      saveToLocalStorage(values);
      
      toast({
        title: "Skills and experience saved",
        description: "Your skills and experience have been saved successfully.",
      });
      
      onSuccess();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to save your skills and experience. Please try again.",
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
            <h3 className="text-3xl font-medium text-primary mb-6">Skills and Experience</h3>
            
            <FormField
              control={form.control}
              name="skillsAndExperience"
              render={({ field }) => (
                <FormItem>
                  <FormDescription className="text-neutral-700 text-base mt-2">
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
            Back to Employment
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