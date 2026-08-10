'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import type { User as SupabaseUser } from '@supabase/supabase-js'
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
  Loader2,
  MessageSquare,
  Save,
  X,
} from 'lucide-react'
import { PortalNav } from '@/components/portal/PortalNav'
import { supabase } from '@/lib/supabase'
import { normalizeStatus, type Submission, type SubmissionStatus } from '../nodal-data'
import { domainsData } from '@/lib/domainsData'
import { nodalQuestions } from '@/lib/nodalQuestions'

const STATUS_COLORS: Record<SubmissionStatus, string> = {
  'Submitted': 'bg-amber-50 text-amber-700 border-amber-200',
  'Under Review': 'bg-blue-50 text-blue-700 border-blue-200',
  'Approved': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Revision Required': 'bg-rose-50 text-rose-700 border-rose-200',
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

interface DatasetDetailClientProps {
  id: string
  initialUser?: SupabaseUser | null
}

export default function DatasetDetailClient({ id, initialUser }: DatasetDetailClientProps) {
  const [user, setUser] = useState<SupabaseUser | null>(initialUser ?? null)
  const [isDownloading, setIsDownloading] = useState(false)

  // Determine back navigation dynamically
  const isNodal = (user?.app_metadata?.role ?? user?.user_metadata?.role) === 'nodal'
  const backLink = isNodal ? '/dashboard' : '/assessments'
  const backText = isNodal ? 'Back to Nodal Dashboard' : 'Back to My Assessments'

  // Live data state
  const [assessment, setAssessment] = useState<Submission | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)

  // Nodal review state
  const [reviewState, setReviewState] = useState<
    Record<
    number,
    {
    review_status:string|null;
    reviewer_remarks:string|null;
    review_score:number|null;
    }
    >
    >({})
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [showSubmitDialog, setShowSubmitDialog] = useState(false)
  const initializedReview = useRef(false)

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const hasFetchedOnce = useRef(false)

  // Fetch live assessment detail from API
  useEffect(() => {
    async function fetchDetail() {
      if (!hasFetchedOnce.current) setIsLoading(true)
      setFetchError(null)

      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
          window.location.href = '/login?error=session_expired'
          return
        }

        const res = await fetch(`/api/v1/assessments/${id}`, {
          headers: { Authorization: `Bearer ${session.access_token}` },
        })

        if (res.status === 401) {
          await supabase.auth.signOut()
          window.location.href = '/login?error=session_expired'
          return
        }

        if (res.status === 404) {
          setFetchError('Assessment not found')
          return
        }

        if (!res.ok) {
          throw new Error(`Failed to fetch assessment: ${res.status}`)
        }

        const data = await res.json()
        setAssessment({
          ...data,
          id: String(data.id),
          status: normalizeStatus(data.status || 'submitted'),
          date_of_assessment: data.date_of_assessment || data.created_at?.split('T')[0] || '',
        })
        hasFetchedOnce.current = true
      } catch (err) {
        console.error('Error fetching assessment detail:', err)
        setFetchError(err instanceof Error ? err.message : 'Failed to load assessment')
      } finally {
        setIsLoading(false)
      }
    }

    if (user?.id && id) {
      fetchDetail()
    }
  }, [user?.id, id])

  // Initialize reviewState from API data once
  useEffect(() => {
    if (assessment?.answers && !initializedReview.current) {
      initializedReview.current = true
      const initialReviewState: Record<
        number,
        { review_status: string | null; reviewer_remarks: string | null; review_score: number | null }
      > = {}
      for (const ans of assessment.answers) {
        initialReviewState[ans.domain_id] = {
          review_status: ans.review_status ?? null,
          reviewer_remarks: ans.reviewer_remarks ?? null,
          review_score: ans.score ?? null,
        }
      }
      setReviewState(initialReviewState)
    }
  }, [assessment])

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
    } catch (err) {
      console.error('Error during signOut:', err)
    } finally {
      window.location.href = '/login'
    }
  }

  const handleDownload = async () => {
    if (!assessment) return

    // For unstructured datasets with an external link, open directly
    if (assessment.dataset_type === 'unstructured' && assessment.dataset_link) {
      window.open(assessment.dataset_link, '_blank')
      return
    }

    setIsDownloading(true)

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const res = await fetch(`/api/v1/assessments/${id}/download`, {
        headers: { Authorization: `Bearer ${session.access_token}` },
      })

      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.detail || 'Download failed')
      }

      const data = await res.json()
      if (data.download_url) {
        window.open(data.download_url, '_blank')
      }
    } catch (err) {
      console.error('Download error:', err)
      alert(`Download failed: ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setIsDownloading(false)
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="portal-home-page h-screen w-screen overflow-hidden bg-portal text-brand-navy">
        <PortalNav user={user} onLogout={handleLogout} />
        <div className="flex flex-col w-full h-full overflow-hidden pt-[72px]">
          <section className="w-full max-w-6xl mx-auto !px-4 sm:!px-8 !py-5 flex-1 flex flex-col items-center justify-center min-h-0">
            <Loader2 className="w-8 h-8 animate-spin text-brand-blue mb-3" />
            <p className="text-sm font-semibold text-brand-slate">Loading assessment details...</p>
          </section>
        </div>
      </div>
    )
  }

  // Error state
  if (fetchError || !assessment) {
    return (
      <div className="portal-home-page h-screen w-screen overflow-hidden bg-portal text-brand-navy">
        <PortalNav user={user} onLogout={handleLogout} />
        <div className="flex flex-col w-full h-full overflow-hidden pt-[72px]">
          <section className="w-full max-w-6xl mx-auto !px-4 sm:!px-8 !py-5 flex-1 flex flex-col items-center justify-center min-h-0">
            <p className="text-sm font-semibold text-rose-600 mb-2">{fetchError || 'Assessment not found'}</p>
            <Link
              href={backLink}
              className="mt-3 px-4 py-1.5 text-xs font-semibold text-brand-blue border border-brand-blue rounded-full hover:bg-brand-blue/5 transition-all cursor-pointer inline-flex items-center gap-1.5"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> {backText}
            </Link>
          </section>
        </div>
      </div>
    )
  }

  // Build file metadata from live data
  const primaryFile = assessment.files?.[0]
  const hasFile = !!primaryFile

  // Build answers map from live data: domain_id -> { score, factual_description }
  const answersMap: Record<number, { score: number; description: string }> = {}
  if (assessment.answers) {
    for (const ans of assessment.answers) {
      answersMap[ans.domain_id] = {
        score: ans.score,
        description: ans.factual_description,
      }
    }
  }

  // Nodal review handlers
  

  const handleSaveReview = async () => {
    console.log("Save Draft clicked");
    setIsSaving(true)
    setSaveMessage(null)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const reviews = Object.entries(reviewState)
        .map(([domainId, r]) => ({
          domain_id: Number(domainId),
          review_score:r.review_score,
          review_status: r.review_status,
          reviewer_remarks: r.reviewer_remarks,
        }))
        .filter((r) => r.review_status !== null && r.review_score !== null)

      const res = await fetch(`/api/v1/assessments/${id}/review`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${session.access_token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviews }),
      })
      console.log("HTTP Status:", res.status);

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.detail || 'Failed to save review')
      }

      setSaveMessage({ type: 'success', text: 'Review saved successfully' })
    } catch (err) {
      setSaveMessage({ type: 'error', text: err instanceof Error ? err.message : 'Failed to save review' })
    } finally {
      setIsSaving(false)
      setTimeout(() => setSaveMessage(null), 3000)
    }
  }

  const handleSubmitReview = async (assessmentStatus: string) => {
    console.log("Submit Review clicked");
    setIsSaving(true)
    setSaveMessage(null)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const reviews = Object.entries(reviewState)
        .map(([domainId,r])=>({
            domain_id:Number(domainId),
            review_score:r.review_score,
            review_status:r.review_status,
            reviewer_remarks:r.reviewer_remarks,
        }))
        .filter((r) => r.review_status !== null && r.review_score !== null)

      const res = await fetch(`/api/v1/assessments/${id}/review/submit`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${session.access_token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviews, assessment_status: assessmentStatus }),
      })
      console.log("Submit Status:", res.status);

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.detail || 'Failed to submit review')
      }

      setShowSubmitDialog(false)
      setSaveMessage({ type: 'success', text: 'Review submitted successfully' })
      // Re-fetch assessment to update status badge
      const { data: { session: s } } = await supabase.auth.getSession()
      if (s) {
        const refreshed = await fetch(`/api/v1/assessments/${id}`, {
          headers: { Authorization: `Bearer ${s.access_token}` },
        })
        if (refreshed.ok) {
          const data = await refreshed.json()
          setAssessment({
            ...data,
            id: String(data.id),
            status: normalizeStatus(data.status || 'submitted'),
            date_of_assessment: data.date_of_assessment || data.created_at?.split('T')[0] || '',
          })
        }
      }
    } catch (err) {
      setSaveMessage({ type: 'error', text: err instanceof Error ? err.message : 'Failed to submit review' })
    } finally {
      setIsSaving(false)
      setTimeout(() => setSaveMessage(null), 3000)
    }
  }

  // Derived review counts
  const reviewEntries = Object.values(reviewState)
  const greenCount =
    reviewEntries.filter(
    r=>r.review_status==="approved"
    ).length
  const yellowCount = reviewEntries.filter((r) => r.review_status === 'needs_revision').length
  const unreviewedCount = 15 - greenCount - yellowCount
  const unansweredMcqs =
    Object.values(reviewState)
        .filter(r => r.review_score === null)
        .length
  const totalDomains = domainsData.length
  const canApprove =
    unansweredMcqs === 0 &&
    greenCount === domainsData.length &&
    yellowCount === 0 &&
    unreviewedCount === 0

  return (
    <div className="portal-home-page h-screen w-screen overflow-hidden bg-portal text-brand-navy">
      <PortalNav user={user} onLogout={handleLogout} />
      <div className="flex flex-col w-full h-full overflow-hidden pt-[72px]">
        <section className="w-full max-w-6xl mx-auto !px-4 sm:!px-8 !py-5 flex-1 flex flex-col min-h-0 overflow-hidden text-brand-navy">
        {/* HEADER BAR */}
        <div className="shrink-0 mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border/40 pb-4">
          <div>
            <Link
              href={backLink}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-slate hover:text-brand-navy transition-colors mb-2 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" /> {backText}
            </Link>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-xl sm:text-2xl font-black font-serif text-brand-navy">
                {assessment.dataset_title}
              </h1>
              <span className={`px-2.5 py-1 text-xs font-bold rounded-full border ${STATUS_COLORS[assessment.status]}`}>
                {assessment.status}
              </span>
            </div>
            <p className="text-xs text-brand-slate font-medium mt-1 flex flex-wrap items-center gap-3">
              <span className="flex items-center gap-1"><User className="w-3.5 h-3.5 text-brand-blue" /> {assessment.submitting_pi_custodian}</span>
              <span>•</span>
              <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-brand-blue" /> {assessment.date_of_assessment ? new Date(assessment.date_of_assessment).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Unknown Date'}</span>
              {assessment.version_doi_handle && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1"><Hash className="w-3.5 h-3.5 text-brand-blue" /> DOI: {assessment.version_doi_handle}</span>
                </>
              )}
            </p>
          </div>

          {/* MAIN DOWNLOAD ACTION BUTTON */}
          {hasFile && assessment.status === "Approved" && (
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="px-5 py-2.5 bg-brand-blue hover:bg-brand-blue-hover disabled:bg-brand-blue/60 text-white font-semibold text-xs sm:text-sm rounded-full transition-all flex items-center justify-center gap-2 shadow-md shadow-brand-blue/15 cursor-pointer shrink-0 hover:-translate-y-[1px]"
            >
              {isDownloading ? (
                <>Preparing Download...</>
              ) : (
                <>
                  <Download className="w-4 h-4" /> Download Dataset ({formatFileSize(primaryFile!.file_size)})
                </>
              )}
            </button>
          )}
        </div>

        {/* METRICS SUMMARY BAR */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 shrink-0 mb-4">
          <div className="bg-white/90 backdrop-blur-md border border-brand-border rounded-[18px] p-4 flex items-center gap-3 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-brand-blue flex items-center justify-center shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-extrabold text-brand-slate uppercase tracking-wider">CQI-Lite Score</div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-lg font-black text-brand-navy">{assessment.cqi_lite_score?.toFixed(1) ?? 'N/A'}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-blue/10 text-brand-blue uppercase">
                  {assessment.cqi_lite_grade ?? 'Standard'}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-md border border-brand-border rounded-[18px] p-4 flex items-center gap-3 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-extrabold text-brand-slate uppercase tracking-wider">PRS-Lite Score</div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-lg font-black text-brand-navy">{assessment.prs_lite_score?.toFixed(1) ?? 'N/A'}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 uppercase">
                  {assessment.prs_lite_risk_band ?? 'Low Risk'}
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
                {assessment.release_category ?? 'Open Access'}
              </div>
            </div>
          </div>
        </div>

        {/* MAIN SCROLLABLE CONTENT CARD */}
        <div className="bg-white/90 backdrop-blur-md border border-brand-border rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.015)] flex-1 min-h-0 overflow-y-auto p-6 flex flex-col gap-6">
          {/* 1. DATASET SUBMISSION FILES AREA */}
          {hasFile && (
            <div className="border border-brand-border/60 rounded-[18px] p-5 bg-brand-bg-start/40">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold text-brand-navy flex items-center gap-2">
                  <Database className="w-4 h-4 text-brand-blue" /> Submitted Data File & Storage Details
                </h2>
                <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                  primaryFile!.status === 'success'
                    ? 'bg-emerald-100 text-emerald-800'
                    : primaryFile!.status === 'failed'
                    ? 'bg-rose-100 text-rose-800'
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {primaryFile!.status === 'success' ? 'Storage Verified' : primaryFile!.status === 'failed' ? 'Validation Failed' : 'Pending'}
                </span>
              </div>

              <div className="bg-white border border-brand-border rounded-[14px] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-blue/10 text-brand-blue flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-brand-navy">{primaryFile!.file_name}</p>
                    <p className="text-[11px] text-brand-slate font-medium">
                      Format: CSV Structured • Size: {formatFileSize(primaryFile!.file_size)} • Bucket: <code className="text-[10px] bg-brand-bg-start px-1.5 py-0.5 rounded text-brand-navy">midas-assessments</code>
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
          )}

          {/* No file state */}
          {!hasFile && assessment.dataset_type === 'unstructured' && assessment.dataset_link && (
            <div className="border border-brand-border/60 rounded-[18px] p-5 bg-brand-bg-start/40">
              <h2 className="text-sm font-bold text-brand-navy flex items-center gap-2 mb-3">
                <Database className="w-4 h-4 text-brand-blue" /> External Dataset Link
              </h2>
              <a
                href={assessment.dataset_link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-brand-blue hover:underline font-semibold break-all"
              >
                {assessment.dataset_link}
              </a>
            </div>
          )}

          {/* 2. SECTION A: METADATA DETAILS */}
          <div>
            <h2 className="text-sm font-bold text-brand-navy mb-3 flex items-center gap-2 border-b border-brand-border/40 pb-2">
              <Building2 className="w-4 h-4 text-brand-blue" /> Section A — Assessment Metadata & Custodian Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="bg-brand-bg-start/50 p-3.5 rounded-[14px] border border-brand-border/40">
                <span className="text-brand-slate font-semibold block mb-1">Submitting PI / Custodian</span>
                <span className="text-brand-navy font-bold">{assessment.submitting_pi_custodian}</span>
              </div>
              <div className="bg-brand-bg-start/50 p-3.5 rounded-[14px] border border-brand-border/40">
                <span className="text-brand-slate font-semibold block mb-1">Assessor Name & Affiliation</span>
                <span className="text-brand-navy font-bold">{assessment.assessor_name_affiliation}</span>
              </div>
              <div className="bg-brand-bg-start/50 p-3.5 rounded-[14px] border border-brand-border/40">
                <span className="text-brand-slate font-semibold block mb-1">Version DOI / Handle</span>
                <span className="text-brand-navy font-bold font-mono">{assessment.version_doi_handle || '—'}</span>
              </div>
              <div className="bg-brand-bg-start/50 p-3.5 rounded-[14px] border border-brand-border/40">
                <span className="text-brand-slate font-semibold block mb-1">Date of Assessment</span>
                <span className="text-brand-navy font-bold">{assessment.date_of_assessment}</span>
              </div>
            </div>
          </div>

          {/* 3. SECTION B: 15 QUALITY DOMAIN SCORES & JUSTIFICATION NARRATIVES */}
          <div>
            <h2 className="text-sm font-bold text-brand-navy mb-3 flex items-center gap-2 border-b border-brand-border/40 pb-2">
              <CheckCircle2 className="w-4 h-4 text-brand-blue" /> Section B — 15 Quality Domain Scores & Justification Narratives
            </h2>
            <div className="space-y-4">
              {domainsData.map((dom) => {
                const answer = answersMap[dom.id] || { score: 0, description: 'No response provided.' }
                const rubricText = dom.descriptions[answer.score] || 'No rubric selected.'
                return (
                  <div
                    key={dom.id}
                    className={`p-4 rounded-[16px] border bg-white transition-all shadow-2xs ${
                      reviewState[dom.id]?.review_status === 'approved'
                        ? 'border-emerald-400'
                        : reviewState[dom.id]?.review_status === 'needs_revision'
                        ? 'border-amber-400'
                        : 'border-brand-border/50 hover:border-brand-blue/30'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-3 pb-3 border-b border-brand-border/40">
                      <div>
                        <span className="text-[10px] font-extrabold uppercase text-brand-blue tracking-wide">
                          Domain {dom.id}
                        </span>
                        <h3 className="text-sm font-bold text-brand-navy">{dom.title}</h3>
                      </div>
                      <span className="shrink-0 px-2.5 py-1 text-[11px] font-bold rounded-full bg-brand-blue/10 text-brand-blue border border-brand-blue/20">
                        Score: {answer.score} / 4
                      </span>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <span className="text-[10px] font-bold text-brand-slate uppercase tracking-wider mb-1 block">Option Chosen</span>
                        <p className="text-xs text-brand-navy leading-relaxed bg-brand-bg-start/30 p-2.5 rounded-[8px] border border-brand-border/40">
                          {rubricText}
                        </p>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-brand-slate uppercase tracking-wider mb-1 block">Assessor Factual Justification</span>
                        <p className="text-xs text-brand-navy leading-relaxed bg-brand-bg-start/60 p-3 rounded-[12px] border border-brand-border/50">
                          {answer.description}
                        </p>
                      </div>
                    </div>

                    

                    {/* ===========================
                            TECHNICAL NODAL REVIEW
                        =========================== */}

                        {isNodal && (
                          <div className="mt-6 border-t pt-6">

                            <h3 className="text-lg font-bold text-brand-navy mb-4">
                              Technical Nodal Review
                            </h3>

                            {nodalQuestions
                              .find((d) => d.id === dom.id)
                              ?.scores.map((option) => (
                                <label
                                  key={option.score}
                                  className="flex items-start gap-3 border rounded-xl p-4 mb-3 cursor-pointer hover:border-brand-blue"
                                >
                                  <input
                                    type="radio"
                                    name={`review-score-${dom.id}`}
                                    checked={
                                      reviewState[dom.id]?.review_score === option.score
                                    }
                                    onChange={() =>
                                      setReviewState((prev) => ({
                                        ...prev,
                                        [dom.id]: {
                                          ...prev[dom.id],
                                          review_score: option.score,
                                        },
                                      }))
                                    }
                                  />

                                  <div>
                                    <div className="font-bold">
                                      Option {String.fromCharCode(65 + option.score)}
                                    </div>

                                    <div className="text-sm text-brand-slate">
                                      {option.description}
                                    </div>
                                  </div>
                                </label>
                              ))}

                          </div>
                        )}

                          {/* Decision */}

                          <div className="mt-6">

                            <h4 className="font-semibold text-brand-navy mb-3">
                              Review Decision
                            </h4>

                            <div className="flex gap-6">

                              <label className="flex items-center gap-2">

                                <input
                                  type="radio"
                                  name={`decision-${dom.id}`}
                                  checked={
                                  reviewState[dom.id]?.review_status==="approved"
                                  }
                                  onChange={() =>
                                  setReviewState(prev => ({
                                      ...prev,
                                      [dom.id]:{
                                          ...prev[dom.id],
                                          review_status: "approved",
                                          reviewer_remarks: null,
                                      }
                                  }))
                                  }
                                />

                                Approve

                              </label>

                              <label className="flex items-center gap-2">

                                <input
                                  type="radio"
                                  name={`decision-${dom.id}`}
                                 checked={
                                reviewState[dom.id]?.review_status==="needs_revision"
                                }
                                  onChange={() =>
                                    setReviewState(prev => ({
                                      ...prev,
                                      [dom.id]:{
                                          ...prev[dom.id],
                                          review_status:"needs_revision",
                                          reviewer_remarks:
                                            prev[dom.id]?.reviewer_remarks ?? ""
                                      }
                                    }))
                                  }
                                />

                                Needs Revision

                              </label>

                            </div>

                          </div>

                          {/* Revision Comment */}

                          {reviewState[dom.id]?.review_status === "needs_revision" && (

                            <div className="mt-5">

                              <label className="block text-sm font-semibold mb-2">
                                Revision Required
                              </label>

                              <textarea
                                rows={3}
                                className="w-full border rounded-xl p-3"
                                placeholder="Mention what evidence or clarification is required..."
                                value={reviewState[dom.id]?.reviewer_remarks ?? ""}
                                onChange={(e)=>
                                  setReviewState(prev=>({
                                    ...prev,
                                    [dom.id]:{
                                      ...prev[dom.id],
                                      reviewer_remarks:e.target.value
                                    }
                                  }))
                                }
                              />

                            </div>

                          )}

                        </div>
                      )
                    })}
                  </div>
                </div>

                {isNodal && (
                <div className="mt-8 flex justify-end gap-3 border-t pt-6">

                    <button
                        type="button"
                        onClick={handleSaveReview}
                        disabled={isSaving}
                        className="px-5 py-2 rounded-full border border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white font-semibold flex items-center gap-2"
                    >
                        <Save className="w-4 h-4"/>
                        Save Draft
                    </button>

                    <button
                        type="button"
                        onClick={() => setShowSubmitDialog(true)}
                        disabled={isSaving}
                        className="px-6 py-2 rounded-full bg-brand-blue text-white font-semibold hover:bg-brand-blue-hover"
                    >
                        Submit Review
                    </button>

                </div>
                )}

            

          {/* SUBMIT REVIEW CONFIRMATION MODAL */}
          {isNodal && showSubmitDialog && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
              <div className="bg-white rounded-2xl shadow-xl border border-brand-border p-6 max-w-md w-full mx-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-brand-navy">Submit Final Review</h3>
                  <button
                    type="button"
                    onClick={() => setShowSubmitDialog(false)}
                    className="p-1 rounded-full hover:bg-brand-bg-start transition-all cursor-pointer"
                  >
                    <X className="w-4 h-4 text-brand-slate" />
                  </button>
                </div>
                <div className="space-y-3 text-xs">
                  <p className="text-brand-navy font-semibold">
                    Review Summary
                  </p>
                    <p className="text-xs text-brand-slate mt-2">

                    Pending MCQs :
                    <b>{unansweredMcqs}</b>

                    </p>
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> {greenCount} Okay
                    </span>
                    <span className="flex items-center gap-1 text-amber-600 font-semibold">
                      <MessageSquare className="w-3.5 h-3.5" /> {yellowCount} Needs Revision
                    </span>
                    {unreviewedCount > 0 && (
                      <span className="text-rose-600 font-semibold">{unreviewedCount} Unreviewed</span>
                    )}
                  </div>
                  {unreviewedCount > 0 && (
                    <p className="text-amber-600 bg-amber-50 p-2.5 rounded-[10px] border border-amber-200">
                      {unreviewedCount} domain{unreviewedCount > 1 ? 's' : ''} still {unreviewedCount > 1 ? 'have' : 'has'} no review status.
                    </p>
                  )}
                  {yellowCount > 0 && (
                    <p className="text-amber-600 bg-amber-50 p-2.5 rounded-[10px] border border-amber-200">
                      Yellow-marked domains will flag this assessment as needing revision.
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-5 pt-3 border-t border-brand-border/40">
                  <button
                    type="button"
                    onClick={() => handleSubmitReview('approved')}
                    disabled={isSaving || !canApprove}
                    className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-600/60 text-white font-semibold text-xs rounded-full transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                    Approve Assessment
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSubmitReview('revision_required')}
                    disabled={isSaving || yellowCount === 0}
                    className="flex-1 px-4 py-2 bg-rose-600 hover:bg-rose-700 disabled:bg-rose-600/60 text-white font-semibold text-xs rounded-full transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <MessageSquare className="w-3.5 h-3.5" />}
                    Request Revision
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowSubmitDialog(false)}
                    disabled={isSaving}
                    className="px-4 py-2 border border-brand-border text-brand-slate hover:text-brand-navy font-semibold text-xs rounded-full transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
     </div>
    </div> 
  )
} 
