export interface NodalQuestion {
  id: number;
  domain: string;
  question: string;
  scores: {
    score: number;
    description: string;
  }[];
}

export const nodalQuestions: NodalQuestion[] = [
  {
    id: 1,
    domain: "Annotation Fidelity",
    question:
      "What level of annotation fidelity (quality and reliability of labels/annotations produced by experts or trained readers) is demonstrated?",
    scores: [
      {
        score: 0,
        description:
          "No documented labeling procedure. Labels created by a single person with unknown expertise; no checks for mistakes.",
      },
      {
        score: 1,
        description:
          "Basic SOP exists but is informal; one primary annotator with occasional spot checks. No agreement statistics.",
      },
      {
        score: 2,
        description:
          "Two independent annotators for a sample; disagreements resolved informally. Agreement reported only overall without class-wise detail.",
      },
      {
        score: 3,
        description:
          "At least two independent annotators per item with adjudication by a senior reviewer. Per-class agreement reported with confidence intervals.",
      },
      {
        score: 4,
        description:
          "Multi-reader protocol with blinded reads, adjudication, documented label-error audit, κ ≥ 0.80 or Dice ≥ 0.85 with versioned changelog.",
      },
    ],
  },

  {
    id: 2,
    domain: "Metadata Completeness",
    question:
      "What level of metadata completeness (rich, machine-actionable metadata with persistent identifiers to enable discovery and reuse) is demonstrated?",
    scores: [
      {
        score: 0,
        description:
          "Minimal metadata (title only) without structured fields; no identifier.",
      },
      {
        score: 1,
        description:
          "Basic metadata fields (title, creator, date) completed; local IDs only.",
      },
      {
        score: 2,
        description:
          "Standard metadata template used with DOI/Handle; core metadata populated.",
      },
      {
        score: 3,
        description:
          "Rich metadata with DOI, ORCID, ROR, controlled vocabularies and versioning.",
      },
      {
        score: 4,
        description:
          "Machine-actionable FAIR metadata with FAIRness assessment and remediation notes.",
      },
    ],
  },

  {
    id: 3,
    domain: "Documentation Richness",
    question:
      "What level of documentation richness (clarity and depth of human-readable documentation for context, methods, and reuse) is demonstrated?",
    scores: [
      {
        score: 0,
        description:
          "No public documentation beyond a short description.",
      },
      {
        score: 1,
        description:
          "README available but lacks methodology; license unclear.",
      },
      {
        score: 2,
        description:
          "Complete README/Data Card with collection methodology and explicit license.",
      },
      {
        score: 3,
        description:
          "SOPs, changelog, limitations and validation documentation available.",
      },
      {
        score: 4,
        description:
          "Comprehensive manual with examples, machine-readable reuse terms and transparency documentation.",
      },
    ],
  },

  {
    id: 4,
    domain: "Population Representativeness",
    question:
      "What level of population representativeness is demonstrated?",
    scores: [
      { score: 0, description: "Unknown sampling frame; no demographic information." },
      { score: 1, description: "Limited demographics; single-site or convenience sampling." },
      { score: 2, description: "Multi-site sampling; imbalance documented qualitatively." },
      { score: 3, description: "Representative targets defined and residual imbalance quantified." },
      { score: 4, description: "Continuous monitoring with corrective rebalancing and drift alerts." },
    ],
  },

  {
    id: 5,
    domain: "Interoperability & Standards Conformance",
    question:
      "What level of interoperability & standards conformance is demonstrated?",
    scores: [
      { score: 0, description: "No schema or standard mapping." },
      { score: 1, description: "Partial mapping to a known healthcare standard." },
      { score: 2, description: "FHIR/DICOM/OMOP/ABDM mapping with validation but remaining errors." },
      { score: 3, description: "Validated conformance with zero critical errors and quality checks." },
      { score: 4, description: "Automated multi-standard validation with export/import verification." },
    ],
  },

  {
    id: 6,
    domain: "AI-Readiness & Drift Monitoring",
    question:
      "What level of AI-readiness & drift monitoring is demonstrated?",
    scores: [
      { score: 0, description: "Raw dataset without benchmark preparation." },
      { score: 1, description: "Basic train/test split without leakage testing." },
      { score: 2, description: "Documented splits with duplicate leakage checks." },
      { score: 3, description: "Benchmark kit with fairness metrics and drift baseline." },
      { score: 4, description: "Continuous drift monitoring with reproducible benchmark pipeline." },
    ],
  },

  {
    id: 7,
    domain: "Identifiability & Sensitivity (Privacy Risk)",
    question:
      "What level of identifiability & sensitivity (privacy risk) is demonstrated?",
    scores: [
      { score: 0, description: "No de-identification performed." },
      { score: 1, description: "Identifiers removed but privacy risk not assessed." },
      { score: 2, description: "Formal privacy risk assessment documented." },
      { score: 3, description: "Privacy risk independently verified with linkage assessment." },
      { score: 4, description: "Independent re-identification testing demonstrates <1% success." },
    ],
  },

  {
    id: 8,
    domain: "Security & Governance",
    question:
      "What level of operational security & governance is demonstrated?",
    scores: [
      { score: 0, description: "No access control or audit logging." },
      { score: 1, description: "Basic RBAC and logging enabled." },
      { score: 2, description: "Access review, backups and vulnerability management." },
      { score: 3, description: "Documented security operations and disaster recovery testing." },
      { score: 4, description: "Continuous monitoring, tamper protection and red-team validation." },
    ],
  },

  {
    id: 9,
    domain: "Provenance & Lineage",
    question:
      "What level of provenance & lineage is demonstrated?",
    scores: [
      { score: 0, description: "No provenance information available." },
      { score: 1, description: "Manual workflow documented." },
      { score: 2, description: "Scripted workflow with version control." },
      { score: 3, description: "Containerized reproducible workflow with lineage graph." },
      { score: 4, description: "Complete automated lineage and independently reproducible pipeline." },
    ],
  },

  {
    id: 10,
    domain: "Ethical & Social Accountability",
    question:
      "What level of ethical & social accountability is demonstrated?",
    scores: [
      { score: 0, description: "No ethics documentation." },
      { score: 1, description: "Ethics approval and consent documented." },
      { score: 2, description: "Stakeholder engagement and grievance process available." },
      { score: 3, description: "Equity impact assessment with tracked public redress." },
      { score: 4, description: "Periodic equity reporting and external stakeholder review." },
    ],
  },

  {
    id: 11,
    domain: "Synthetic-Data Fidelity",
    question:
      "What level of synthetic-data fidelity is demonstrated?",
    scores: [
      { score: 0, description: "No utility or privacy evaluation." },
      { score: 1, description: "Basic descriptive comparison only." },
      { score: 2, description: "Task utility and one privacy attack evaluated." },
      { score: 3, description: "Multiple utility metrics and attack success ≤5%." },
      { score: 4, description: "Comprehensive privacy testing with attack success <1%." },
    ],
  },

  {
    id: 12,
    domain: "Stewardship & Data-Protection Governance",
    question:
      "What level of stewardship & data-protection governance is demonstrated?",
    scores: [
      { score: 0, description: "No data owner or governance policy." },
      { score: 1, description: "Named data custodian and basic governance." },
      { score: 2, description: "RoPA, DPIA/PIA and DPO documented." },
      { score: 3, description: "Governance KPIs monitored with updated DPIA." },
      { score: 4, description: "Independent stewardship audit with corrective actions." },
    ],
  },

  {
    id: 13,
    domain: "Model-Linkage Integrity",
    question:
      "What level of model-linkage integrity is demonstrated?",
    scores: [
      { score: 0, description: "No linkage between dataset and models." },
      { score: 1, description: "Manual notes describing dataset usage." },
      { score: 2, description: "Dataset and model versions documented." },
      { score: 3, description: "Cryptographic manifests and semantic versioning." },
      { score: 4, description: "Signed manifests with reproducible model validation." },
    ],
  },

  {
    id: 14,
    domain: "Environmental & Sustainability",
    question:
      "What level of environmental & sustainability practices are demonstrated?",
    scores: [
      { score: 0, description: "No energy or carbon reporting." },
      { score: 1, description: "Qualitative sustainability statement." },
      { score: 2, description: "Energy and storage measurements reported." },
      { score: 3, description: "Optimization targets and improvements documented." },
      { score: 4, description: "Independent sustainability review and public reporting." },
    ],
  },

  {
    id: 15,
    domain: "Continuous Curation & Feedback",
    question:
      "What level of continuous curation & feedback (freshness) is demonstrated?",
    scores: [
      { score: 0, description: "No versioning or feedback mechanism." },
      { score: 1, description: "Occasional updates with informal issue handling." },
      { score: 2, description: "Planned releases with issue tracking." },
      { score: 3, description: "Freshness and issue resolution SLAs consistently achieved." },
      { score: 4, description: "Telemetry-backed SLA compliance with advisory review each release cycle." },
    ],
  },
];