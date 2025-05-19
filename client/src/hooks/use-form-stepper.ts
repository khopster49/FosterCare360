import { useState, useCallback } from 'react';

export interface UseFormStepperOptions {
  initialStep?: number;
  totalSteps: number;
  onStepChange?: (newStep: number, previousStep: number) => void;
  validateStep?: (step: number) => Promise<boolean> | boolean;
}

export function useFormStepper({
  initialStep = 0,
  totalSteps,
  onStepChange,
  validateStep,
}: UseFormStepperOptions) {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const goToStep = useCallback(async (step: number) => {
    if (step < 0 || step >= totalSteps) {
      return false;
    }

    // If validation function is provided, run it before changing steps
    if (validateStep) {
      const isValid = await validateStep(currentStep);
      if (!isValid) {
        return false;
      }
    }

    const previousStep = currentStep;
    setCurrentStep(step);
    
    // Mark previous step as completed when moving forward
    if (step > previousStep && !completedSteps.includes(previousStep)) {
      setCompletedSteps(prev => [...prev, previousStep]);
    }
    
    if (onStepChange) {
      onStepChange(step, previousStep);
    }
    
    return true;
  }, [currentStep, totalSteps, validateStep, onStepChange, completedSteps]);

  const nextStep = useCallback(async () => {
    return goToStep(currentStep + 1);
  }, [currentStep, goToStep]);

  const previousStep = useCallback(() => {
    return goToStep(currentStep - 1);
  }, [currentStep, goToStep]);

  const isStepComplete = useCallback((step: number) => {
    return completedSteps.includes(step);
  }, [completedSteps]);

  const markStepComplete = useCallback((step: number) => {
    if (!completedSteps.includes(step)) {
      setCompletedSteps(prev => [...prev, step]);
    }
  }, [completedSteps]);

  const resetStepper = useCallback(() => {
    setCurrentStep(initialStep);
    setCompletedSteps([]);
  }, [initialStep]);

  return {
    currentStep,
    isFirstStep: currentStep === 0,
    isLastStep: currentStep === totalSteps - 1,
    goToStep,
    nextStep,
    previousStep,
    isStepComplete,
    markStepComplete,
    resetStepper,
    completedSteps,
  };
}
