import { FileText, Calendar, User, Hash, Briefcase } from 'lucide-react';
import { Input } from '@/components/ui/Input';

interface DatasetBasicsFormProps {
  datasetTitle: string;
  setDatasetTitle: (val: string) => void;
  versionDoiHandle: string;
  setVersionDoiHandle: (val: string) => void;
  submittingPiCustodian: string;
  setSubmittingPiCustodian: (val: string) => void;
  dateOfAssessment: string;
  setDateOfAssessment: (val: string) => void;
  assessorNameAffiliation: string;
  setAssessorNameAffiliation: (val: string) => void;
}

export function DatasetBasicsForm({
  datasetTitle,
  setDatasetTitle,
  versionDoiHandle,
  setVersionDoiHandle,
  submittingPiCustodian,
  setSubmittingPiCustodian,
  dateOfAssessment,
  setDateOfAssessment,
  assessorNameAffiliation,
  setAssessorNameAffiliation,
}: DatasetBasicsFormProps) {
  return (
    <div className="w-full flex flex-col">
      {/* Card Header */}
      <div className="flex items-center gap-3.5 mb-8 pb-6 border-b border-brand-border/60">
        <div className="w-12 h-12 rounded-xl bg-brand-blue/10 flex items-center justify-center text-brand-blue shrink-0">
          <FileText className="w-6 h-6" />
        </div>
        <div className="flex flex-col">
          <h2 className="text-xl font-extrabold text-brand-navy tracking-tight">Dataset Basics</h2>
          <span className="text-xs font-semibold text-brand-slate mt-0.5">
            Provide basic metadata about the origins and custody of this dataset.
          </span>
        </div>
      </div>

      {/* Form Fields Grid */}
      <div className="space-y-6">
        {/* Row 1: Full Width Dataset Title */}
        <Input
          label="Dataset Title *"
          type="text"
          required
          value={datasetTitle}
          onChange={(e) => setDatasetTitle(e.target.value)}
          placeholder="e.g., Longitudinal Indian Health Dataset"
          icon={<FileText className="w-4 h-4" />}
        />

        {/* Row 2: Version & PI Custodian */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Version / DOI / Handle *"
            type="text"
            required
            value={versionDoiHandle}
            onChange={(e) => setVersionDoiHandle(e.target.value)}
            placeholder="e.g., v1.0.0 or doi:10.5061/dryad.xxx"
            icon={<Hash className="w-4 h-4" />}
          />
          <Input
            label="Submitting PI / Custodian *"
            type="text"
            required
            value={submittingPiCustodian}
            onChange={(e) => setSubmittingPiCustodian(e.target.value)}
            placeholder="e.g., Dr. A. K. Sharma"
            icon={<User className="w-4 h-4" />}
          />
        </div>

        {/* Row 3: Date & Assessor */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Date of Assessment *"
            type="date"
            required
            value={dateOfAssessment}
            onChange={(e) => setDateOfAssessment(e.target.value)}
            icon={<Calendar className="w-4 h-4" />}
            className="text-brand-navy"
          />
          <Input
            label="Assessor Name / Affiliation *"
            type="text"
            required
            value={assessorNameAffiliation}
            onChange={(e) => setAssessorNameAffiliation(e.target.value)}
            placeholder="e.g., Jane Doe / Nodal Center Chennai"
            icon={<Briefcase className="w-4 h-4" />}
          />
        </div>
      </div>
    </div>
  );
}
