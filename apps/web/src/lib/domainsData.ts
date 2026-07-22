export interface DomainDetail {
  id: number;
  title: string;
  descriptions: { [key: number]: string };
}

export const domainsData: DomainDetail[] = [
  {
    id: 1,
    title: "What level of review process ensures annotation reliability?",
    descriptions: {
      0: "Data were entered by a single person without supervision or checking. No evidence that labels, diagnoses, or responses were reviewed for correctness.",
      1: "Occasional or informal checking by another person, but no written record of who checked or what was corrected.",
      2: "Two people have reviewed at least some records, discussed differences informally, but without recording results.",
      3: "Most records reviewed independently by two trained persons; disagreements settled by a senior reviewer. Records of corrections exist.",
      4: "A well-defined double-review system used for all data. Agreement consistently high (>80%). Correction logs and reviewer names recorded."
    }
  },
  {
    id: 2,
    title: "How complete and standardized is the dataset metadata?",
    descriptions: {
      0: "Only a file name or title; no information about creator, location, or date.",
      1: "Basic details such as project title, collection site, or month are present but not standardized. Contact person unknown.",
      2: "Dataset includes structured description (who, what, when, where). A contact person or institutional email is listed.",
      3: "Metadata include keywords, version number, and institutional identifiers (ORCID, grant, or project code).",
      4: "Full metadata available with DOI or handle, funding information, and cross-reference to related outputs. Machine-readable metadata (e.g., JSON/XML) exist for indexing or repository upload."
    }
  },
  {
    id: 3,
    title: "How thoroughly is the dataset documented for external reuse?",
    descriptions: {
      0: "No documentation. Only data files exist. External users would not understand columns or measurement units.",
      1: "A short note or document explains variables but lacks collection methods, consent, or cleaning steps.",
      2: "Variable definitions, measurement methods, and consent statements included. Users can read and interpret values correctly.",
      3: "Clear SOPs or manuals, change logs, and limitation notes are attached. Users can replicate data processing confidently.",
      4: "Complete guide with examples, diagrams, and data-use policy publicly accessible. Allows immediate understanding and reuse by external researchers."
    }
  },
  {
    id: 4,
    title: "How well does the dataset represent the target population with documented evidence?",
    descriptions: {
      0: "Source population unclear. Data may come from a small convenience sample or single location.",
      1: "Contains demographic fields (age, sex, location) but from one facility or group. Limited diversity and external validity.",
      2: "Includes records from multiple sites or regions, covering varied demographics but no balance or gap analysis performed.",
      3: "Dataset includes a summary table comparing actual vs target enrolment for age, sex, or geography; imbalances documented.",
      4: "Representativeness periodically reviewed (e.g., quarterly). Under-represented groups flagged and corrections attempted. Provides evidence of true diversity."
    }
  },
  {
    id: 5,
    title: "To what extent does the dataset conform to recognized standards and validators?",
    descriptions: {
      0: "Raw spreadsheets or text files with inconsistent headers; frequent manual errors. Not machine-readable.",
      1: "Partial structure; column names partially standardized but inconsistent across sheets or sites.",
      2: "Mapped to recognized structure/standard (e.g., ABDM, FHIR, DICOM, WHO templates) with some missing elements.",
      3: "All essential fields filled; logical consistency verified (e.g., no impossible ages). Fit for database import or analysis.",
      4: "Dataset passes automatic validator or schema checks. Can move between systems without error or data loss."
    }
  },
  {
    id: 6,
    title: "How ready is the dataset for reliable AI/analytics use with documented validation?",
    descriptions: {
      0: "Data raw, uncleaned, and may include duplicates or outliers. Unsuitable for modelling or statistics.",
      1: "Cleaned but not documented; same individuals may appear twice. Splitting for training/testing unclear.",
      2: "Clear record IDs, duplicates removed, training/test or analysis subsets defined. Reliable for basic model training.",
      3: "Benchmark dataset created; fairness checks across key subgroups performed. Basic drift review done.",
      4: "Dataset re-audited periodically by an external reviewer; stability and reproducibility confirmed. Ready for long-term AI evaluation."
    }
  },
  {
    id: 7,
    title: "What level of anonymization and re-identification risk assessment has been performed?",
    descriptions: {
      0: "Direct identifiers—such as names, mobile numbers, Aadhaar, or GPS coordinates—remain visible. No anonymization steps have been documented. Privacy not protected.",
      1: "Obvious identifiers were removed, but there is no formal review of residual risk. Rare combinations of fields could still reveal individuals.",
      2: "Explicit anonymization performed following internal SOPs. Potentially identifying variables were generalized or masked. A qualitative note estimates remaining risk.",
      3: "Independent reviewer confirmed anonymization quality using the PRS-Lite calculator. Privacy risk numerically recorded and archived. No visible traces of identity remain.",
      4: "Formal re-identification simulation conducted on sample records. Success probability below one percent. Statistical disclosure control verified. Dataset certified low-risk for identity disclosure."
    }
  },
  {
    id: 8,
    title: "How comprehensive are the security governance controls and audit mechanisms?",
    descriptions: {
      0: "Data stored on personal drives or external devices without encryption. Multiple unauthorized copies exist. No record of who accessed or modified files.",
      1: "Password protection or folder permissions/access privileges applied but never reviewed. No backups tested. Security depends on individual users rather than institutional oversight.",
      2: "List of authorized users maintained; passwords and access reviewed periodically. Routine backups stored securely. Dataset meets minimal organizational security. Documentation exists but enforcement inconsistent.",
      3: "Written data-security policy implemented. Backups and Access logs reviewed periodically. Role-based permissions enforced through IT system. Dataset protected by both administrative and technical controls consistent with national health-data guidelines.",
      4: "Comprehensive security governance in place: encryption at rest, detailed audit trails, breach-response playbook tested through drills. Independent security audit completed with actionable recommendations. Dataset classified, monitored, and resilient against internal or external compromise."
    }
  },
  {
    id: 9,
    title: "How completely can the dataset processing pipeline be reproduced and verified?",
    descriptions: {
      0: "No information on how the dataset was assembled or cleaned. Raw and final versions indistinguishable. Future users cannot reconstruct processing steps.",
      1: "General description exists—such as 'data cleaned in Excel'—but lacks detailed steps, version numbers, or responsible personnel. Transformation history incomplete.",
      2: "Processing steps described in a written SOP or analytical script. Each stage—import, cleaning, merging—documented. Versions are manually tracked.",
      3: "All scripts, software versions, and dependencies archived together. Processing reproducible end-to-end using container or workflow system. Each update creates a new version.",
      4: "Independent rerun using provided package and reproduced identical results. Dataset has complete provenance chain and qualifies as fully reproducible scientific asset."
    }
  },
  {
    id: 10,
    title: "How thoroughly are ethical impacts assessed and community accountability demonstrated?",
    descriptions: {
      0: "Dataset lacks any ethics-committee approval or documented consent. Its use may violate participant rights. Release or analysis prohibited until compliance verified.",
      1: "Formal ethics or administrative clearance available, but participants were not informed about data reuse or potential risks. Ethical compliance minimal",
      2: "Participants or community representatives informed about intended data uses and privacy measures. A contact person for complaints or withdrawal requests designated.",
      3: "Dataset reviewed for equity, gender, and vulnerable-group impact. Steps taken to prevent misuse or bias. Grievance and redress records maintained.",
      4: "Public report or community feedback summary released. Ethical outcomes reviewed annually."
    }
  },
  {
    id: 11,
    title: "How rigorously has synthetic data fidelity and privacy been independently validated?",
    descriptions: {
      0: "No information provided, OR data labelled 'synthetic' without supporting explanation.",
      1: "Synthetic dataset compared to real data using simple summaries (mean, SD, frequencies) but utility or privacy not verified.",
      2: "Statistical and analytic behaviors of synthetic and real data match within acceptable range. Basic similarity analysis done.",
      3: "Both utility and privacy tests performed. Memorization risk ≤5%. Synthetic dataset reproduces key relationships without containing identifiable individuals.",
      4: "Multiple independent privacy and fidelity audits show <1% re-identification potential. Synthetic generator documented; random seed archived. Dataset formally certified privacy-preserving"
    }
  },
  {
    id: 12,
    title: "How mature is the governance framework with independent oversight and accountability?",
    descriptions: {
      0: "No named custodian or data-protection oversight. Ownership unclear; dataset unmanaged after creation.",
      1: "Custodian identified but responsibilities undefined. Governance relies on individual rather than system. High continuity risk if personnel change.",
      2: "Data-processing register (what, why, where stored) exists. Data-protection impact assessment completed. Compliance documentation traceable.",
      3: "Governance reviewed periodically; metrics such as access requests and incident logs tracked.",
      4: "Independent audit evaluated governance framework; deficiencies corrected. Public statement or report shared. Dataset demonstrates accountability with data-protection law."
    }
  },
  {
    id: 13,
    title: "Can you verify the exact dataset version and integrity used for every model build and deployment?",
    descriptions: {
      0: "AI or statistical models derived from this dataset lack any trace of which data version was used. Replication impossible.",
      1: "Approximate link noted informally in documentation but not verifiable. Potential mismatch between data and model versions.",
      2: "File-version mapping table maintained showing which data builds each model. Traceability achievable but not automated.",
      3: "Dataset and model both digitally fingerprinted (hash/ checksum). Link confirmed programmatically before release. Prevents accidental mismatch.",
      4: "Automated verification of dataset hash before every model training or deployment. Chain-of-custody complete. Ensures scientific and regulatory integrity for downstream use."
    }
  },
  {
    id: 14,
    title: "Are computational resource consumption and carbon impact tracked, audited, and aligned with sustainability benchmarks?",
    descriptions: {
      0: "No awareness or record of energy consumption or storage load. Computational cost ignored entirely.",
      1: "General acknowledgement of resource use but no quantitative tracking. No optimization or recycling actions documented.",
      2: "Approximate compute hours, storage space, or carbon estimate recorded for key processes. Encourages mindful management though goals not formalized.",
      3: "Reduction targets set (for compute, duplication, retention). Actions such as data archiving or hardware consolidation logged and reviewed.",
      4: "Independent or internal sustainability audit conducted; results publicly shared. Dataset operations meet institutional 'green computing' or ISO-aligned benchmarks."
    }
  },
  {
    id: 15,
    title: "Does the dataset have automated freshness monitoring and a standing governance process for continuous improvement?",
    descriptions: {
      0: "Dataset frozen after initial creation; no mechanism for update or user correction. Quickly becomes outdated or inconsistent with field reality.",
      1: "Updates occur irregularly when staff remember or users complain. No written schedule; changes undocumented.",
      2: "Formal release cycle (monthly, quarterly, annually) defined. Issue log records problems and resolutions. Demonstrates active curation mindset.",
      3: "Update adherence exceeds 90% of schedule. User queries or corrections acknowledged within defined timeframe. Dataset remains timely and credible.",
      4: "Automated freshness monitoring and change tracking integrated. Standing advisory committee reviews metrics and user feedback each cycle. Dataset exhibits living, self-correcting governance model."
    }
  }
];
