import { useState } from 'react';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';
import type { DomainAnswer } from '@/lib/cqiEngine';
import { nodalQuestions } from '@/lib/nodalQuestions';

interface NodalReviewFormProps {
  submission: any; // Replace 'any' with the actual type of DatasetSubmission if available
  custodianAnswers: any;
  custodianIdentificationRisk: number;
  custodianSensitivityMultiplier: number;
  domain11Na: boolean;
  onReviewComplete: (updated: any) => void;
}

const riskOptions = [50, 30, 15, 5, 0];
const multiplierOptions = [1.0, 1.5, 2.0];

type NodalReviewAnswer = Omit<DomainAnswer, 'score'> & {
  score?: number;
  needsRevision: boolean;
  reviewComment: string;
};

export function NodalReviewForm({
  submission,
  custodianAnswers,
  custodianIdentificationRisk,
  custodianSensitivityMultiplier,
  domain11Na,
  onReviewComplete,
}: NodalReviewFormProps) {
  const [verifiedAnswers, setVerifiedAnswers] =
useState<Record<number, NodalReviewAnswer>>(() => {
  const initial: Record<number, NodalReviewAnswer> = {};

  Object.keys(custodianAnswers).forEach((id) => {
    initial[Number(id)] = {
      score: undefined, // ❗ IMPORTANT: no default selection
      factual_description: '',
      needsRevision: false,
      reviewComment: '',
    } as NodalReviewAnswer;
  });

  return initial;
});

  const setDomainScore = (id: number, score: number) => {
    setVerifiedAnswers((prev) => ({
      ...prev,
      [id]: { ...prev[id], score },
    }));
  };

  const toggleNeedsRevision = (
    id: number,
    checked: boolean
  ) => {
    setVerifiedAnswers((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        needsRevision: checked,
      },
    }));
  };

  const setReviewComment = (
    id: number,
    value: string
  ) => {
    setVerifiedAnswers((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        reviewComment: value,
      },
    }));
  };

  const setDecision = (id: number, decision: 'approved' | 'revision') => {
    setVerifiedAnswers((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        decision,
      },
    }));
  };

  const setJustification = (id: number, value: string) => {
    setVerifiedAnswers((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        justification: value,
      },
    }));
  };

  const setRevisionComment = (id: number, value: string) => {
    setVerifiedAnswers((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        revisionComment: value,
      },
    }));
  };

  const allDomainsScored = nodalQuestions.every((q) => {
  if (domain11Na && q.id === 11) return true;

  const score = verifiedAnswers[q.id]?.score;

  return score !== undefined && score !== null;
});

  const handleSubmit = () => {
  onReviewComplete({
    ...submission,
    technicalReview: verifiedAnswers,
  });
};

  return (
    <div className="w-full flex flex-col select-none animate-fadeIn">
      <div className="flex items-center gap-3.5 mb-8 pb-6 border-b border-brand-border/60">
        <div className="w-12 h-12 rounded-xl bg-brand-blue/10 flex items-center justify-center text-brand-blue shrink-0">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div className="flex flex-col">
          <h2 className="text-xl font-extrabold text-brand-navy tracking-tight">
            Nodal Technical Review
          </h2>
          <span className="text-xs font-semibold text-brand-slate mt-0.5">
            Score each domain against the custodian's submitted evidence.
          </span>
        </div>
      </div>

      <div className="space-y-6">
        {nodalQuestions.map((q) => {
          console.log("Question", q);
          const isNa = domain11Na && q.id === 11;
          if (isNa) return null;
          console.log("Question:", q);
          console.log("Scores:", q.scores);

          const custodianScore = custodianAnswers[q.id]?.score;
          const verifiedScore = verifiedAnswers[q.id]?.score;

          return (
            <div
              key={q.id}
              className="bg-brand-bg-start/20 border border-brand-border rounded-[24px] p-5 space-y-4"
            >
              <div className="flex justify-between items-start gap-4">
                <div>
                  <span className="text-[10px] font-bold text-brand-blue uppercase tracking-wider">
                    Domain {q.id} — {q.domain}
                  </span>
                  <p className="text-sm font-bold text-brand-navy mt-1">{q.question}</p>
                </div>
                <span className="text-[10px] font-bold text-brand-slate whitespace-nowrap shrink-0">
                  Custodian self-score: {custodianScore ?? 'N/A'}
                </span>
              </div>

              {custodianAnswers[q.id]?.factual_description && (
                <div className="text-xs text-brand-slate bg-white border border-brand-border rounded-xl p-3">
                  <span className="font-bold text-brand-navy block mb-1">Custodian justification:</span>
                  {custodianAnswers[q.id].factual_description}
                </div>
              )}

              <div className="space-y-4">
                {/* User Selected Answer */}
                <div className="rounded-xl border border-brand-border bg-gray-50 p-4">
                  <h4 className="text-sm font-bold text-brand-navy mb-2">
                    User Selected Answer
                  </h4>

                  <p className="text-sm text-brand-slate font-semibold">
                    Selected Option
                  </p>

                  <div className="mt-2 rounded-lg border border-brand-border bg-white p-3">
                    {custodianScore !== undefined ? (
                      <>
                        <div className="font-bold text-brand-blue mb-2">
                          Option {String.fromCharCode(65 + custodianScore)}
                        </div>

                        <div className="text-sm text-brand-slate">
                          {q.scores.find(s => s.score === custodianScore)?.description}
                        </div>
                      </>
                    ) : (
                      <span className="text-brand-slate">
                        User did not answer.
                      </span>
                    )}
                  </div>

                  {custodianAnswers[q.id]?.factual_description && (
                    <div className="mt-3 rounded-lg bg-white border border-brand-border p-3">
                      <p className="text-xs font-semibold text-brand-navy mb-1">
                        User Justification
                      </p>

                      <p className="text-sm text-brand-slate">
                        {custodianAnswers[q.id].factual_description}
                      </p>
                    </div>
                  )}
                </div>

                {/* Nodal Assessment */}
                <div className="rounded-xl border border-brand-border bg-white p-4">

                  <h4 className="text-sm font-bold text-brand-navy mb-4">
                    Technical Nodal Review
                  </h4>

                  <div className="space-y-3">

                    {q.scores.map((s) => {
                      const selected = verifiedScore !== null && verifiedAnswers[q.id]?.score === s.score;

                      return (
                        <label
                          key={s.score}
                          className={`flex items-start gap-3 rounded-xl border p-4 cursor-pointer transition-all ${
                            selected
                              ? "border-brand-blue bg-brand-blue/5"
                              : "border-brand-border hover:border-brand-blue/40"
                          }`}
                        >
                          <input
                            type="radio"
                            name={`domain-${q.id}`}
                            checked={selected}
                            onChange={() => setDomainScore(q.id, s.score)}
                            className="mt-1"
                          />

                          <div className="flex-1">

                            <div className="font-bold text-brand-blue">
                              Option {String.fromCharCode(65 + s.score)}
                            </div>

                            <div className="text-sm text-brand-slate mt-1">
                              {s.description}
                            </div>

                          </div>
                        </label>
                      );
                    })}

                  </div>

                </div>
              </div>
            </div>
          );
        })}

        

        {/* Submit — also outside the per-domain loop, rendered once */}
        <button
          type="button"
          disabled={!allDomainsScored}
          onClick={handleSubmit}
          className={`w-full py-3 rounded-full font-bold text-sm transition-all ${
            allDomainsScored
              ? 'bg-brand-blue text-white hover:opacity-90 cursor-pointer'
              : 'bg-brand-border text-brand-slate cursor-not-allowed'
          }`}
        >
          <CheckCircle2 className="w-4 h-4 inline mr-2" />
          Confirm & Finalize Score
        </button>
      </div>
    </div>
  );
}
