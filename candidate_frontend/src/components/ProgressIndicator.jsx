import { Check } from "lucide-react";

export function ProgressIndicator({ currentStep }) {
  const steps = [
    { number: 1, label: "Candidate Info", active: currentStep === 1, completed: currentStep > 1 },
    { number: 2, label: "MCQ Test", active: currentStep === 2, completed: currentStep > 2 },
    { number: 3, label: "AI Interview", active: currentStep === 3, completed: currentStep > 3 },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center flex-1">
            <div className="flex flex-col items-center gap-2">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
                  step.active
                    ? "bg-gradient-to-r from-purple-600 to-cyan-400 text-white shadow-lg"
                    : step.completed
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {step.completed ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <span className="font-semibold">{step.number}</span>
                )}
              </div>
              <span
                className={`text-xs font-medium ${
                  step.active ? "text-purple-600" : "text-gray-500"
                }`}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className="flex-1 h-0.5 bg-gray-200 mx-2" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
