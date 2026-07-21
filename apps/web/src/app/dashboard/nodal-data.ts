export type SubmissionStatus = 'Submitted' | 'Under Review' | 'Approved' | 'Revision Required'

export interface Submission {
  id: string
  dataset_title: string
  submitting_pi_custodian: string
  assessor_name_affiliation: string
  date_of_assessment: string
  status: SubmissionStatus
  cqi_lite_score: number | null
  cqi_lite_grade: string | null
  prs_lite_score: number | null
  prs_lite_risk_band: string | null
  release_category: string | null
  dataset_type: string
  dataset_link: string | null
  version_doi_handle: string
  created_at: string
  // Nested relations (only on detail page)
  answers?: {
    domain_id: number
    score: number
    factual_description: string
    review_status: string | null
    reviewer_remarks: string | null
  }[]
  files?: { id: string; file_name: string; storage_path: string; file_size: number; status: string }[]
}

export const STATUS_OPTIONS: { label: string; value: SubmissionStatus | 'All' }[] = [
  { label: 'All', value: 'All' },
  { label: 'Submitted', value: 'Submitted' },
  { label: 'Under Review', value: 'Under Review' },
  { label: 'Approved', value: 'Approved' },
  { label: 'Revision Required', value: 'Revision Required' },
]

/**
 * Capitalize the first letter of a status string from the DB.
 * DB stores lowercase ("submitted") → UI expects Title Case ("Submitted").
 * For multi-word statuses stored with underscores, converts to spaced title case.
 */
export function normalizeStatus(raw: string): SubmissionStatus {
  const map: Record<string, SubmissionStatus> = {
    'submitted': 'Submitted',
    'under review': 'Under Review',
    'under_review': 'Under Review',
    'approved': 'Approved',
    'revision required': 'Revision Required',
    'revision_required': 'Revision Required',
  }
  return map[raw.toLowerCase()] ?? 'Submitted'
}
