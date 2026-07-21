import { ShieldAlert } from 'lucide-react';

interface PrivacyCalculatorProps {
  identificationRisk: number;
  setIdentificationRisk: (val: number) => void;
  sensitivityMultiplier: number;
  setSensitivityMultiplier: (val: number) => void;
}

export function PrivacyCalculator({
  identificationRisk,
  setIdentificationRisk,
  sensitivityMultiplier,
  setSensitivityMultiplier,
}: PrivacyCalculatorProps) {
  const riskOptions = [
    {
      val: 50,
      label: '50 - High Traceability',
      desc: 'Names, phone numbers, IDs, GPS, or full Date of Birth are visible; easily traceable individuals.',
    },
    {
      val: 30,
      label: '30 - Indirect Identification',
      desc: 'Direct identifiers removed, but unique combinations can reveal identities (e.g., rare disease + village + date).',
    },
    {
      val: 15,
      label: '15 - Coarse Anonymization',
      desc: 'Only coarse variables remain (age, sex, district, month); re-identification is hard but not impossible.',
    },
    {
      val: 5,
      label: '5 - Strongly Masked',
      desc: 'Generalized categories only (age bands, state, quarter); identities effectively hidden.',
    },
    {
      val: 0,
      label: '0 - Aggregated Outputs Only',
      desc: 'Only aggregated counts are present; no individual rows are stored.',
    },
  ];

  const multiplierOptions = [
    {
      val: 1.0,
      label: '1.0 - Routine / Low Harm',
      desc: 'Non-stigmatizing routine parameters (e.g., vitals or service utilization statistics).',
    },
    {
      val: 1.5,
      label: '1.5 - High Stigma / Personal Impact',
      desc: 'TB, HIV, reproductive health, mental health, genomic assets, vulnerable groups, or undocumented status.',
    },
    {
      val: 2.0,
      label: '2.0 - Critical / Safety-Sensitive',
      desc: 'Forensic details, detainee health, conflict data, tribal GPS coordinates, or refugee records.',
    },
  ];

  return (
    <div className="w-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8 pb-6 border-b border-brand-border/60">
        <div className="w-12 h-12 rounded-xl bg-brand-blue/10 flex items-center justify-center text-brand-blue shrink-0">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <div className="flex flex-col">
          <h2 className="text-xl font-extrabold text-brand-navy tracking-tight">Privacy & Governance</h2>
          <span className="text-xs font-semibold text-brand-slate mt-0.5">
            Configure privacy and governance parameters for the assessment.
          </span>
        </div>
      </div>

      <div className="space-y-8">
        {/* Step 1: Identification Risk */}
        <div className="space-y-4">
          <span className="block text-xs font-extrabold uppercase tracking-wider text-brand-slate">
            Step 1 – Identification Risk Score (0 to 50)
          </span>

          <div className="grid grid-cols-1 gap-3">
            {riskOptions.map((option) => {
              const isSelected = identificationRisk === option.val;
              return (
                <button
                    key={option.val}
                    type="button"
                    onClick={() => setIdentificationRisk(option.val)}
                    className={`text-left p-4 rounded-full border flex items-start gap-4 cursor-pointer focus:outline-none transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-[2px] hover:shadow-xs ${
                      isSelected
                        ? 'bg-brand-blue/[0.015] border-brand-blue ring-2 ring-brand-blue/8 shadow-3xs'
                        : 'bg-white border-brand-border hover:border-brand-blue/30'
                    }`}
                >
                  {/* Custom Radio Button */}
                  <span
                    className={`w-4.5 h-4.5 rounded-full border shrink-0 mt-1 flex items-center justify-center transition-all ${
                      isSelected
                        ? 'border-brand-blue bg-brand-blue text-white'
                        : 'border-brand-border bg-brand-bg-start'
                    }`}
                  >
                    {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </span>
                  <div>
                    <span
                      className={`text-sm font-bold block ${
                        isSelected ? 'text-brand-navy' : 'text-brand-navy/90'
                      }`}
                    >
                      {option.label}
                    </span>
                    <span className="text-xs text-brand-slate font-medium leading-relaxed block mt-1">
                      {option.desc}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Sensitivity Multiplier */}
        <div className="space-y-4">
          <span className="block text-xs font-extrabold uppercase tracking-wider text-brand-slate">
            Step 2 – Sensitivity / Harm Multiplier (1.0 to 2.0)
          </span>

          <div className="grid grid-cols-1 gap-3">
            {multiplierOptions.map((option) => {
              const isSelected = sensitivityMultiplier === option.val;
              return (
                <button
                    key={option.val}
                    type="button"
                    onClick={() => setSensitivityMultiplier(option.val)}
                    className={`text-left p-4 rounded-full border flex items-start gap-4 cursor-pointer focus:outline-none transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-[2px] hover:shadow-xs ${
                      isSelected
                        ? 'bg-brand-blue/[0.015] border-brand-blue ring-2 ring-brand-blue/8 shadow-3xs'
                        : 'bg-white border-brand-border hover:border-brand-blue/30'
                    }`}
                >
                  {/* Custom Radio Button */}
                  <span
                    className={`w-4.5 h-4.5 rounded-full border shrink-0 mt-1 flex items-center justify-center transition-all ${
                      isSelected
                        ? 'border-brand-blue bg-brand-blue text-white'
                        : 'border-brand-border bg-brand-bg-start'
                    }`}
                  >
                    {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </span>
                  <div>
                    <span
                      className={`text-sm font-bold block ${
                        isSelected ? 'text-brand-navy' : 'text-brand-navy/90'
                      }`}
                    >
                      {option.label}
                    </span>
                    <span className="text-xs text-brand-slate font-medium leading-relaxed block mt-1">
                      {option.desc}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
