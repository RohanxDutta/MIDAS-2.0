'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ChevronLeft,
  Download,
  FileText,
  ShieldCheck,
  Database,
  Building2,
  Calendar,
  User,
  Hash,
  Award,
  Lock,
  CheckCircle2,
} from 'lucide-react'
import { PortalPageLayout } from '@/components/portal/PortalPageLayout'
import { supabase } from '@/lib/supabase'
import { FAKE_SUBMISSIONS, type SubmissionStatus } from '../nodal-data'
import { domainsData } from '@/lib/domainsData'

const STATUS_COLORS: Record<SubmissionStatus, string> = {
  'Submitted': 'bg-amber-50 text-amber-700 border-amber-200',
  'Under Review': 'bg-blue-50 text-blue-700 border-blue-200',
  'Approved': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Revision Required': 'bg-rose-50 text-rose-700 border-rose-200',
}

// Mock detailed DB answers for Section B 15 domains
const MOCK_DOMAIN_ANSWERS: Record<number, { score: number; description: string }> = {
  1: { score: 4, description: '100% of required fields (patient ID, diagnosis code, lab results) are fully populated across all records with zero null values in critical attributes.' },
  2: { score: 3, description: 'Standardized WHO ICD-11 coding schemas applied across all clinical diagnoses; minor formatting variations in legacy 2023 records.' },
  3: { score: 4, description: 'Dual-entry verification and automated range checks performed at data capture stage; precision validated against hospital EMR logs.' },
  4: { score: 3, description: 'Monthly temporal batch syncs with national surveillance portal; maximum reporting latency bounded within 48 hours.' },
  5: { score: 4, description: 'Comprehensive data dictionary provided with standardized SNOMED CT and LOINC concept mappings for all lab variables.' },
  6: { score: 4, description: 'Strict relational integrity constraints enforced with primary key and foreign key checks across clinical tables.' },
  7: { score: 3, description: 'Automated deduplication algorithm applied using national health ID and probabilistic matching on demographic attributes.' },
  8: { score: 4, description: 'Complete lineage documentation provided detailing raw data ingestion, transformation scripts, and final validation rules.' },
  9: { score: 3, description: 'Regular audit trails maintained with daily database backup logs and role-based access monitoring.' },
  10: { score: 4, description: 'Full compliance with ICMR National Ethical Guidelines for Biomedical Research involving human participants.' },
  11: { score: 4, description: 'Institutional Ethics Committee (IEC) approval certificate uploaded and validated (Approval Ref: ICMR/IEC/2026/0842).' },
  12: { score: 3, description: 'K-anonymity (k=5) and differential privacy noise added to geographical identifiers to prevent re-identification.' },
  13: { score: 4, description: 'Explicit patient informed consent recorded for secondary research usage across all surveillance cohorts.' },
  14: { score: 3, description: 'Standardized CSV/Parquet formats provided with OpenAPI v3 specification for automated integration.' },
  15: { score: 4, description: 'Dataset deposited in ICMR trusted repository with persistent DOI (10.1000/182) and CC-BY 4.0 open data license.' },
}

interface DatasetDetailClientProps {
  id: string
  initialUser?: any
}

