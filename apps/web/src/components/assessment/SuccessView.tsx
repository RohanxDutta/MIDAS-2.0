import { FileCheck, Printer, PlusCircle, Award, Lock, ShieldCheck } from 'lucide-react';

export interface SubmissionResult {
  assessment_id: string;
  cqi_lite_score?: number;
  cqi_lite_grade?: string;
  prs_lite_score?: number;
  prs_lite_risk_band?: string;
  release_category?: string;
}

interface SuccessViewProps {
  datasetTitle: string;
  versionDoiHandle: string;
  submittingPiCustodian: string;
  submissionResult: SubmissionResult;
  onReset: () => void;
}

export function SuccessView({
  datasetTitle,
  versionDoiHandle,
  submittingPiCustodian,
  submissionResult,
  onReset,
}: SuccessViewProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center max-w-3xl mx-auto px-6 py-12 text-center w-full animate-fadeIn select-none">
      {/* Icon */}
      <div className="w-16 h-16 bg-emerald-50 text-emerald-500 border border-emerald-200 rounded-full flex items-center justify-center mb-6 shadow-xs">
        <FileCheck className="w-8 h-8" />
      </div>

      <h2 className="text-3xl font-extrabold text-brand-navy tracking-tight mb-2">
        Self-Assessment Submitted
      </h2>
      <p className="text-brand-slate text-sm font-semibold max-w-md mx-auto mb-8 leading-relaxed">
        The assessment has been successfully saved to PostgreSQL. The details are locked and the
        Redis draft cache has been cleared.
      </p>

      {/* Main Details Card */}
      <div className="w-full bg-white border border-brand-border rounded-[24px] p-8 text-left space-y-6 shadow-sm relative">
        <div>
          <span className="text-[10px] font-extrabold text-brand-slate uppercase tracking-wider block mb-4 border-b border-brand-border/60 pb-2">
            Assessment Metadata
          </span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4.5 gap-x-6 text-sm">
            <div>
              <span className="text-brand-slate block text-[11px] font-bold uppercase tracking-wide">
                Dataset Title
              </span>
              <span className="text-brand-navy font-bold mt-1 block leading-normal">
                {datasetTitle}
              </span>
            </div>
            <div>
              <span className="text-brand-slate block text-[11px] font-bold uppercase tracking-wide">
                Submission ID
              </span>
              <span className="text-brand-blue font-bold mt-1 block font-mono text-xs truncate">
                {submissionResult.assessment_id}
              </span>
            </div>
            <div>
              <span className="text-brand-slate block text-[11px] font-bold uppercase tracking-wide">
                Version / DOI / Handle
              </span>
              <span className="text-brand-navy font-bold mt-1 block truncate">
                {versionDoiHandle}
              </span>
            </div>
            <div>
              <span className="text-brand-slate block text-[11px] font-bold uppercase tracking-wide">
                PI / Custodian
              </span>
              <span className="text-brand-navy font-bold mt-1 block truncate">
                {submittingPiCustodian}
              </span>
            </div>
          </div>
        </div>

        {/* METRICS SUMMARY CARD */}
        {submissionResult.cqi_lite_score !== undefined && (
          <div className="pt-4 border-t border-brand-border/60">
            <span className="text-[10px] font-extrabold text-brand-slate uppercase tracking-wider block mb-4">
              Calculated Assessment Scores
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-brand-bg-start/60 border border-brand-border/80 rounded-[18px] p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-brand-blue flex items-center justify-center shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] font-extrabold text-brand-slate uppercase tracking-wider">CQI-Lite Score</div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-lg font-black text-brand-navy">{submissionResult.cqi_lite_score?.toFixed(1) ?? 'N/A'}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-blue/10 text-brand-blue uppercase">
                      {submissionResult.cqi_lite_grade ?? 'Standard'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-brand-bg-start/60 border border-brand-border/80 rounded-[18px] p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] font-extrabold text-brand-slate uppercase tracking-wider">PRS-Lite Score</div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-lg font-black text-brand-navy">{submissionResult.prs_lite_score?.toFixed(1) ?? 'N/A'}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 uppercase">
                      {submissionResult.prs_lite_risk_band ?? 'Low Risk'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-brand-bg-start/60 border border-brand-border/80 rounded-[18px] p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] font-extrabold text-brand-slate uppercase tracking-wider">Release Category</div>
                  <div className="text-sm font-bold text-brand-navy mt-0.5">
                    {submissionResult.release_category ?? 'Open Access'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="flex gap-4 mt-8 print:hidden">
        <button
          type="button"
          onClick={() => window.print()}
          className="px-6 py-3 bg-white hover:bg-brand-bg-start border border-brand-border hover:border-brand-slate/40 text-brand-navy font-bold rounded-full transition-all flex items-center gap-2 cursor-pointer shadow-xs hover:-translate-y-[2px]"
        >
          <Printer className="w-4.5 h-4.5 text-brand-slate" />
          Print Report
        </button>

        <button
          type="button"
          onClick={onReset}
          className="px-6 py-3 bg-brand-blue hover:bg-brand-blue-hover text-white font-bold rounded-full transition-all flex items-center gap-2 cursor-pointer shadow-md shadow-brand-blue/10 hover:-translate-y-[2px]"
        >
          <PlusCircle className="w-4.5 h-4.5" />
          New Assessment
        </button>
      </div>
    </div>
  );
}
