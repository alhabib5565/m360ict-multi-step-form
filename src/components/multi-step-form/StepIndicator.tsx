import { CheckCircle } from "lucide-react";

interface StepIndicatorProps {
  currentStep: number;
}

const StepIndicator = ({ currentStep }: StepIndicatorProps) => {
  const steps = [
    { number: 1, title: "Personal Info" },
    { number: 2, title: "Job Details" },
    { number: 3, title: "Skills & Preferences" },
    { number: 4, title: "Emergency Contact" },
    { number: 5, title: "Review & Submit" },
  ];
  const totalSteps = steps.length;
  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between mb-4">
        {steps.map((step) => {
          const isCompleted = step.number < currentStep;
          const isCurrent = step.number === currentStep;

          return (
            <div key={step.number} className="flex items-center">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  isCompleted
                    ? "bg-green-500 border-green-500 text-white"
                    : isCurrent
                    ? "bg-primary border-primary text-white"
                    : "bg-gray-100 border-gray-300 text-gray-500"
                }`}
              >
                {isCompleted ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <span className="text-sm font-medium">{step.number}</span>
                )}
              </div>
              <span
                className={`ml-2 text-sm font-medium ${
                  isCompleted || isCurrent ? "text-gray-900" : "text-gray-500"
                }`}
              >
                {step.title}
              </span>
            </div>
          );
        })}
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-primary h-2 rounded-full transition-all duration-300"
          style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
        />
      </div>
    </div>
  );
};

export default StepIndicator;
