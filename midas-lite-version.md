# MIDAS Lite Version

# ICMR MIDAS 2.0 Framework

Dataset Quality and Trust Framework (Lite Version)

ICMR MIDAS 2.0 Framework

(Metric-based Integrity and Data Assessment System)

Dataset Quality and Trust Framework
(Lite Version)

Version 1.0 | Draft for Expert Validation

Date: 10.30.2025

Prepared by:

Indian Council of Medical Research (ICMR)

Division of Development Research

New Delhi, India

Document Purpose

Lite Version of MIDAS 2.0 is a simplified framework for assessing dataset quality, integrity, interoperability, and privacy. It is a preliminary self-assessment of datasets by Independent Centers which may be submitted to the Nodal Centre for detailed evaluation using the Technical Version of the framework. Centers submitting the Lite framework, must maintain all supporting evidence and records for each entry to enable the Nodal Centre to verify, validate, and compute the final Composite Quality Index (CQI) and Privacy-Risk Score (PRS) during technical assessment.

Confidential Draft – For Review Only

Please do not distribute without authorization from ICMR.

## SECTION – A

### Basic information

| Dataset Title |  |
| --- | --- |
| Version / DOI / Handle |  |
| Submitting PI / Custodian |  |
| Date of Assessment |  |
| Assessor Name / Affiliation |  |

### What is MIDAS 2.0 (Lite Version)

The Lite Version of MIDAS 2.0 (Metric-based Integrity and Data Assessment System) is a self-assessment tool for evaluating dataset quality, integrity, interoperability, and privacy. It is designed for Independent Centers to provide an overview of their datasets which may be submitted for a formal validation by the Nodal Centre. This version uses simplified options and scoring ladders that reflect the main domains of the Technical Version while reducing computational complexity. It helps institutions identify strengths, gaps, and readiness for inclusion in the AI-ready dataset repository.

### How the MIDAS 2.0 scores are calculated

For a given dataset, quality is assessed across 15 domains where each domain is scored from 0 to 4, where 0 = absent and 4 = exemplary. Each domain in the technical version corresponds to a domain in the lite version, further complementing with additional clarifications. Both lite version of rubric and the additional information is provided by the data custodians.

The Composite Quality Index -Lite (CQI) is computed as:

CQI~Lite~ = (Sum of domain scores / Maximum possible score) × 100

Use the highest level where all statements are true. If any statement at that level is missing, step down one level. Attach the requested evidence. If a domain is formally marked as "If Applicable" (e.g. Domain 11), the CQI-Lite denominator becomes 14 × 4 = 56 instead of 60

The Privacy-Risk Score -Lite (PRS-Lite) is calculated separately on a scale of 0–100 (Low 0–15; Moderate 16–40; High 41–70; Very High 71–100) using the method detailed in Annexure I. PRS-Lite must be documented in the assessment record, including method, sensitivity class, and final score.

### How the scores can be Interpreted

The Composite Quality Index-Lite (CQI-Lite) determines the overall dataset quality and classified into six performance bands as follows:

| Aggregated CQI-Lite band | Grade | Interpretation |
| --- | --- | --- |
| ≥ 95 | Diamond | Global exemplar |
| 85 – 94 | Platinum | Best-practice dataset |
| 70 – 84 | Gold | High-quality dataset |
| 50 – 69 | Silver | Permissible but improvement plan must be recorded |
| 25 – 49 | Bronze | Embargo until targeted enhancements completed |
| < 25 | Remediation | Iterative QA and resubmission required |

The Privacy-Risk Score -Lite (PRS-Lite) is calculated separately on a scale of 0–100 (Low 0–15; Moderate 16–40; High 41–70; Very High 71–100) using a method detailed in Annexure I. PRS-Lite must be documented in the assessment record, including method, sensitivity class, and final score.

Both CQI-Lite × PRS-Lite matrix determines Open / Controlled / Restricted release. By policy, clinical-genomic or high-stigma data default to Controlled unless PRS-Lite is Low with strong, independently verified Differential Privacy.

### CQI-Lite × PRS-Lite Release Matrix

| PRS-Lite / CQI-Lite ↓ | ≥95 Diamond | 85–94 Platinum | 70–84 Gold | 50–69 Silver | 25-49 Bronze |
| --- | --- | --- | --- | --- | --- |
| Low (0–15) | Open | Open/Controlled | Controlled/Open | Controlled | Restricted |
| Moderate (16–40) | Open/Controlled | Controlled | Controlled | Restricted | Restricted |
| High (41–70) | Controlled | Controlled | Restricted | Restricted | Restricted |
| Very High (71–100) | Restricted | Restricted | Restricted | Restricted | Restricted |

