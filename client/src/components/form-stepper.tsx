import { cn } from "@/lib/utils";

export type Step = {
  id: number;
  label: string;
};

interface FormStepperProps {
  steps: Step[];
  currentStep: number;
  completedSteps: number[];
}

export function FormStepper({ steps, currentStep, completedSteps }: FormStepperProps) {
  return (
    <div className="mb-12">
      <div className="flex items-center justify-between max-w-4xl mx-auto">
        {steps.map((step, index) => (
          <div key={step.id} className="flex flex-col items-center relative">
            <div
              className={cn(
                "flex items-center justify-center w-8 h-8 rounded-full border-2 mb-2",
                currentStep === index 
                  ? "border-primary bg-primary text-white"
                  : completedSteps.includes(index)
                  ? "border-secondary bg-secondary text-white"
                  : "border-neutral-200 text-neutral-700"
              )}
            >
              <span className="text-sm">{step.id}</span>
            </div>
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
