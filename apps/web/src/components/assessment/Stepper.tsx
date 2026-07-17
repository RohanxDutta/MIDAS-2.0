import { Check, CheckCircle2 } from 'lucide-react';

interface StepperProps {
  currentStep: 'metadata' | 'domains' | 'prs' | 'upload' | 'review' | 'success';
  setStep: (step: 'metadata' | 'domains' | 'prs' | 'upload' | 'review') => void;
  isMetadataComplete: boolean;
  isDomainsComplete: boolean;
  isPrsComplete: boolean;
  isUploadComplete: boolean;
  activeDomainIdx: number;
  setActiveDomainIdx: (idx: number) => void;
  isDomainAnswered: (id: number) => boolean;
  domain11Na: boolean;
}

export function Stepper({
  currentStep,
  setStep,
  isMetadataComplete,
  isDomainsComplete,
  isPrsComplete,
  isUploadComplete,
  activeDomainIdx,
  setActiveDomainIdx,
  isDomainAnswered,
  domain11Na,
}: StepperProps) {
  const steps = [
    { id: 'metadata', num: 1, label: 'Dataset Basics', isComplete: isMetadataComplete },
    { id: 'domains', num: 2, label: 'Quality Domains', isComplete: isDomainsComplete },
    { id: 'prs', num: 3, label: 'Privacy & Governance', isComplete: isPrsComplete },
    { id: 'upload', num: 4, label: 'Data Upload', isComplete: isUploadComplete },
    { id: 'review', num: 5, label: 'Review & Submit', isComplete: false },
  ];

  const activeIdx = steps.findIndex((s) => s.id === currentStep);

  const handleStepClick = (stepId: string) => {
    // Only allow clicking steps if Basics is complete (security validation)
    if (stepId !== 'metadata' && !isMetadataComplete) return;
    setStep(stepId as any);
  };

  const isStep2Active = currentStep === 'domains';

  return (
    <div className="w-full flex flex-col items-center pt-2 pb-1 mb-6 select-none print:hidden">
      {/* Dynamic Stepper Bar */}
      <div className="w-full flex items-center justify-between gap-3 relative">
        {/* Connector Line behind circles (standard background) */}
        <div className="absolute top-5 left-8 right-8 h-[2px] bg-brand-border z-0" />
        
        {/* Fill Connector Line for progress */}
        <div
          className="absolute top-5 left-8 h-[2px] bg-brand-blue z-0 transition-all duration-300"
          style={{
            width: `${activeIdx >= 0 ? (activeIdx / (steps.length - 1)) * 90 : 0}%`,
          }}
        />

        {steps.map((step, index) => {
          const isCompleted = step.isComplete || activeIdx > index;
          const isActive = currentStep === step.id;
          const isEnabled = step.id === 'metadata' || isMetadataComplete;

          // Render active unfolding view for Step 2
          if (step.id === 'domains' && isStep2Active) {
            return (
              <div
                key={step.id}
                className="flex flex-col items-center z-10 flex-grow mx-4 border border-brand-border/60 bg-brand-bg-start/35 rounded-2xl p-2.5 max-w-[500px] animate-fadeIn"
              >
                {/* 15 inline micro-dots */}
                <div className="flex items-center justify-between gap-1.5 w-full">
                  {Array.from({ length: 15 }).map((_, idx) => {
                    const domId = idx + 1;
                    const isAnswered = isDomainAnswered(domId);
                    const isCurrent = activeDomainIdx === idx;
                    const isNa = domain11Na && domId === 11;

                    return (
                      <button
                        key={domId}
                        type="button"
                        onClick={() => setActiveDomainIdx(idx)}
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold transition-all border cursor-pointer focus:outline-none ${
                          isCurrent
                            ? 'border-brand-blue bg-white text-brand-blue ring-2 ring-brand-blue/15 font-black scale-105 shadow-3xs'
                            : isNa
                            ? 'border-brand-slate bg-brand-bg-end text-brand-slate opacity-75'
                            : isAnswered
                            ? 'border-emerald-500 bg-emerald-500 text-white'
                            : 'border-brand-border bg-white text-brand-slate hover:border-brand-slate'
                        }`}
                        title={`Domain ${domId}: ${
                          isNa ? 'Not Applicable' : isAnswered ? 'Answered' : 'Unanswered'
                        }`}
                      >
                        {isNa ? 'N' : isAnswered && !isCurrent ? <Check className="w-2.5 h-2.5 stroke-[3]" /> : domId}
                      </button>
                    );
                  })}
                </div>
                <span className="text-[10px] font-extrabold text-brand-blue uppercase tracking-wider mt-2.5">
                  Section B: Quality Rubrics
                </span>
              </div>
            );
          }

          // Standard circular rendering
          return (
            <div key={step.id} className="flex flex-col items-center z-10 shrink-0">
              <button
                type="button"
                onClick={() => handleStepClick(step.id)}
                disabled={!isEnabled}
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all focus:outline-none ${
                  isActive
                    ? 'bg-brand-blue text-white ring-4 ring-brand-blue/15 scale-105'
                    : isCompleted
                    ? 'bg-brand-blue text-white'
                    : 'bg-white border-2 border-brand-border text-brand-slate hover:border-brand-slate'
                } ${!isEnabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
              >
                {isCompleted ? <Check className="w-5 h-5 stroke-[2.5]" /> : step.num}
              </button>
              <span
                className={`text-[10px] font-bold mt-2 text-center transition-colors duration-200 ${
                  isActive ? 'text-brand-blue font-black' : isCompleted ? 'text-brand-navy' : 'text-brand-slate'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
