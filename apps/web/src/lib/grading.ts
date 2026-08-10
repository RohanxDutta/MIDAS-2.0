/**
 * ============================================================
 * MIDAS 2.0 GRADING ENGINE
 * ------------------------------------------------------------
 * Combines Composite Quality Index (CQI) with Privacy Risk
 * Score (PRS) to produce a Release Recommendation.
 *
 * CQI  -> quality tier (Diamond..Remediation)   [cqiEngine.ts]
 * PRS  -> privacy risk band (Low/Medium/High)   [this file]
 * Release Recommendation = f(CQI grade, PRS band)
 * ============================================================
 */

import { CQIResult } from "./cqiEngine";

// ---------- PRS ----------
// PRS = identificationRisk × sensitivityMultiplier
// identificationRisk: 0 | 5 | 15 | 30 | 50  (from PrivacyCalculator.tsx)
// sensitivityMultiplier: 1.0 | 1.5 | 2.0    (from PrivacyCalculator.tsx)
// Range: 0 - 100

export type PRSBand = "Low" | "Medium" | "High";

export interface PRSResult {
  identificationRisk: number;
  sensitivityMultiplier: number;
  prs: number; // 0-100, higher = riskier
  band: PRSBand;
  interpretation: string;
}

export function calculatePRS(
  identificationRisk: number,
  sensitivityMultiplier: number
): PRSResult {
  const prs = Number(
    Math.min(100, identificationRisk * sensitivityMultiplier).toFixed(2)
  );

  return {
    identificationRisk,
    sensitivityMultiplier,
    prs,
    ...getPRSBand(prs),
  };
}

export function getPRSBand(prs: number) {
  if (prs >= 60) {
    return {
      band: "High" as const,
      interpretation: "Significant privacy risk; restrict access",
    };
  }
  if (prs >= 30) {
    return {
      band: "Medium" as const,
      interpretation: "Moderate risk; controlled access recommended",
    };
  }
  return {
    band: "Low" as const,
    interpretation: "Minimal privacy risk",
  };
}

// ---------- Release Recommendation ----------

export type ReleaseRecommendation = "Open" | "Controlled" | "Restricted";

export function getReleaseRecommendation(
  cqiGrade: CQIResult["grade"],
  prsBand: PRSBand
): ReleaseRecommendation {
  if (cqiGrade === "Remediation") return "Restricted";
  if (prsBand === "High") return "Restricted";
  if (prsBand === "Medium") return "Controlled";
  return cqiGrade === "Bronze" ? "Controlled" : "Open";
}