### How to Fill this Form

Each section contains simplified questions and scoring fields aligned with the 15 MIDAS 2.0 domains. Respondents should:

- Select the most appropriate option for each domain based on available evidence.
- Provide short, factual descriptions in text fields.
- Attach or reference supporting materials (e.g., SOPs, validation logs, metadata).

Scores should reflect the current dataset state, not future plans.

Incomplete information may delay validation. Retain copies of all evidence for review by the Nodal Centre during technical assessment.

### What Happens After Submission

Once submitted, the completed Lite Version will be reviewed by the Nodal Centre. The Nodal Centre will:

- Verify and cross-check all entries and supporting evidence.
- Compute the Composite Quality Index (CQI) and Privacy-Risk Score (PRS) using the Technical Version.
- Classify the dataset into the appropriate quality and access category (Open, Controlled, or Restricted).

If clarifications or missing data are identified, the Nodal Centre will contact the respective PI or Centre. Verified datasets may then progress toward inclusion in the MIDAS repository.

## SECTION – B

### Data Quality Domains

#### 1. Annotation / Labelling Reliability

| Score | Description |
| --- | --- |
| 0 | Data were entered by a single person without supervision or checking. No evidence that labels, diagnoses, or responses were reviewed for correctness. |
| 1 | Occasional or informal checking by another person, but no written record of who checked or what was corrected. |
| 2 | Two people have reviewed at least some records, discussed differences informally, but without recording results. |
| 3 | Most records reviewed independently by two trained persons; disagreements settled by a senior reviewer. Records of corrections exist. |
| 4 | A well-defined double-review system used for all data. Agreement consistently high (>80%). Correction logs and reviewer names recorded. |

#### 2. Metadata Completeness

| Score | Description |
| --- | --- |
| 0 | Only a file name or title; no information about creator, location, or date. |
| 1 | Basic details such as project title, collection site, or month are present but not standardized. Contact person unknown. |
| 2 | Dataset includes structured description (who, what, when, where). A contact person or institutional email is listed. |
| 3 | Metadata include keywords, version number, and institutional identifiers (ORCID, grant, or project code). |
| 4 | Full metadata available with DOI or handle, funding information, and cross-reference to related outputs. Machine-readable metadata (e.g., JSON/XML) exist for indexing or repository upload. |

#### 3. Documentation & User Guidance

| Score | Description |
| --- | --- |
| 0 | No documentation. Only data files exist. External users would not understand columns or measurement units. |
| 1 | A short note or document explains variables but lacks collection methods, consent, or cleaning steps. |
| 2 | Variable definitions, measurement methods, and consent statements included. Users can read and interpret values correctly. |
| 3 | Clear SOPs or manuals, change logs, and limitation notes are attached. Users can replicate data processing confidently. |
| 4 | Complete guide with examples, diagrams, and data-use policy publicly accessible. Allows immediate understanding and reuse by external researchers. |

#### 4. Population Representativeness

| Score | Description |
| --- | --- |
| 0 | Source population unclear. Data may come from a small convenience sample or single location. |
| 1 | Contains demographic fields (age, sex, location) but from one facility or group. Limited diversity and external validity. |
| 2 | Includes records from multiple sites or regions, covering varied demographics but no balance or gap analysis performed. |
| 3 | Dataset includes a summary table comparing actual vs target enrolment for age, sex, or geography; imbalances documented. |
| 4 | Representativeness periodically reviewed (e.g., quarterly). Under-represented groups flagged and corrections attempted. Provides evidence of true diversity. |

#### 5. Data Structure & Interoperability

| Score | Description |
| --- | --- |
| 0 | Raw spreadsheets or text files with inconsistent headers; frequent manual errors. Not machine-readable. |
| 1 | Partial structure; column names partially standardized but inconsistent across sheets or sites. |
| 2 | Mapped to recognized structure/standard (e.g., ABDM, FHIR, DICOM, WHO templates) with some missing elements. |
| 3 | All essential fields filled; logical consistency verified (e.g., no impossible ages). Fit for database import or analysis. |
| 4 | Dataset passes automatic validator or schema checks. Can move between systems without error or data loss. |

#### 6. AI / Analytics Readiness

