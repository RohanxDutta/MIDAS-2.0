'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Search, ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import { PortalPageLayout } from '@/components/portal/PortalPageLayout'
import { supabase } from '@/lib/supabase'
import { STATUS_OPTIONS, normalizeStatus, type Submission, type SubmissionStatus } from '@/app/dashboard/nodal-data'

type SortColumn = 'dataset_title' | 'date_of_assessment' | 'cqi_lite_score'
type SortDir = 'asc' | 'desc'

const STATUS_COLORS: Record<SubmissionStatus, string> = {
  'Submitted': 'bg-amber-50 text-amber-700 border-amber-200',
  'Under Review': 'bg-blue-50 text-blue-700 border-blue-200',
  'Approved': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Revision Required': 'bg-rose-50 text-rose-700 border-rose-200',
}

const ROWS_PER_PAGE = 6

interface SortHeaderProps {
  column: SortColumn
  current: SortColumn
  direction: SortDir
  label: string
  onSort: (col: SortColumn) => void
}

function SortHeader({ column, current, direction, label, onSort }: SortHeaderProps) {
  const isActive = current === column
  return (
    <button
      onClick={() => onSort(column)}
      className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-brand-slate hover:text-brand-navy transition-colors cursor-pointer"
    >
      {label}
      {isActive ? (
        direction === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
      ) : (
        <ArrowUpDown className="w-3 h-3 opacity-30" />
      )}
    </button>
  )
}

function StatusBadge({ status }: { status: SubmissionStatus }) {
  return (
    <span
      className={`inline-block px-2.5 py-1 text-[11px] font-bold rounded-full border ${STATUS_COLORS[status]}`}
    >
      {status}
    </span>
  )
}

