import { Award, ShieldCheck, Download, AlertTriangle } from 'lucide-react';

interface CertificateViewProps {
  assessment: {
    id: string
    dataset_title: string
    version_doi_handle: string
    submitting_pi_custodian: string

    cqi_lite_score: number | null
    cqi_lite_grade: string | null

    prs_lite_score: number | null
    prs_lite_risk_band: string | null

    release_category: string | null

    status: string

    certificate_id?: string | null
    certificate_issued_at?: string | null
  }
}

type GradeStyle = { bg: string; fg: string; fill: string; icon: string };

const gradeStyle: Record<'Diamond' | 'Platinum' | 'Gold' | 'Silver' | 'Bronze', GradeStyle> = {
  Diamond: { bg: '#E6F1FB', fg: '#042C53', fill: '#378ADD', icon: 'diamond' },
  Platinum: { bg: '#F1EFE8', fg: '#2C2C2A', fill: '#888780', icon: 'medal' },
  Gold: { bg: '#FAEEDA', fg: '#412402', fill: '#BA7517', icon: 'medal' },
  Silver: { bg: '#F1EFE8', fg: '#2C2C2A', fill: '#B4B2A9', icon: 'medal' },
  Bronze: { bg: '#FAECE7', fg: '#4A1B0C', fill: '#993C1D', icon: 'medal' },
};

const releaseStyle: Record<string, { bg: string; fg: string }> = {
  Open: { bg: '#EAF3DE', fg: '#173404' },
  Controlled: { bg: '#FAEEDA', fg: '#412402' },
  Restricted: { bg: '#FCEBEB', fg: '#501313' },
};

