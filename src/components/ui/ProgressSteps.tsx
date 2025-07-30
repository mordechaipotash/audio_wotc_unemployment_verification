import React from 'react';
import { Check, Volume2, UserCircle2, Briefcase } from 'lucide-react';

interface ProgressStepsProps {
  currentStep: 'welcome' | 'intro' | 'name' | 'employment' | 'complete';
}

export const ProgressSteps: React.FC<ProgressStepsProps> = ({ currentStep }) => {
  const steps = [
    { id: 'welcome', label: 'Welcome', icon: Check },
    { id: 'intro', label: 'Introduction', icon: Volume2 },
    { id: 'name', label: 'Personal Info', icon: UserCircle2 },
    { id: 'employment', label: 'Employment', icon: Briefcase },
  ];

  const stepOrder = ['welcome', 'intro', 'name', 'employment', 'complete'];
  const currentIndex = stepOrder.indexOf(currentStep);

  const getStepStatus = (stepId: string) => {
    const stepIndex = stepOrder.indexOf(stepId);
    if (stepIndex < currentIndex) return 'complete';
    if (stepIndex === currentIndex) return 'current';
    return 'upcoming';
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm shadow-lg">
      <div className="max-w-3xl mx-auto px-4 py-4">
        <div className="relative">
          {/* Progress bar background */}
          <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2" />
          
          {/* Animated progress bar */}
          <div 
            className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600 -translate-y-1/2 transition-all duration-500 ease-in-out"
            style={{ 
              width: `${(currentIndex / (stepOrder.length - 1)) * 100}%`,
              boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)'
            }}
          />

          {/* Steps */}
          <div className="relative flex justify-between">
            {steps.map((step) => {
              const status = getStepStatus(step.id);
              return (
                <div
                  key={step.id}
                  className="flex flex-col items-center relative"
                >
                  {/* Step circle with conditional pulsing effect */}
                  <div className="relative">
                    {status === 'current' && (
                      <>
                        <div className="absolute -inset-2">
                          <div className="w-14 h-14 rounded-full animate-ping bg-blue-400 opacity-20" />
                        </div>
                        <div className="absolute -inset-2">
                          <div className="w-14 h-14 rounded-full animate-pulse bg-blue-400 opacity-10" />
                        </div>
                      </>
                    )}
                    <div
                      className={`
                        relative w-10 h-10 rounded-full flex items-center justify-center
                        transition-all duration-500
                        ${status === 'complete' ? 'bg-blue-600 text-white scale-100' :
                          status === 'current' ? 'bg-white border-2 border-blue-600 text-blue-600 scale-110 shadow-lg' :
                          'bg-white border-2 border-gray-300 text-gray-400 scale-90'}
                      `}
                    >
                      <step.icon className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Label */}
                  <div
                    className={`
                      mt-2 text-sm font-medium transition-all duration-500
                      ${status === 'complete' ? 'text-blue-600' :
                        status === 'current' ? 'text-gray-900' :
                        'text-gray-400'}
                    `}
                  >
                    {step.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