export default function AssessmentsClient({ initialUser }: { initialUser?: any }) {
  const router = useRouter()
  const [user, setUser] = useState<any>(initialUser)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<SubmissionStatus | 'All'>('All')
  const [sortColumn, setSortColumn] = useState<SortColumn>('date_of_assessment')
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [page, setPage] = useState(0)

  // Live data state
  const [submissions, setSubmissions] = useState<Submission[]>([])
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

  // Fetch live assessments from API
  useEffect(() => {
    async function fetchAssessments() {
      if (!hasFetchedOnce.current) setIsLoading(true)
      setFetchError(null)

      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
          window.location.href = '/login?error=session_expired'
          return
        }

        const res = await fetch('/api/v1/assessments', {
          headers: { Authorization: `Bearer ${session.access_token}` },
        })

        if (res.status === 401) {
          await supabase.auth.signOut()
          window.location.href = '/login?error=session_expired'
          return
        }

        if (!res.ok) {
          throw new Error(`Failed to fetch assessments: ${res.status}`)
        }

        const data = await res.json()

        // Normalize status from DB format to UI format
        const normalized: Submission[] = data.map((row: any) => ({
          ...row,
          id: String(row.id),
          status: normalizeStatus(row.status || 'submitted'),
          date_of_assessment: row.date_of_assessment || row.created_at?.split('T')[0] || '',
        }))

        setSubmissions(normalized)
        hasFetchedOnce.current = true
      } catch (err: any) {
        console.error('Error fetching assessments:', err)
        setFetchError(err.message || 'Failed to load assessments')
      } finally {
        setIsLoading(false)
      }
    }

    if (user?.id) {
      fetchAssessments()
    }
  }, [user?.id])

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
    } catch (err) {
      console.error('Error during signOut:', err)
    } finally {
      window.location.href = '/login'
    }
  }

  const handleSort = (col: SortColumn) => {
    if (sortColumn === col) {
      setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortColumn(col)
      setSortDir('asc')
    }
    setPage(0)
  }

  const filtered = useMemo(() => {
    let result = [...submissions]

    if (statusFilter !== 'All') {
      result = result.filter((s) => s.status === statusFilter)
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (s) =>
          s.dataset_title.toLowerCase().includes(q) ||
          s.submitting_pi_custodian.toLowerCase().includes(q)
      )
    }

    result.sort((a, b) => {
      let cmp = 0
      if (sortColumn === 'dataset_title') {
        cmp = a.dataset_title.localeCompare(b.dataset_title)
      } else if (sortColumn === 'date_of_assessment') {
        cmp = a.date_of_assessment.localeCompare(b.date_of_assessment)
      } else {
        cmp = (a.cqi_lite_score ?? 0) - (b.cqi_lite_score ?? 0)
      }
      return sortDir === 'asc' ? cmp : -cmp
    })

    return result
  }, [searchQuery, statusFilter, sortColumn, sortDir, submissions])

  const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS_PER_PAGE))
  const safePage = Math.min(page, totalPages - 1)
  const paged = filtered.slice(safePage * ROWS_PER_PAGE, (safePage + 1) * ROWS_PER_PAGE)

  return (
    <PortalPageLayout user={user} onLogout={handleLogout} showFooter={false}>
      <section className="w-full max-w-6xl mx-auto !px-4 sm:!px-8 !py-5 flex-1 flex flex-col min-h-0 h-[calc(100vh-72px)] overflow-hidden">
        <div className="mb-4 shrink-0">
          <h1 className="text-[24px] font-black text-brand-navy font-serif">My Assessments</h1>
          <p className="text-xs text-brand-slate font-semibold mt-0.5">
            Review and track your submitted dataset assessments.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 shrink-0">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-slate pointer-events-none" />
            <input
              type="text"
              placeholder="Search by title or PI..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setPage(0) }}
              className="w-full pl-9 pr-4 py-2 text-sm text-brand-navy bg-white border border-brand-border rounded-[14px] placeholder:text-brand-slate/50 focus:outline-none focus:border-brand-blue/42 focus:ring-[3px] focus:ring-brand-blue/12 transition-all"
            />
          </div>

          <div className="flex flex-wrap gap-1.5">
            {STATUS_OPTIONS.map((opt) => (
              <button
                key={opt.label}
                onClick={() => { setStatusFilter(opt.value); setPage(0) }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer ${
                  statusFilter === opt.value
                    ? 'bg-brand-blue text-white shadow-sm'
                    : 'bg-white text-brand-slate border border-brand-border hover:border-brand-slate hover:text-brand-navy'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-md border border-brand-border rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.015)] flex flex-col min-h-0 flex-1 overflow-hidden">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center flex-1 text-brand-slate">
              <Loader2 className="w-8 h-8 animate-spin text-brand-blue mb-3" />
              <p className="text-sm font-semibold">Loading assessments...</p>
            </div>
          ) : fetchError ? (
            <div className="flex flex-col items-center justify-center flex-1 text-brand-slate">
              <p className="text-sm font-semibold text-rose-600 mb-2">Failed to load assessments</p>
              <p className="text-xs text-brand-slate">{fetchError}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-3 px-4 py-1.5 text-xs font-semibold text-brand-blue border border-brand-blue rounded-full hover:bg-brand-blue/5 transition-all cursor-pointer"
              >
                Retry
              </button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center flex-1 text-brand-slate">
              <Search className="w-10 h-10 mb-3 opacity-30" />
              <p className="text-sm font-semibold">
                {submissions.length === 0 ? 'No assessments submitted yet.' : 'No submissions match your search.'}
              </p>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto min-h-0">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-brand-border/60">
                      <th className="sticky top-0 bg-white z-10 text-left text-xs font-semibold uppercase tracking-wider text-brand-slate px-6 py-3 w-12">
                        S.No
                      </th>
                      <th className="sticky top-0 bg-white z-10 text-left px-4 py-3">
                        <SortHeader column="dataset_title" current={sortColumn} direction={sortDir} label="Dataset Title" onSort={handleSort} />
                      </th>
                      <th className="sticky top-0 bg-white z-10 text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-brand-slate">
                        PI / Custodian
                      </th>
                      <th className="sticky top-0 bg-white z-10 text-left px-4 py-3">
                        <SortHeader column="date_of_assessment" current={sortColumn} direction={sortDir} label="Submitted Date" onSort={handleSort} />
                      </th>
                      <th className="sticky top-0 bg-white z-10 text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-brand-slate">
                        Status
                      </th>
                      <th className="sticky top-0 bg-white z-10 text-left px-4 py-3">
                        <SortHeader column="cqi_lite_score" current={sortColumn} direction={sortDir} label="Quality Score" onSort={handleSort} />
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paged.map((sub, idx) => (
                      <tr
                        key={sub.id}
                        onClick={() => router.push(`/assessments/${sub.id}`)}
                        className="border-b border-brand-border/30 last:border-b-0 hover:bg-brand-blue/5 transition-colors cursor-pointer"
                      >
                        <td className="px-6 py-3 text-sm text-brand-slate font-medium">
                          {safePage * ROWS_PER_PAGE + idx + 1}
                        </td>
                        <td className="px-4 py-3 text-sm font-bold text-brand-navy">
                          <Link href={`/assessments/${sub.id}`} className="hover:underline hover:text-brand-blue">
                            {sub.dataset_title}
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-sm text-brand-navy">
                          {sub.submitting_pi_custodian}
                        </td>
                        <td className="px-4 py-3 text-sm text-brand-slate whitespace-nowrap">
                          {sub.date_of_assessment ? new Date(sub.date_of_assessment).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          }) : '—'}
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge status={sub.status} />
                        </td>
                        <td className="px-4 py-3">
                          {sub.cqi_lite_score !== null ? (
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-brand-navy">
                                {sub.cqi_lite_score.toFixed(1)}
                              </span>
                              <span className="text-[10px] font-extrabold uppercase tracking-wide text-brand-slate">
                                {sub.cqi_lite_grade}
                              </span>
                            </div>
                          ) : (
                            <span className="text-sm text-brand-slate italic">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className="shrink-0 flex items-center justify-between px-6 py-3 border-t border-brand-border/60">
                  <span className="text-xs font-semibold text-brand-slate">
                    Showing {safePage * ROWS_PER_PAGE + 1}–{Math.min((safePage + 1) * ROWS_PER_PAGE, filtered.length)} of {filtered.length}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setPage((p) => Math.max(0, p - 1))}
                      disabled={safePage === 0}
                      className="p-1.5 rounded-full text-brand-slate hover:text-brand-navy hover:bg-brand-bg-start disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => (
                      <button
                        key={i}
                        onClick={() => setPage(i)}
                        className={`w-7 h-7 text-xs font-bold rounded-full transition-all cursor-pointer ${
                          i === safePage
                            ? 'bg-brand-blue text-white'
                            : 'text-brand-slate hover:text-brand-navy hover:bg-brand-bg-start'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                      disabled={safePage === totalPages - 1}
                      className="p-1.5 rounded-full text-brand-slate hover:text-brand-navy hover:bg-brand-bg-start disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </PortalPageLayout>
  )
}
