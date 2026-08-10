/**
 * ============================================================
 * MIDAS 2.0 CQI ENGINE
 * ------------------------------------------------------------
 * Official Composite Quality Index (CQI) Calculation Engine
 * Used by:
 *  - Lite Assessment
 *  - Technical Assessment
 *  - Dashboard
 *  - Certificate
 * ============================================================
 */

export interface DomainAnswer {
  score: number | null;
  factual_description: string;
  evidence_file?: File | null;
}

export interface CQIResult {
  obtainedScore: number;
  maximumScore: number;
  cqi: number;

  grade:
    | "Diamond"
    | "Platinum"
    | "Gold"
    | "Silver"
    | "Bronze"
    | "Remediation";

  interpretation: string;
}

const TOTAL_DOMAINS = 15;
const SCORE_PER_DOMAIN = 4;

/**
 * ------------------------------------------------------------
 * Calculate CQI
 *
 * Formula:
 *
 * CQI =
 * ( Sum of Domain Scores / Maximum Possible Score ) × 100
 *
 * Domain 11 (Synthetic Data Fidelity)
 * is excluded if marked Not Applicable.
 * ------------------------------------------------------------
 */
export function calculateCQI(
  answers: Record<number, DomainAnswer>,
  domain11NA: boolean
): CQIResult {

  let obtainedScore = 0;

  Object.values(answers).forEach((answer) => {
  if (answer.score !== null) {
    obtainedScore += answer.score;
  }
});

  const applicableDomains = domain11NA
    ? TOTAL_DOMAINS - 1
    : TOTAL_DOMAINS;

  const maximumScore =
    applicableDomains * SCORE_PER_DOMAIN;

  const cqi = Number(
    ((obtainedScore / maximumScore) * 100).toFixed(2)
  );

  return {
    obtainedScore,
    maximumScore,
    cqi,
    ...getCQIGrade(cqi),
  };
}

/**
 * ------------------------------------------------------------
 * CQI Grade Mapping
 * ------------------------------------------------------------
 */

export function getCQIGrade(score: number) {

  if (score >= 95) {
    return {
      grade: "Diamond" as const,
      interpretation:
        "Global exemplar; candidate for reference standard",
    };
  }

  if (score >= 85) {
    return {
      grade: "Platinum" as const,
      interpretation:
        "Best-practice dataset",
    };
  }

  if (score >= 70) {
    return {
      grade: "Gold" as const,
      interpretation:
        "High-quality dataset",
    };
  }

  if (score >= 50) {
    return {
      grade: "Silver" as const,
      interpretation:
        "Permissible but improvement plan must be recorded",
    };
  }

  if (score >= 25) {
    return {
      grade: "Bronze" as const,
      interpretation:
        "Embargo until targeted enhancements completed",
    };
  }

  return {
    grade: "Remediation" as const,
    interpretation:
      "Iterative QA and resubmission required",
  };
}