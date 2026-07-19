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
  created_at: string
}

export const STATUS_OPTIONS: { label: string; value: SubmissionStatus | 'All' }[] = [
  { label: 'All', value: 'All' },
  { label: 'Submitted', value: 'Submitted' },
  { label: 'Under Review', value: 'Under Review' },
  { label: 'Approved', value: 'Approved' },
  { label: 'Revision Required', value: 'Revision Required' },
]

export const FAKE_SUBMISSIONS: Submission[] = [
  {
    id: '1',
    dataset_title: 'Longitudinal Diabetes Cohort – Tamil Nadu',
    submitting_pi_custodian: 'Dr. A. K. Sharma',
    assessor_name_affiliation: 'Dr. Priya Mehta / Nodal Center Chennai',
    date_of_assessment: '2026-06-15',
    status: 'Approved',
    cqi_lite_score: 88.5,
    cqi_lite_grade: 'Platinum',
    prs_lite_score: 22.5,
    prs_lite_risk_band: 'Low',
    release_category: 'Open Release',
    created_at: '2026-06-15T10:30:00Z',
  },
  {
    id: '2',
    dataset_title: 'Maternal Health Registry – Assam',
    submitting_pi_custodian: 'Dr. Sunita Verma',
    assessor_name_affiliation: 'Dr. Rohan Gupta / Nodal Center Guwahati',
    date_of_assessment: '2026-06-20',
    status: 'Under Review',
    cqi_lite_score: 72.0,
    cqi_lite_grade: 'Gold',
    prs_lite_score: 45.0,
    prs_lite_risk_band: 'Moderate',
    release_category: 'Controlled Release',
    created_at: '2026-06-20T14:15:00Z',
  },
  {
    id: '3',
    dataset_title: 'National TB Surveillance – Maharashtra',
    submitting_pi_custodian: 'Dr. Rajesh Deshmukh',
    assessor_name_affiliation: 'Dr. Anjali Joshi / Nodal Center Mumbai',
    date_of_assessment: '2026-07-01',
    status: 'Submitted',
    cqi_lite_score: 65.0,
    cqi_lite_grade: 'Silver',
    prs_lite_score: 30.0,
    prs_lite_risk_band: 'Low',
    release_category: 'Controlled Release',
    created_at: '2026-07-01T09:00:00Z',
  },
  {
    id: '4',
    dataset_title: 'ICMR Cancer Atlas – North East',
    submitting_pi_custodian: 'Dr. L. K. Singh',
    assessor_name_affiliation: 'Dr. Meena Das / Nodal Center Shillong',
    date_of_assessment: '2026-05-10',
    status: 'Approved',
    cqi_lite_score: 93.0,
    cqi_lite_grade: 'Diamond',
    prs_lite_score: 15.0,
    prs_lite_risk_band: 'Low',
    release_category: 'Open Release',
    created_at: '2026-05-10T11:45:00Z',
  },
  {
    id: '5',
    dataset_title: 'Child Immunization Tracker – Rajasthan',
    submitting_pi_custodian: 'Dr. Neha Agarwal',
    assessor_name_affiliation: 'Dr. Vikram Singh / Nodal Center Jaipur',
    date_of_assessment: '2026-07-05',
    status: 'Revision Required',
    cqi_lite_score: 48.0,
    cqi_lite_grade: 'Bronze',
    prs_lite_score: 60.0,
    prs_lite_risk_band: 'Moderate',
    release_category: 'Sensitive Release',
    created_at: '2026-07-05T16:20:00Z',
  },
  {
    id: '6',
    dataset_title: 'Cardiovascular Disease Study – Andhra Pradesh',
    submitting_pi_custodian: 'Dr. K. V. Rao',
    assessor_name_affiliation: 'Dr. Sita Lakshmi / Nodal Center Vizag',
    date_of_assessment: '2026-06-28',
    status: 'Submitted',
    cqi_lite_score: 78.5,
    cqi_lite_grade: 'Gold',
    prs_lite_score: 37.5,
    prs_lite_risk_band: 'Low',
    release_category: 'Controlled Release',
    created_at: '2026-06-28T08:30:00Z',
  },
  {
    id: '7',
    dataset_title: 'Malaria Vector Surveillance – Odisha',
    submitting_pi_custodian: 'Dr. P. K. Mohapatra',
    assessor_name_affiliation: 'Dr. Arjun Patnaik / Nodal Center Bhubaneswar',
    date_of_assessment: '2026-07-12',
    status: 'Under Review',
    cqi_lite_score: 81.0,
    cqi_lite_grade: 'Platinum',
    prs_lite_score: 22.5,
    prs_lite_risk_band: 'Low',
    release_category: 'Open Release',
    created_at: '2026-07-12T13:00:00Z',
  },
  {
    id: '8',
    dataset_title: 'Mental Health Survey – Urban Karnataka',
    submitting_pi_custodian: 'Dr. Shweta Nair',
    assessor_name_affiliation: 'Dr. Harish Kumar / Nodal Center Bengaluru',
    date_of_assessment: '2026-04-22',
    status: 'Approved',
    cqi_lite_score: 91.5,
    cqi_lite_grade: 'Diamond',
    prs_lite_score: 7.5,
    prs_lite_risk_band: 'Minimal',
    release_category: 'Open Release',
    created_at: '2026-04-22T10:00:00Z',
  },
]