export function CertificateView({
  assessment,
}: CertificateViewProps) {

  if (
    assessment.cqi_lite_score === null ||
    assessment.prs_lite_score === null ||
    !assessment.release_category
  ) {
    return (
      <div className="text-center text-sm font-bold text-brand-slate py-12">
        Verified scores are not yet available for this dataset.
      </div>
    );
  }

  const grade = gradeStyle[
    assessment.cqi_lite_grade as keyof typeof gradeStyle
  ];

  const release =
    releaseStyle[assessment.release_category] ??
    releaseStyle.Restricted;

  const issuedDateLabel = assessment.certificate_issued_at
    ? new Intl.DateTimeFormat("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "Asia/Kolkata",
      }).format(new Date(assessment.certificate_issued_at))
    : "—";

  // Remediation-grade datasets are not eligible for a certificate
  if (assessment.cqi_lite_grade === "Remediation") {
    return (
      <div className="flex-1 flex flex-col items-center justify-center max-w-lg mx-auto px-6 py-12 text-center">
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center mb-6"
          style={{ background: "#FCEBEB" }}
        >
          <AlertTriangle className="w-7 h-7" style={{ color: "#791F1F" }} />
        </div>

        <h2 className="text-2xl font-extrabold text-brand-navy mb-2">
          Certificate not issued
        </h2>

        <p className="text-sm font-semibold text-brand-slate leading-relaxed">
          This dataset is currently not eligible for certification.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center max-w-3xl mx-auto px-6 py-12 w-full animate-fadeIn select-none">

      <div className="w-full bg-white border border-brand-border rounded-[16px] overflow-hidden shadow-sm">

        {/* Header */}

        <div
          className="flex items-center justify-between px-8 py-6"
          style={{ background: "#EEEDFE" }}
        >
          <div className="flex items-center gap-3">

            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "#534AB7" }}
            >
              <ShieldCheck className="w-5.5 h-5.5 text-white" />
            </div>

            <div>
              <p
                className="text-[11px] font-bold"
                style={{ color: "#534AB7" }}
              >
                IndiaAI · MeitY
              </p>

              <p
                className="text-base font-extrabold"
                style={{ color: "#26215C" }}
              >
                MIDAS Dataset Certificate
              </p>
            </div>

          </div>

          <span
            className="text-[11px] font-mono font-bold"
            style={{ color: "#534AB7" }}
          >
            {assessment.certificate_id ??
              `MIDAS-${assessment.id.slice(0, 8).toUpperCase()}`}
          </span>

        </div>

        {/* Body */}

        <div className="px-8 py-8">

          <div className="mb-6">
            <span className="text-[11px] font-bold text-brand-slate uppercase tracking-wide">
              Dataset Title
            </span>

            <p className="text-xl font-extrabold text-brand-navy mt-1">
              {assessment.dataset_title}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-y-4 gap-x-6 pb-6 mb-6 border-b border-brand-border/60 text-sm">

            <div>
              <span className="text-[11px] font-bold text-brand-slate uppercase tracking-wide block">
                PI / Custodian
              </span>

              <span className="font-bold text-brand-navy">
                {assessment.submitting_pi_custodian}
              </span>
            </div>

            <div>
              <span className="text-[11px] font-bold text-brand-slate uppercase tracking-wide block">
                Version / DOI
              </span>

              <span className="font-bold text-brand-navy">
                {assessment.version_doi_handle}
              </span>
            </div>

            <div>
              <span className="text-[11px] font-bold text-brand-slate uppercase tracking-wide block">
                Issued Date
              </span>

              <span className="font-bold text-brand-navy">
                {issuedDateLabel}
              </span>
            </div>

            <div>
              <span className="text-[11px] font-bold text-brand-slate uppercase tracking-wide block">
                Verified By
              </span>

              <span className="font-bold text-brand-navy">
                MIDAS Technical Nodal Centre
              </span>
            </div>

          </div>

          <div
            className="grid gap-3"
            style={{ gridTemplateColumns: "1.2fr 1fr 1fr" }}
          >

            {/* CQI */}

            <div
              className="rounded-xl p-4 flex items-center gap-3"
              style={{ background: grade.bg }}
            >
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center"
                style={{ background: grade.fill }}
              >
                <Award className="w-5.5 h-5.5 text-white" />
              </div>

              <div>
                <p
                  className="text-[11px] font-bold"
                  style={{ color: grade.fill }}
                >
                  CQI Grade
                </p>

                <p
                  className="text-lg font-extrabold"
                  style={{ color: grade.fg }}
                >
                  {assessment.cqi_lite_grade}
                </p>

                <p
                  className="text-[11px] font-bold"
                  style={{ color: grade.fill }}
                >
                  {assessment.cqi_lite_score}%
                </p>

              </div>
            </div>

            {/* PRS */}

            <div
              className="rounded-xl p-4"
              style={{ background: "#E1F5EE" }}
            >
              <p
                className="text-[11px] font-bold"
                style={{ color: "#0F6E56" }}
              >
                Privacy Risk
              </p>

              <p
                className="text-lg font-extrabold mt-1"
                style={{ color: "#04342C" }}
              >
                {assessment.prs_lite_risk_band}
              </p>

              <p
                className="text-[11px] font-bold mt-1"
                style={{ color: "#0F6E56" }}
              >
                {assessment.prs_lite_score}/100
              </p>

            </div>

            {/* Release */}

            <div
              className="rounded-xl p-4"
              style={{ background: release.bg }}
            >
              <p
                className="text-[11px] font-bold"
                style={{ color: release.fg }}
              >
                Release Category
              </p>

              <p
                className="text-lg font-extrabold mt-1"
                style={{ color: release.fg }}
              >
                {assessment.release_category}
              </p>

            </div>

          </div>

        </div>

      </div>

      <div className="flex justify-center mt-8 print:hidden">

        <button
          type="button"
          onClick={() => window.print()}
          disabled={assessment.status.toLowerCase() !== "approved"}
          className={`px-6 py-3 rounded-full font-bold flex items-center gap-2 transition-all ${
            assessment.status.toLowerCase() === "approved"
              ? "bg-brand-blue hover:bg-brand-blue-hover text-white cursor-pointer"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          <Download className="w-4 h-4" />

          {assessment.status.toLowerCase() === "approved"
            ? "Download Certificate"
            : "Awaiting Approval"}

        </button>

      </div>

    </div>
  );
}

export default CertificateView;