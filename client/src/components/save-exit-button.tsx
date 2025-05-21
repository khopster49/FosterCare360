import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SaveExitButtonProps {
  applicantId: number;
  currentStep: number;
}

export function SaveExitButton({ applicantId, currentStep }: SaveExitButtonProps) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  // Mutation for saving progress
  const mutation = useMutation({
    mutationFn: async () => {
      setIsSaving(true);
      return await apiRequest(`/api/applicants/${applicantId}/progress`, "PATCH", {
        lastCompletedStep: currentStep,
        saveDate: new Date().toISOString()
      });
    },
    onSuccess: () => {
      toast({
        title: "Progress saved",
        description: "Your application progress has been saved. You can return to complete it later.",
      });
      // Redirect to dashboard after saving
      setLocation("/dashboard");
    },
    onError: (error: any) => {
      toast({
        title: "Error saving progress",
        description: error.message || "There was a problem saving your progress. Please try again.",
        variant: "destructive",
      });
      setIsSaving(false);
    }
  });

  const handleSaveAndExit = () => {
    mutation.mutate();
  };

  return (
    <Button 
      variant="outline" 
      className="gap-2"
      onClick={handleSaveAndExit}
      disabled={isSaving}
    >
      {isSaving ? (
        <>
          <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
          Saving...
        </>
      ) : (
        <>
          <Save className="h-4 w-4" />
          Save & Exit
        </>
      )}
    </Button>
  );
}