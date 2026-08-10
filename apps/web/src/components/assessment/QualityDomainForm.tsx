import { BookOpen } from 'lucide-react';
import { domainsData } from '@/lib/domainsData';
import { Paperclip } from 'lucide-react';

interface QualityDomainFormProps {
  activeDomainIdx: number;
  answers: { [key: number]: { score: number|null ; factual_description: string; evidence_file?: File | null; } };
  setAnswers: React.Dispatch<
    React.SetStateAction<{ [key: number]: { score: number | null; factual_description: string; evidence_file?: File | null; } }>
  >;
  domain11Na: boolean;
  setDomain11Na: (val: boolean) => void;
}

export function QualityDomainForm({
  activeDomainIdx,
  answers,
  setAnswers,
  domain11Na,
  setDomain11Na,
}: QualityDomainFormProps) {
  const currentDomain = domainsData[activeDomainIdx];
  const domId = currentDomain.id;
  const isNaActive = domId === 11 && domain11Na;
  const currentAnswer = answers[domId] || { score: null, factual_description: '', evidence_file: null, };
  const LABELS = ['A', 'B', 'C', 'D', 'E'];

  const handleScoreSelect = (score: number) => {
    setAnswers((prev) => ({
      ...prev,
      [domId]: {
        ...(prev[domId] || { factual_description: '' }),
        score,
      },
    }));
  };

  const handleDescriptionChange = (text: string) => {
    setAnswers((prev) => ({
      ...prev,
      [domId]: {
        ...(prev[domId] || { score: null }),
        factual_description: text,
      },
    }));
  };

  return (
    <div className="w-full flex flex-col">
      {/* Compact Domain Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-5 pb-3 border-b border-brand-border/50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-brand-blue/10 flex items-center justify-center text-brand-blue shrink-0 font-extrabold text-sm">
            {domId}
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-brand-blue uppercase tracking-wider leading-none">
              Domain {activeDomainIdx + 1} of 15
            </span>
            <h2 className="text-base font-extrabold text-brand-navy tracking-tight mt-1">
              {currentDomain.title}
            </h2>
          </div>
        </div>

        {/* N/A Toggle for Domain 11 */}
        {domId === 11 && (
          <div className="flex items-center gap-2 bg-brand-bg-start/50 border border-brand-border/60 rounded-full px-3 py-1.5 hover:bg-brand-bg-start transition-all shrink-0">
            <input
              id="na-toggle-chk"
              type="checkbox"
              checked={domain11Na}
              onChange={(e) => setDomain11Na(e.target.checked)}
              className="w-3.5 h-3.5 rounded text-brand-blue border-brand-border focus:ring-brand-blue cursor-pointer"
            />
            <label
              htmlFor="na-toggle-chk"
              className="text-[11px] font-bold text-brand-navy cursor-pointer select-none"
            >
              Not Applicable (N/A)
            </label>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      {isNaActive ? (
        <div className="flex flex-col items-center justify-center py-10 px-4 bg-brand-bg-start/20 border border-dashed border-brand-border rounded-xl text-center select-none animate-fadeIn">
          <div className="w-12 h-12 bg-brand-slate/10 border border-brand-border text-brand-slate rounded-xl flex items-center justify-center mb-3">
            <BookOpen className="w-5.5 h-5.5" />
          </div>
          <h4 className="text-xs font-extrabold text-brand-navy">Domain flagged as N/A</h4>
          <p className="text-[10px] font-semibold text-brand-slate max-w-xs mt-1 leading-relaxed">
            This domain is excluded from CQI-Lite calculations and does not require inputs.
          </p>
        </div>
      ) : (
        <div className="space-y-5 animate-fadeIn">
          {/* Level Cards List */}
          <div className="space-y-3">
            <div className="flex flex-col space-y-2.5">
              {[0, 1, 2, 3, 4].map((scoreVal) => {
                const isSelected = currentAnswer.score !== null && currentAnswer.score === scoreVal;
                return (
                  <button
                    key={scoreVal}
                    type="button"
                    onClick={() => handleScoreSelect(scoreVal)}
                    className={`text-left py-3 px-4.5 rounded-full border flex items-start gap-4 cursor-pointer focus:outline-none w-full transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-[2px] hover:shadow-2xs ${
                      isSelected
                        ? 'bg-brand-blue/[0.015] border-brand-blue ring-2 ring-brand-blue/8 shadow-3xs'
                        : 'bg-white border-brand-border hover:border-brand-blue/30'
                    }`}
                  >
                    {/* Compact Score badge circle */}
                    <div
                      className={`w-5.5 h-5.5 rounded-full flex items-center justify-center shrink-0 font-bold text-[10px] mt-0.5 transition-colors ${
                        isSelected
                          ? 'bg-brand-blue text-white'
                          : 'bg-brand-bg-start text-brand-slate border border-brand-border'
                      }`}
                    >
                      {LABELS[scoreVal]}
                    </div>
                    {/* Rubric level description (fully wrapping, no truncation) */}
                    <p
                      className={`text-[13px] font-semibold leading-relaxed pr-2 ${
                        isSelected ? 'text-brand-navy font-bold' : 'text-brand-slate'
                      }`}
                    >
                      {currentDomain.descriptions[scoreVal]}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Expanded Justification input block */}
          <div className="space-y-2">
            <label className="block text-[10px] font-extrabold uppercase tracking-wider text-brand-slate">
              Justification 
            </label>
            <textarea
              required
              rows={4}
              value={currentAnswer.factual_description}
              onChange={(e) => handleDescriptionChange(e.target.value)}
              placeholder="Describe details of dataset alignment with selected rubric level (Concise factual description required for assessment)..."
              className="w-full bg-white border border-brand-border rounded-[14px] px-4 py-3 text-xs text-brand-navy placeholder-brand-slate/55 focus:outline-none focus:border-brand-blue/42 focus:ring-[3px] focus:ring-brand-blue/12 transition-all leading-relaxed shadow-3xs"
            />
          </div>
            {/* ✅ FILE ATTACHMENT STARTS HERE */}
            <div className="mt-2 flex items-center justify-between border border-dashed border-brand-border rounded-xl px-3 py-2 bg-white">

              <div className="flex items-center gap-2 text-xs text-brand-slate">
                <Paperclip className="w-4 h-4" />
                <span>Attach file</span>
              </div>

              <label className="cursor-pointer text-xs text-brand-blue font-semibold">
                Browse
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.ppt,.pptx"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;

                    setAnswers((prev) => ({
                      ...prev,
                      [domId]: {
                        ...(prev[domId] || {
                          score: null,
                          factual_description: '',
                        }),
                        evidence_file: file, // 🔴 IMPORTANT
                      },
                    }));
                  }}
                />
              </label>
            </div>
            {/* ✅ FILE ATTACHMENT ENDS HERE */}
          </div>
      )}
    </div>
  );
}