export default function DatasetDetailClient({ id, initialUser }: DatasetDetailClientProps) {
  const router = useRouter()
  const [user, setUser] = useState<any>(initialUser)
  const [isDownloading, setIsDownloading] = useState(false)

  // Retrieve dataset from fake submissions list or default fallback
  const submission = FAKE_SUBMISSIONS.find((s) => s.id === id) || FAKE_SUBMISSIONS[0]

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
    } catch (err) {
      console.error('Error during signOut:', err)
    } finally {
      window.location.href = '/login'
    }
  }

  // File Metadata simulated from database (1 DB row entry + assessment_files relation)
  const mockFile = {
    file_name: `${submission.dataset_title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_v1.csv`,
    file_size: '3.42 MB',
    storage_path: `assessments/${submission.id}/dataset_v1.csv`,
    status: 'success',
    dataset_type: 'structured',
    dataset_link: null as string | null,
    doi_handle: `10.1000/${180 + parseInt(submission.id || '1')}`,
  }

  const handleDownload = () => {
    if (mockFile.dataset_type === 'unstructured' && mockFile.dataset_link) {
      window.open(mockFile.dataset_link, '_blank')
      return
    }

    setIsDownloading(true)
    setTimeout(() => {
      // Simulate file download trigger
      const element = document.createElement('a')
      const file = new Blob([
        `Dataset Title: ${submission.dataset_title}\nPI: ${submission.submitting_pi_custodian}\nDate: ${submission.date_of_assessment}\nCQI Score: ${submission.cqi_lite_score}\nGrade: ${submission.cqi_lite_grade}\n`,
      ], { type: 'text/csv' })
      element.href = URL.createObjectURL(file)
      element.download = mockFile.file_name
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)
      setIsDownloading(false)
    }, 1000)
  }

  return (
    <PortalPageLayout user={user} onLogout={handleLogout} showFooter={false}>
      <section className="fade-up w-full max-w-6xl mx-auto !px-4 sm:!px-8 !py-5 flex-1 flex flex-col min-h-0 h-[calc(100vh-72px)] overflow-hidden text-brand-navy">
        {/* HEADER BAR */}
        <div className="shrink-0 mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border/40 pb-4">
          <div>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-slate hover:text-brand-navy transition-colors mb-2 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" /> Back to Nodal Dashboard
            </Link>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-xl sm:text-2xl font-black font-serif text-brand-navy">
                {submission.dataset_title}
              </h1>
              <span className={`px-2.5 py-1 text-xs font-bold rounded-full border ${STATUS_COLORS[submission.status]}`}>
                {submission.status}
              </span>
            </div>
            <p className="text-xs text-brand-slate font-medium mt-1 flex flex-wrap items-center gap-3">
              <span className="flex items-center gap-1"><User className="w-3.5 h-3.5 text-brand-blue" /> {submission.submitting_pi_custodian}</span>
              <span>•</span>
              <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-brand-blue" /> {new Date(submission.date_of_assessment).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
              <span>•</span>
              <span className="flex items-center gap-1"><Hash className="w-3.5 h-3.5 text-brand-blue" /> DOI: {mockFile.doi_handle}</span>
            </p>
          </div>

          {/* MAIN DOWNLOAD ACTION BUTTON */}
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="px-5 py-2.5 bg-brand-blue hover:bg-brand-blue-hover disabled:bg-brand-blue/60 text-white font-semibold text-xs sm:text-sm rounded-full transition-all flex items-center justify-center gap-2 shadow-md shadow-brand-blue/15 cursor-pointer shrink-0 hover:-translate-y-[1px]"
          >
            {isDownloading ? (
              <>Preparing Download...</>
            ) : (
              <>
                <Download className="w-4 h-4" /> Download Dataset ({mockFile.file_size})
              </>
            )}
          </button>
        </div>

        {/* METRICS SUMMARY BAR */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 shrink-0 mb-4">
          <div className="bg-white/90 backdrop-blur-md border border-brand-border rounded-[18px] p-4 flex items-center gap-3 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-brand-blue flex items-center justify-center shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-extrabold text-brand-slate uppercase tracking-wider">CQI Quality Score</div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-lg font-black text-brand-navy">{submission.cqi_lite_score?.toFixed(1) ?? 'N/A'}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-blue/10 text-brand-blue uppercase">
                  {submission.cqi_lite_grade ?? 'Standard'}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-md border border-brand-border rounded-[18px] p-4 flex items-center gap-3 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-extrabold text-brand-slate uppercase tracking-wider">Privacy Risk Score</div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-lg font-black text-brand-navy">{submission.prs_lite_score?.toFixed(1) ?? 'N/A'}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 uppercase">
                  {submission.prs_lite_risk_band ?? 'Low Risk'}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-md border border-brand-border rounded-[18px] p-4 flex items-center gap-3 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-extrabold text-brand-slate uppercase tracking-wider">Release Category</div>
              <div className="text-sm font-bold text-brand-navy mt-0.5">
                {submission.release_category ?? 'Open Access'}
              </div>
            </div>
          </div>
        </div>

        {/* MAIN SCROLLABLE CONTENT CARD */}
        <div className="bg-white/90 backdrop-blur-md border border-brand-border rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.015)] flex-1 min-h-0 overflow-y-auto p-6 flex flex-col gap-6">
          {/* 1. DATASET SUBMISSION FILES AREA */}
          <div className="border border-brand-border/60 rounded-[18px] p-5 bg-brand-bg-start/40">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-brand-navy flex items-center gap-2">
                <Database className="w-4 h-4 text-brand-blue" /> Submitted Data File & Storage Details
              </h2>
              <span className="text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
                Storage Verified
              </span>
            </div>

            <div className="bg-white border border-brand-border rounded-[14px] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-blue/10 text-brand-blue flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-brand-navy">{mockFile.file_name}</p>
                  <p className="text-[11px] text-brand-slate font-medium">
                    Format: CSV Structured • Size: {mockFile.file_size} • Bucket: <code className="text-[10px] bg-brand-bg-start px-1.5 py-0.5 rounded text-brand-navy">midas-assessments</code>
                  </p>
                </div>
              </div>
              <button
                onClick={handleDownload}
                className="px-4 py-2 border border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white font-semibold text-xs rounded-full transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <Download className="w-3.5 h-3.5" /> Download File
              </button>
            </div>
          </div>

          {/* 2. SECTION A: METADATA DETAILS */}
          <div>
            <h2 className="text-sm font-bold text-brand-navy mb-3 flex items-center gap-2 border-b border-brand-border/40 pb-2">
              <Building2 className="w-4 h-4 text-brand-blue" /> Section A — Assessment Metadata & Custodian Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="bg-brand-bg-start/50 p-3.5 rounded-[14px] border border-brand-border/40">
                <span className="text-brand-slate font-semibold block mb-1">Submitting PI / Custodian</span>
                <span className="text-brand-navy font-bold">{submission.submitting_pi_custodian}</span>
              </div>
              <div className="bg-brand-bg-start/50 p-3.5 rounded-[14px] border border-brand-border/40">
                <span className="text-brand-slate font-semibold block mb-1">Assessor Name & Affiliation</span>
                <span className="text-brand-navy font-bold">{submission.assessor_name_affiliation}</span>
              </div>
              <div className="bg-brand-bg-start/50 p-3.5 rounded-[14px] border border-brand-border/40">
                <span className="text-brand-slate font-semibold block mb-1">Version DOI / Handle</span>
                <span className="text-brand-navy font-bold font-mono">{mockFile.doi_handle}</span>
              </div>
              <div className="bg-brand-bg-start/50 p-3.5 rounded-[14px] border border-brand-border/40">
                <span className="text-brand-slate font-semibold block mb-1">Date of Assessment</span>
                <span className="text-brand-navy font-bold">{submission.date_of_assessment}</span>
              </div>
            </div>
          </div>

          {/* 3. SECTION B: 15 QUALITY DOMAIN SCORES & JUSTIFICATION NARRATIVES */}
          <div>
            <h2 className="text-sm font-bold text-brand-navy mb-3 flex items-center gap-2 border-b border-brand-border/40 pb-2">
              <CheckCircle2 className="w-4 h-4 text-brand-blue" /> Section B — 15 Quality Domain Scores & Justification Narratives
            </h2>
            <div className="space-y-3">
              {domainsData.map((dom) => {
                const answer = MOCK_DOMAIN_ANSWERS[dom.id] || { score: 3, description: 'Assessment completed according to ICMR MIDAS 2.0 framework standard guidelines.' }
                return (
                  <div
                    key={dom.id}
                    className="p-4 rounded-[16px] border border-brand-border/50 bg-white hover:border-brand-blue/30 transition-all shadow-2xs"
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <span className="text-[10px] font-extrabold uppercase text-brand-blue tracking-wide">
                          Domain {dom.id}
                        </span>
                        <h3 className="text-xs font-bold text-brand-navy">{dom.title}</h3>
                      </div>
                      <span className="shrink-0 px-2.5 py-1 text-[11px] font-bold rounded-full bg-brand-blue/10 text-brand-blue border border-brand-blue/20">
                        Score: {answer.score} / 4
                      </span>
                    </div>
                    <p className="text-xs text-brand-slate leading-relaxed bg-brand-bg-start/60 p-3 rounded-[12px] border border-brand-border/30 mt-2">
                      <strong className="text-brand-navy">Assessor Factual Justification:</strong> {answer.description}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>
    </PortalPageLayout>
  )
}