| Score | Description |
| --- | --- |
| 0 | Data raw, uncleaned, and may include duplicates or outliers. Unsuitable for modelling or statistics. |
| 1 | Cleaned but not documented; same individuals may appear twice. Splitting for training/testing unclear. |
| 2 | Clear record IDs, duplicates removed, training/test or analysis subsets defined. Reliable for basic model training. |
| 3 | Benchmark dataset created; fairness checks across key subgroups performed. Basic drift review done. |
| 4 | Dataset re-audited periodically by an external reviewer; stability and reproducibility confirmed. Ready for long-term AI evaluation. |

#### 7. Privacy & Identifiability

| Score | Description |
| --- | --- |
| 0 | Direct identifiers—such as names, mobile numbers, Aadhaar, or GPS coordinates—remain visible. No anonymization steps have been documented. Privacy not protected. |
| 1 | Obvious identifiers were removed, but there is no formal review of residual risk. Rare combinations of fields could still reveal individuals. |
| 2 | Explicit anonymization performed following internal SOPs. Potentially identifying variables were generalized or masked. A qualitative note estimates remaining risk. |
| 3 | Independent reviewer confirmed anonymization quality using the PRS-Lite calculator. Privacy risk numerically recorded and archived. No visible traces of identity remain. |
| 4 | Formal re-identification simulation conducted on sample records. Success probability below one percent. Statistical disclosure control verified. Dataset certified low-risk for identity disclosure. |

#### 8. Security & Access Governance

| Score | Description |
| --- | --- |
| 0 | Data stored on personal drives or external devices without encryption. Multiple unauthorized copies exist. No record of who accessed or modified files. |
| 1 | Password protection or folder permissions/access privileges applied but never reviewed. No backups tested. Security depends on individual users rather than institutional oversight. |
| 2 | List of authorized users maintained; passwords and access reviewed periodically. Routine backups stored securely. Dataset meets minimal organizational security. Documentation exists but enforcement inconsistent. |
| 3 | Written data-security policy implemented. Backups and Access logs reviewed periodically. Role-based permissions enforced through IT system. Dataset protected by both administrative and technical controls consistent with national health-data guidelines. |
| 4 | Comprehensive security governance in place: encryption at rest, detailed audit trails, breach-response playbook tested through drills. Independent security audit completed with actionable recommendations. Dataset classified, monitored, and resilient against internal or external compromise. |

#### 9. Provenance & Workflow Transparency

| Score | Description |
| --- | --- |
| 0 | No information on how the dataset was assembled or cleaned. Raw and final versions indistinguishable. Future users cannot reconstruct processing steps. |
| 1 | General description exists—such as "data cleaned in Excel"—but lacks detailed steps, version numbers, or responsible personnel. Transformation history incomplete. |
| 2 | Processing steps described in a written SOP or analytical script. Each stage—import, cleaning, merging—documented. Versions are manually tracked. |
| 3 | All scripts, software versions, and dependencies archived together. Processing reproducible end-to-end using container or workflow system. Each update creates a new version. |
| 4 | Independent rerun using provided package and reproduced identical results. Dataset has complete provenance chain and qualifies as fully reproducible scientific asset. |

#### 10. Ethical & Social Accountability

| Score | Description |
| --- | --- |
| 0 | Dataset lacks any ethics-committee approval or documented consent. Its use may violate participant rights. Release or analysis prohibited until compliance verified. |
| 1 | Formal ethics or administrative clearance available, but participants were not informed about data reuse or potential risks. Ethical compliance minimal |
| 2 | Participants or community representatives informed about intended data uses and privacy measures. A contact person for complaints or withdrawal requests designated. |
| 3 | Dataset reviewed for equity, gender, and vulnerable-group impact. Steps taken to prevent misuse or bias. Grievance and redress records maintained. |
| 4 | Public report or community feedback summary released. Ethical outcomes reviewed annually. |

#### 11. Synthetic / Simulated Data (if applicable)

| Score | Description |
| --- | --- |
| 0 | No information provided, OR data labelled 'synthetic' without supporting explanation. |
| 1 | Synthetic dataset compared to real data using simple summaries (mean, SD, frequencies) but utility or privacy not verified. |
| 2 | Statistical and analytic behaviors of synthetic and real data match within acceptable range. Basic similarity analysis done. |
| 3 | Both utility and privacy tests performed. Memorization risk ≤5%. Synthetic dataset reproduces key relationships without containing identifiable individuals. |
| 4 | Multiple independent privacy and fidelity audits show <1% re-identification potential. Synthetic generator documented; random seed archived. Dataset formally certified privacy-preserving |

