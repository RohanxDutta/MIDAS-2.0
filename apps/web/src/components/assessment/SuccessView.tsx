import { FileCheck, Lock, Printer, PlusCircle } from 'lucide-react';

interface SubmissionResult {
  assessment_id: string;
  cqi_grade: string;
  prs_band: string;
  release_category: string;
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
        <div className="absolute top-6 right-6 flex items-center gap-1.5 border border-brand-border bg-brand-bg-start px-3.5 py-1.5 rounded-full text-xs font-bold text-brand-blue">
          <Lock className="w-3.5 h-3.5" />
          Locked (Read-Only)
        </div>

        {/* Metadata Section */}
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

        {/* Stored Metrics Section */}
        <div className="border-t border-brand-border/60 pt-6">
          <span className="text-[10px] font-extrabold text-brand-slate uppercase tracking-wider block mb-4 border-b border-brand-border/60 pb-2">
            Submission Metrics (Calculated on Backend)
          </span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4.5 text-center">
            <div className="bg-brand-bg-start/40 p-4 border border-brand-border/60 rounded-[24px] shadow-2xs">
              <span className="text-brand-slate text-[10px] uppercase font-extrabold tracking-wider block">
                CQI Grade
              </span>
              <span className="text-brand-navy text-lg font-black mt-1.5 block">
                {submissionResult.cqi_grade}
              </span>
            </div>
            <div className="bg-brand-bg-start/40 p-4 border border-brand-border/60 rounded-[24px] shadow-2xs">
              <span className="text-brand-slate text-[10px] uppercase font-extrabold tracking-wider block">
                PRS Risk Band
              </span>
              <span className="text-brand-navy text-lg font-black mt-1.5 block">
                {submissionResult.prs_band}
              </span>
            </div>
            <div className="bg-brand-bg-start/40 p-4 border border-brand-border/60 rounded-[24px] shadow-2xs">
              <span className="text-brand-slate text-[10px] uppercase font-extrabold tracking-wider block">
                Release Category
              </span>
              <span className="text-brand-blue text-lg font-black mt-1.5 block">
                {submissionResult.release_category}
              </span>
            </div>
          </div>
        </div>
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
