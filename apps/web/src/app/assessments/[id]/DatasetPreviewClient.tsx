'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import type { User } from '@supabase/supabase-js'
import {
  ChevronLeft,
  Loader2,
  FileText,
  CheckCircle2,
  ShieldCheck,
  Upload,
  Link2,
} from 'lucide-react'
import { PortalPageLayout } from '@/components/portal/PortalPageLayout'
import { supabase } from '@/lib/supabase'
import { normalizeStatus, type Submission } from '@/app/dashboard/nodal-data'
import { NodalReviewForm } from '@/components/nodal/NodalReviewForm'

export default function DatasetPreviewClient({
  id,
  initialUser,
}: {
  id: string
  initialUser?: User | null
}) {
  const [user, setUser] = useState<User | null>(initialUser ?? null)
  const [assessment, setAssessment] = useState<Submission | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)

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

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
    } catch (err) {
      console.error('Error during signOut:', err)
    } finally {
      window.location.href = '/login'
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <PortalPageLayout user={user} onLogout={handleLogout} showFooter={false}>
        <section className="w-full max-w-6xl mx-auto !px-4 sm:!px-8 !py-5 flex-1 flex flex-col items-center justify-center min-h-0 h-[calc(100vh-72px)]">
          <Loader2 className="w-8 h-8 animate-spin text-brand-blue mb-3" />
          <p className="text-sm font-semibold text-brand-slate">Loading assessment details...</p>
        </section>
      </PortalPageLayout>
    )
  }

  // Error state
  if (fetchError || !assessment) {
    return (
      <PortalPageLayout user={user} onLogout={handleLogout} showFooter={false}>
        <section className="w-full max-w-6xl mx-auto !px-4 sm:!px-8 !py-5 flex-1 flex flex-col items-center justify-center min-h-0 h-[calc(100vh-72px)]">
          <p className="text-sm font-semibold text-rose-600 mb-2">{fetchError || 'Assessment not found'}</p>
          <Link
            href="/assessments"
            className="mt-3 px-4 py-1.5 text-xs font-semibold text-brand-blue border border-brand-blue rounded-full hover:bg-brand-blue/5 transition-all cursor-pointer inline-flex items-center gap-1.5"
          >
            <ChevronLeft className="w-3.5 h-3.5" /> Back to My Assessments
          </Link>
        </section>
      </PortalPageLayout>
    )
  }

  // Calculations for UI presentation
  const domain11Na = !(assessment.answers || []).some((a) => a.domain_id === 11)
  const answeredDomainsCount = (assessment.answers || []).length
  const primaryFile = (assessment.files || []).find((f) => f.status === 'success')

  return (
    <PortalPageLayout user={user} onLogout={handleLogout} showFooter={false}>
      <section className="w-full max-w-4xl mx-auto !px-4 sm:!px-8 !py-8 flex-1 flex flex-col min-h-0 h-[calc(100vh-72px)] overflow-y-auto">
        
        {/* Back Button */}
        <div className="mb-6">
          <Link
            href="/assessments"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-slate hover:text-brand-navy transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> Back to My Assessments
          </Link>
        </div>

        <div className="w-full flex flex-col select-none animate-fadeIn bg-white border border-brand-border rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.015)] p-6 sm:p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8 pb-6 border-b border-brand-border/60">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-brand-blue/10 flex items-center justify-center text-brand-blue shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <h2 className="text-xl font-extrabold text-brand-navy tracking-tight">Assessment Detail</h2>
                <span className="text-xs font-semibold text-brand-slate mt-0.5">
                  Submitted on {assessment.date_of_assessment ? new Date(assessment.date_of_assessment).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                </span>
              </div>
            </div>
            
            <span className={`inline-block px-3 py-1 text-xs font-bold rounded-full border ${
              assessment.status === 'Submitted' ? 'bg-amber-50 text-amber-700 border-amber-200' :
              assessment.status === 'Under Review' ? 'bg-blue-50 text-blue-700 border-blue-200' :
              assessment.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
              'bg-rose-50 text-rose-700 border-rose-200'
            }`}>
              {assessment.status}
            </span>
          </div>

          <div className="space-y-5">
            {/* Section A Summary */}
            <div className="bg-brand-bg-start/20 border border-brand-border rounded-[24px] p-5 space-y-4">
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
                    {assessment.dataset_title || 'N/A'}
                  </span>
                </div>
                <div>
                  <span className="text-brand-slate block text-[11px] font-bold uppercase tracking-wide">
                    Version / DOI / Handle
                  </span>
                  <span className="text-brand-navy font-bold mt-1 block">
                    {assessment.version_doi_handle || 'N/A'}
                  </span>
                </div>
                <div>
                  <span className="text-brand-slate block text-[11px] font-bold uppercase tracking-wide">
                    PI / Custodian
                  </span>
                  <span className="text-brand-navy font-bold mt-1 block">
                    {assessment.submitting_pi_custodian || 'N/A'}
                  </span>
                </div>
                <div>
                  <span className="text-brand-slate block text-[11px] font-bold uppercase tracking-wide">
                    Assessor / Affiliation
                  </span>
                  <span className="text-brand-navy font-bold mt-1 block">
                    {assessment.assessor_name_affiliation || 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            {/* Section B Summary Check */}
            <div className="bg-brand-bg-start/20 border border-brand-border rounded-[24px] p-5 flex justify-between items-center text-sm">
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
            <div className="bg-brand-bg-start/20 border border-brand-border rounded-[24px] p-5 flex justify-between items-center text-sm">
              <div className="flex items-center gap-3.5">
                <CheckCircle2 className="w-5.5 h-5.5 text-emerald-500 shrink-0" />
                <div className="flex flex-col">
                  <span className="font-bold text-brand-navy">Section C: Privacy Configurations</span>
                  <span className="text-xs font-semibold text-brand-slate mt-0.5">
                    Privacy configuration recorded
                  </span>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full shrink-0">
                Configured
              </span>
            </div>

            {/* Section D Summary */}
            <div className="bg-brand-bg-start/20 border border-brand-border rounded-[24px] p-5 space-y-4">
              <div className="flex items-center gap-2 border-b border-brand-border pb-2">
                <Upload className="w-4 h-4 text-brand-blue shrink-0" />
                <span className="text-[10px] font-bold text-brand-navy uppercase tracking-wider">
                  Section D: Uploaded Assets ({assessment.dataset_type})
                </span>
              </div>

              {assessment.dataset_type === 'unstructured' ? (
                <div className="flex items-center gap-2.5 text-sm">
                  <Link2 className="w-4.5 h-4.5 text-brand-blue shrink-0" />
                  <a
                    href={assessment.dataset_link || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-blue hover:underline font-bold truncate"
                  >
                    {assessment.dataset_link || 'No link provided'}
                  </a>
                </div>
              ) : (
                <div className="space-y-2">
                  {primaryFile ? (
                    <div className="text-xs font-bold text-brand-navy flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span className="truncate max-w-[280px] md:max-w-xl">{primaryFile.file_name}</span>
                      <span className="text-[10px] font-semibold text-brand-slate">
                        ({(primaryFile.file_size / 1024).toFixed(1)} KB)
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs font-semibold text-brand-slate block">
                      No validated files found.
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
          {/* ===========================
              Nodal Review
          =========================== */}

      {(user?.app_metadata?.role ?? user?.user_metadata?.role) === 'nodal' && (
        <NodalReviewForm
          submission={assessment}
          onReviewComplete={(updated: Submission) => {
            setAssessment(updated);
          }}
          custodianAnswers={assessment.answers}
          custodianIdentificationRisk={0}
          custodianSensitivityMultiplier={1}
          domain11Na={domain11Na}
        />
       )}
        </div>
      </section>
    </PortalPageLayout>
  )
}