#### 12. Stewardship & Governance

| Score | Description |
| --- | --- |
| 0 | No named custodian or data-protection oversight. Ownership unclear; dataset unmanaged after creation. |
| 1 | Custodian identified but responsibilities undefined. Governance relies on individual rather than system. High continuity risk if personnel change. |
| 2 | Data-processing register (what, why, where stored) exists. Data-protection impact assessment completed. Compliance documentation traceable. |
| 3 | Governance reviewed periodically; metrics such as access requests and incident logs tracked. |
| 4 | Independent audit evaluated governance framework; deficiencies corrected. Public statement or report shared. Dataset demonstrates accountability with data-protection law. |

#### 13. Model Linkage Integrity

| Score | Description |
| --- | --- |
| 0 | AI or statistical models derived from this dataset lack any trace of which data version was used. Replication impossible. |
| 1 | Approximate link noted informally in documentation but not verifiable. Potential mismatch between data and model versions. |
| 2 | File-version mapping table maintained showing which data builds each model. Traceability achievable but not automated. |
| 3 | Dataset and model both digitally fingerprinted (hash/ checksum). Link confirmed programmatically before release. Prevents accidental mismatch. |
| 4 | Automated verification of dataset hash before every model training or deployment. Chain-of-custody complete. Ensures scientific and regulatory integrity for downstream use. |

#### 14. Environmental Sustainability

| Score | Description |
| --- | --- |
| 0 | No awareness or record of energy consumption or storage load. Computational cost ignored entirely. |
| 1 | General acknowledgement of resource use but no quantitative tracking. No optimization or recycling actions documented. |
| 2 | Approximate compute hours, storage space, or carbon estimate recorded for key processes. Encourages mindful management though goals not formalized. |
| 3 | Reduction targets set (for compute, duplication, retention). Actions such as data archiving or hardware consolidation logged and reviewed. |
| 4 | Independent or internal sustainability audit conducted; results publicly shared. Dataset operations meet institutional "green computing" or ISO-aligned benchmarks. |

#### 15. Continuous Curation & Feedback

| Score | Description |
| --- | --- |
| 0 | Dataset frozen after initial creation; no mechanism for update or user correction. Quickly becomes outdated or inconsistent with field reality. |
| 1 | Updates occur irregularly when staff remember or users complain. No written schedule; changes undocumented. |
| 2 | Formal release cycle (monthly, quarterly, annually) defined. Issue log records problems and resolutions. Demonstrates active curation mindset. |
| 3 | Update adherence exceeds 90% of schedule. User queries or corrections acknowledged within defined timeframe. Dataset remains timely and credible. |
| 4 | Automated freshness monitoring and change tracking integrated. Standing advisory committee reviews metrics and user feedback each cycle. Dataset exhibits living, self-correcting governance model. |

## SECTION – C

### Annexure - I

#### PRS-Lite (Privacy-Risk Score for Collected Data)

(Two questions; score 0–100 → Low / Moderate / High / Very High)

**Step 1 – Identification Risk (0–50)**

- 50 – Names, phone numbers, IDs, GPS or full DOB still visible; easily traceable individuals.
- 30 – Identifiers removed but unique event combinations could reveal identity (rare disease + village + date).
- 15 – Only coarse info (age, sex, district, month); re-identification hard but not impossible.
- 5 – Generalized categories (age bands, state, quarter); identities effectively hidden.
- 0 – Only aggregated counts; no individual rows.

**Step 2 – Sensitivity / Harm Multiplier**

- 1.0 – Routine / Low Harm – Non-stigmatizing, routine data like vitals or service utilization.
- 1.5 – High Stigma / Personal Impact – TB, HIV, reproductive, mental-health, genomic, caste/tribe, violence, or undocumented status.
- 2.0 – Critical / Safety-Sensitive – Forensic, detainee, conflict, tribal GPS, refugee, or protest-related health records.

**Step 3 – Compute PRS-Lite**

PRS = round(Identification Risk × Multiplier) (capped at 100)

**Step 4 – Risk Band**

| PRS | Band | Interpretation |
| --- | --- | --- |
| 0–15 | Low | Minimal re-identification or harm risk. |
| 16–40 | Moderate | Manageable risk; requires controlled sharing. |
| 41–70 | High | Substantial privacy concern; restrict use. |
| 71–100 | Very High | Serious risk; share only aggregated results. |

---

&copy; 2025 Indian Council of Medical Research (ICMR). All rights reserved.
