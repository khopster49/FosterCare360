import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Save } from "lucide-react";

interface SaveExitButtonProps {
  applicantId?: number;
  currentStep: number;
  onSave?: () => void;
}

export function SaveExitButton({ applicantId, currentStep, onSave }: SaveExitButtonProps) {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [showDialog, setShowDialog] = useState(false);
  
  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      if (!applicantId) return;
      
      const response = await apiRequest(
        `/api/applicants/${applicantId}/progress`, 
        "PATCH", 
        { 
          lastCompletedStep: currentStep,
          saveDate: new Date().toISOString(),
        }
      );
      return response;
    },
    onSuccess: () => {
      // Call the onSave callback if provided
      if (onSave) onSave();
      
      toast({
        title: "Progress saved",
        description: "Your application progress has been saved. You can return to continue later.",
      });
      
      // Redirect to dashboard after saving
      setLocation("/dashboard");
    },
    onError: (error) => {
      toast({
        title: "Error saving progress",
        description: error.message || "There was a problem saving your progress. Please try again.",
        variant: "destructive",
      });
      setShowDialog(false);
    },
  });
  
  function handleSaveAndExit() {
    if (applicantId) {
      mutate();
    } else {
      toast({
        title: "Cannot save progress",
        description: "You need to complete at least the Personal Information section first.",
        variant: "destructive",
      });
      setShowDialog(false);
    }
  }
  
  return (
    <>
      <Button 
        variant="outline" 
        className="flex items-center gap-2" 
        onClick={() => setShowDialog(true)}
      >
        <Save className="h-4 w-4" />
        Save & Exit
      </Button>
      
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save your progress and exit?</DialogTitle>
            <DialogDescription>
              Your application progress will be saved. You can return to continue from where you left off later.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSaveAndExit} 
              disabled={isPending}
            >
              {isPending ? "Saving..." : "Save & Exit"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}