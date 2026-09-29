import React from 'react';
import { Check } from 'lucide-react';

const steps = [
  { id: 'step-1', number: 1, label: 'Dam Selection', sub: 'Pick river / dam' },
  { id: 'step-2', number: 2, label: 'Failure Mode', sub: 'Breach type' },
  { id: 'step-3', number: 3, label: 'Terrain & Data', sub: 'DEM + conditioning' },
  { id: 'step-4', number: 4, label: 'Engines & Resolution', sub: 'Solver config' },
  { id: 'step-5', number: 5, label: 'Review & Run', sub: 'Submit scenario' },
];

interface WizardProgressProps {
  currentStep: number;
}

export default function WizardProgress({ currentStep }: WizardProgressProps) {
  return (
    <div className="flex items-center gap-0">
      {steps.map((step, idx) => {
        const isDone = currentStep > step.number;
        const isActive = currentStep === step.number;
        return (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-700 border-2 transition-all duration-200 ${
                  isDone
                    ? 'bg-success border-success text-background'
                    : isActive
                      ? 'bg-primary/20 border-primary text-primary'
                      : 'bg-muted border-border text-muted-foreground'
                }`}
              >
                {isDone ? <Check size={14} /> : step.number}
              </div>
              <div className="mt-1.5 text-center">
                <p
                  className={`text-[11px] font-600 ${isActive ? 'text-primary' : isDone ? 'text-success' : 'text-muted-foreground'}`}
                >
                  {step.label}
                </p>
                <p className="text-[9px] text-muted-foreground hidden sm:block">{step.sub}</p>
              </div>
            </div>
            {idx < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-2 mb-5 transition-all duration-300 ${
                  currentStep > step.number ? 'bg-success' : 'bg-border'
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
