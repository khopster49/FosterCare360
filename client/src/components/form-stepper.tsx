import { cn } from "@/lib/utils";

export type Step = {
  id: number;
  label: string;
};

interface FormStepperProps {
  steps: Step[];
  currentStep: number;
  completedSteps: number[];
  onStepClick?: (stepIndex: number) => void;
}

export function FormStepper({ steps, currentStep, completedSteps, onStepClick }: FormStepperProps) {
  return (
    <div className="mb-12">
      <div className="flex items-center justify-between max-w-4xl mx-auto">
        {steps.map((step, index) => (
          <div key={step.id} className="flex flex-col items-center relative">
            <button
              onClick={() => onStepClick && onStepClick(index)}
              className={cn(
                "flex items-center justify-center w-8 h-8 rounded-full border-2 mb-2 transition-all",
                currentStep === index 
                  ? "border-primary bg-primary text-white"
                  : completedSteps.includes(index)
                  ? "border-secondary bg-secondary text-white hover:bg-secondary/90"
                  : "border-neutral-200 text-neutral-700 hover:border-primary/50 hover:bg-neutral-50",
                "cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2"
              )}
              type="button"
              aria-label={`Go to ${step.label} section`}
            >
              <span className="text-sm">{step.id}</span>
            </button>
            <span className="text-xs text-center">{step.label}</span>
            
            {/* Line connecting steps (except for the last one) */}
            {index < steps.length - 1 && (
              <div className="h-[1px] bg-neutral-200 absolute w-[calc(100%-2rem)] left-[calc(50%+1rem)] top-4 -z-10" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
