import {
  FileText,
  CheckCircle2,
  ShieldCheck,
  Upload,
  Link2,
  Lock,
  ChevronRight,
} from 'lucide-react';

interface FileUpload {
  id: string;
  name: string;
  size: number;
  status: 'pending' | 'success' | 'failed';
}

interface ReviewFormProps {
  datasetTitle: string;
  versionDoiHandle: string;
  submittingPiCustodian: string;
  assessorNameAffiliation: string;
  domain11Na: boolean;
  answers: { [key: number]: { score: number; factual_description: string } };
  identificationRisk: number;
  sensitivityMultiplier: number;
  datasetType: 'structured' | 'unstructured';
  datasetLink: string;
  uploadedFiles: FileUpload[];
}

export function ReviewForm({
  datasetTitle,
  versionDoiHandle,
  submittingPiCustodian,
  assessorNameAffiliation,
  domain11Na,
  answers,
  identificationRisk,
  sensitivityMultiplier,
  datasetType,
  datasetLink,
  uploadedFiles,
}: ReviewFormProps) {
  const cqiMaxScore = domain11Na ? 56 : 60;
  const answeredDomainsCount = Object.keys(answers).filter((key) => {
    const id = parseInt(key);
    if (domain11Na && id === 11) return true;
    return answers[id]?.factual_description.trim() !== '';
  }).length;

  return (
    <div className="w-full flex flex-col select-none animate-fadeIn">
      {/* Header */}
      <div className="flex items-center gap-3.5 mb-8 pb-6 border-b border-brand-border/60">
        <div className="w-12 h-12 rounded-xl bg-brand-blue/10 flex items-center justify-center text-brand-blue shrink-0">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div className="flex flex-col">
          <h2 className="text-xl font-extrabold text-brand-navy tracking-tight">Review Assessment</h2>
          <span className="text-xs font-semibold text-brand-slate mt-0.5">
            Verify all information before final submission. Calculations will execute on the backend.
          </span>
        </div>
      </div>

      <div className="space-y-5">
        {/* Section A Summary */}
        <div className="bg-brand-bg-start/20 border border-brand-border rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-brand-border pb-2">
            <FileText className="w-4 h-4 text-brand-blue shrink-0" />
            <span className="text-[10px] font-bold text-brand-navy uppercase tracking-wider">
              Section A: Basics Metadata
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6 text-sm">
            <div>
              <span className="text-brand-slate block text-[11px] font-bold uppercase tracking-wide">
                Dataset Title
              </span>
              <span className="text-brand-navy font-bold mt-1 block">
                {datasetTitle || 'N/A'}
              </span>
            </div>
            <div>
              <span className="text-brand-slate block text-[11px] font-bold uppercase tracking-wide">
                Version / DOI / Handle
              </span>
              <span className="text-brand-navy font-bold mt-1 block">
                {versionDoiHandle || 'N/A'}
              </span>
            </div>
            <div>
              <span className="text-brand-slate block text-[11px] font-bold uppercase tracking-wide">
                PI / Custodian
              </span>
              <span className="text-brand-navy font-bold mt-1 block">
                {submittingPiCustodian || 'N/A'}
              </span>
            </div>
            <div>
              <span className="text-brand-slate block text-[11px] font-bold uppercase tracking-wide">
                Assessor / Affiliation
              </span>
              <span className="text-brand-navy font-bold mt-1 block">
                {assessorNameAffiliation || 'N/A'}
              </span>
            </div>
          </div>
        </div>

        {/* Section B Summary Check */}
        <div className="bg-brand-bg-start/20 border border-brand-border rounded-2xl p-5 flex justify-between items-center text-sm">
          <div className="flex items-center gap-3.5">
            <CheckCircle2 className="w-5.5 h-5.5 text-emerald-500 shrink-0" />
            <div className="flex flex-col">
              <span className="font-bold text-brand-navy">Section B: Quality Rubrics</span>
              <span className="text-xs font-semibold text-brand-slate mt-0.5">
                {domain11Na
                  ? '14 domains + Domain 11 (Not Applicable) configured'
                  : 'All 15 domains completed'}
              </span>
            </div>
          </div>
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full shrink-0">
            {answeredDomainsCount}/15 Complete
          </span>
        </div>

        {/* Section C Summary Check */}
        <div className="bg-brand-bg-start/20 border border-brand-border rounded-2xl p-5 flex justify-between items-center text-sm">
          <div className="flex items-center gap-3.5">
            <CheckCircle2 className="w-5.5 h-5.5 text-emerald-500 shrink-0" />
            <div className="flex flex-col">
              <span className="font-bold text-brand-navy">Section C: Privacy Configurations</span>
              <span className="text-xs font-semibold text-brand-slate mt-0.5">
                Identification Risk Score: {identificationRisk} · Multiplier: {sensitivityMultiplier}x
              </span>
            </div>
          </div>
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full shrink-0">
            Calculated
          </span>
        </div>

        {/* Section D Summary */}
        <div className="bg-brand-bg-start/20 border border-brand-border rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-brand-border pb-2">
            <Upload className="w-4 h-4 text-brand-blue shrink-0" />
            <span className="text-[10px] font-bold text-brand-navy uppercase tracking-wider">
              Section D: Uploaded Assets ({datasetType})
            </span>
          </div>

          {datasetType === 'unstructured' ? (
            <div className="flex items-center gap-2.5 text-sm">
              <Link2 className="w-4.5 h-4.5 text-brand-blue shrink-0" />
              <a
                href={datasetLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-blue hover:underline font-bold truncate"
              >
                {datasetLink || 'No link provided'}
              </a>
            </div>
          ) : (
            <div className="space-y-2">
              {uploadedFiles
                .filter((f) => f.status === 'success')
                .map((file) => (
                  <div key={file.id} className="text-xs font-bold text-brand-navy flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span className="truncate max-w-[280px] md:max-w-xl">{file.name}</span>
                    <span className="text-[10px] font-semibold text-brand-slate">
                      ({(file.size / 1024).toFixed(1)} KB)
                    </span>
                  </div>
                ))}
              {uploadedFiles.filter((f) => f.status === 'success').length === 0 && (
                <span className="text-xs font-semibold text-brand-slate block">
                  No validated files found.
                </span>
              )}
            </div>
          )}
        </div>

        {/* Lock warning block */}
        <div className="flex gap-4 p-4.5 bg-brand-blue/5 border border-brand-blue/20 rounded-2xl text-xs text-brand-blue leading-relaxed font-semibold">
          <Lock className="w-5.5 h-5.5 shrink-0 text-brand-blue" />
          <p>
            Submitting locks the assessment permanently on PostgreSQL, clears the Redis draft cache,
            and routes the entries for administrative audit checks by the ICMR Nodal Centre.
          </p>
        </div>
      </div>
    </div>
  );
}
