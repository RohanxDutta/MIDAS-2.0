'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { domainsData } from '@/lib/domainsData';
import { Loader2, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';

import { Sidebar } from '@/components/assessment/Sidebar';
import { Stepper } from '@/components/assessment/Stepper';
import { DatasetBasicsForm } from '@/components/assessment/DatasetBasicsForm';
import { QualityDomainForm } from '@/components/assessment/QualityDomainForm';
import { PrivacyCalculator } from '@/components/assessment/PrivacyCalculator';
import { DataUploadForm } from '@/components/assessment/DataUploadForm';
import { ReviewForm } from '@/components/assessment/ReviewForm';
import { SuccessView } from '@/components/assessment/SuccessView';

interface FileUpload {
  id: string;
  name: string;
  size: number;
  status: 'pending' | 'success' | 'failed';
}

export default function DashboardClient({ initialUser }: { initialUser: any }) {
  // --- AUTH STATE ---
  const [user, setUser] = useState<any>(initialUser);

  // --- LAYOUT STATE ---
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // --- FORM STATE ---
  const [step, setStep] = useState<
    'metadata' | 'domains' | 'prs' | 'upload' | 'review' | 'success'
  >('metadata');
  const [activeDomainIdx, setActiveDomainIdx] = useState(0);

  // Section A
  const [datasetTitle, setDatasetTitle] = useState('');
  const [versionDoiHandle, setVersionDoiHandle] = useState('');
  const [submittingPiCustodian, setSubmittingPiCustodian] = useState('');
  const [dateOfAssessment, setDateOfAssessment] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [assessorNameAffiliation, setAssessorNameAffiliation] = useState('');

  // Section B (Answers)
  const [answers, setAnswers] = useState<{
    [key: number]: { score: number; factual_description: string };
  }>(() => {
    const initial: any = {};
    for (let i = 1; i <= 15; i++) {
      initial[i] = { score: 0, factual_description: '' };
    }
    return initial;
  });
  const [domain11Na, setDomain11Na] = useState(false);

  // Section C (PRS-Lite)
  const [identificationRisk, setIdentificationRisk] = useState<number>(15);
  const [sensitivityMultiplier, setSensitivityMultiplier] = useState<number>(1.5);

  // Section D (Uploads)
  const [datasetType, setDatasetType] = useState<'structured' | 'unstructured'>('structured');
  const [datasetLink, setDatasetLink] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<FileUpload[]>([]);

  // Page States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [draftSaving, setDraftSaving] = useState(false);
  const [draftStatus, setDraftStatus] = useState('');
  const [submissionResult, setSubmissionResult] = useState<any>(null);
  const isFormLoaded = useRef(false);
  const isLoggingOut = useRef(false);

  // --- SUPABASE AUTH STATE LISTENER ---
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // --- RESTORE UI NAVIGATION STATE ON MOUNT (Fix #8) ---
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const persistedStep = localStorage.getItem('midas_step');
      const persistedActiveDomain = localStorage.getItem('midas_active_domain');
      if (persistedStep) {
        setStep(persistedStep as any);
      }
      if (persistedActiveDomain) {
        setActiveDomainIdx(parseInt(persistedActiveDomain, 10));
      }
    }
  }, []);

  // Save navigation states on change (Fix #8)
  useEffect(() => {
    if (step !== 'success') {
      localStorage.setItem('midas_step', step);
    }
  }, [step]);

  useEffect(() => {
    localStorage.setItem('midas_active_domain', activeDomainIdx.toString());
  }, [activeDomainIdx]);

  // --- RETRIEVE DRAFT (ON USER LOGIN) (Fix #4) ---
  useEffect(() => {
    if (user && !isFormLoaded.current) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (!session) {
          // Clear any stale cookies before redirecting to prevent loops
          supabase.auth.signOut().finally(() => {
            window.location.href = '/login';
          });
          return;
        }

        fetch('/api/v1/draft', {
          headers: { Authorization: `Bearer ${session.access_token}` },
        })
          .then((res) => {
            if (res.status === 401) {
              // Sign out immediately to clear cookies and break the loop
              supabase.auth.signOut().finally(() => {
                window.location.href = '/login?error=session_expired';
              });
              throw new Error('Unauthorized session (401)');
            }
            if (!res.ok) {
              throw new Error(`Failed to fetch draft: ${res.status}`);
            }
            return res.json();
          })
          .then((data) => {
            if (data && data.dataset_title !== undefined) {
              setDatasetTitle(data.dataset_title || '');
              setVersionDoiHandle(data.version_doi_handle || '');
              setSubmittingPiCustodian(data.submitting_pi_custodian || '');
              setDateOfAssessment(data.date_of_assessment || new Date().toISOString().split('T')[0]);
              setAssessorNameAffiliation(data.assessor_name_affiliation || '');
              setAnswers(data.answers || answers);
              setDomain11Na(data.domain_11_na || false);
              setIdentificationRisk(data.identification_risk ?? 15);
              setSensitivityMultiplier(data.sensitivity_multiplier ?? 1.5);
              setDatasetType(data.dataset_type || 'structured');
              setDatasetLink(data.dataset_link || '');
              setUploadedFiles(data.uploaded_files || []);
              isFormLoaded.current = true;
              setDraftStatus('Draft loaded from cloud');
            }
          })
          .catch((err) => {
            console.error('Error fetching draft:', err);
            setDraftStatus('Failed to load draft from cloud');
          });
      });
    }
  }, [user]);

  // --- DEBOUNCED AUTOSAVE DRAFT ---
  useEffect(() => {
    if (!user || !isFormLoaded.current) return;

    const delayDebounce = setTimeout(() => {
      setDraftSaving(true);
      setDraftStatus('Saving draft...');

      const draftPayload = {
        dataset_title: datasetTitle,
        version_doi_handle: versionDoiHandle,
        submitting_pi_custodian: submittingPiCustodian,
        date_of_assessment: dateOfAssessment,
        assessor_name_affiliation: assessorNameAffiliation,
        answers,
        domain_11_na: domain11Na,
        identification_risk: identificationRisk,
        sensitivity_multiplier: sensitivityMultiplier,
        dataset_type: datasetType,
        dataset_link: datasetLink,
        uploaded_files: uploadedFiles,
      };

      supabase.auth.getSession().then(({ data: { session } }) => {
        if (!session) return;
        fetch('/api/v1/draft', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify(draftPayload),
        })
          .then((res) => res.json())
          .then(() => {
            setDraftSaving(false);
            setDraftStatus('Draft saved automatically');
          })
          .catch((err) => {
            console.error(err);
            setDraftSaving(false);
            setDraftStatus('Failed to autosave draft');
          });
      });
    }, 2000);

    return () => clearTimeout(delayDebounce);
  }, [
    datasetTitle,
    versionDoiHandle,
    submittingPiCustodian,
    dateOfAssessment,
    assessorNameAffiliation,
    answers,
    domain11Na,
    identificationRisk,
    sensitivityMultiplier,
    datasetType,
    datasetLink,
    uploadedFiles,
    user,
  ]);

  // --- SUPABASE REALTIME FILE LISTENERS ---
  const subscribeToFileStatus = (fileId: string) => {
    const channel = supabase
      .channel(`file-status-${fileId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'assessment_files',
          filter: `id=eq.${fileId}`,
        },
        (payload) => {
          const updated = payload.new as any;
          setUploadedFiles((prev) =>
            prev.map((f) => (f.id === fileId ? { ...f, status: updated.status } : f))
          );
          if (updated.status !== 'pending') {
            supabase.removeChannel(channel);
          }
        }
      )
      .subscribe();
  };

  // --- LOGOUT ---
  const handleLogout = async () => {
    isLoggingOut.current = true;
    localStorage.removeItem('midas_step');
    localStorage.removeItem('midas_active_domain');
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error('Error during signOut:', err);
    } finally {
      window.location.href = '/login';
    }
  };

  // --- FILE UPLOAD FLOW ---
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !user) return;

    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      const tempId = uuid4();
      const newFileObj: FileUpload = {
        id: tempId,
        name: file.name,
        size: file.size,
        status: 'pending',
      };
      setUploadedFiles((prev) => [...prev, newFileObj]);

      try {
        const res = await fetch('/api/v1/upload-url', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            file_name: file.name,
            file_size: file.size,
          }),
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.detail || 'Failed to request upload signature.');
        }

        const { file_id, upload_url } = await res.json();

        setUploadedFiles((prev) =>
          prev.map((f) => (f.id === tempId ? { ...f, id: file_id } : f))
        );

        subscribeToFileStatus(file_id);

        const uploadRes = await fetch(upload_url, {
          method: 'PUT',
          headers: {
            'Content-Type': 'text/csv',
          },
          body: file,
        });

        if (!uploadRes.ok) {
          throw new Error('Storage file upload failed.');
        }
      } catch (err: any) {
        console.error('Upload error:', err);
        setUploadedFiles((prev) =>
          prev.map((f) => (f.id === tempId ? { ...f, status: 'failed' } : f))
        );
      }
    }
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  // --- FINAL FORM SUBMISSION ---
  const handleSubmitForm = async () => {
    if (!user) return;
    setIsSubmitting(true);

    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) return;

    const answersList = Object.entries(answers).map(([id, val]) => ({
      domain_id: parseInt(id),
      score: val.score,
      factual_description: val.factual_description,
    }));

    const submitPayload = {
      dataset_title: datasetTitle,
      version_doi_handle: versionDoiHandle,
      submitting_pi_custodian: submittingPiCustodian,
      date_of_assessment: dateOfAssessment,
      assessor_name_affiliation: assessorNameAffiliation,
      answers: answersList,
      domain_11_na: domain11Na,
      identification_risk: identificationRisk,
      sensitivity_multiplier: sensitivityMultiplier,
      dataset_type: datasetType,
      dataset_link: datasetType === 'unstructured' ? datasetLink : null,
      uploaded_file_ids:
        datasetType === 'structured'
          ? uploadedFiles.filter((f) => f.status === 'success').map((f) => f.id)
          : [],
    };

    try {
      const res = await fetch('/api/v1/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(submitPayload),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || 'Failed to submit form.');
      }

      const data = await res.json();
      // Clear navigation state (Fix #8)
      localStorage.removeItem('midas_step');
      localStorage.removeItem('midas_active_domain');
      setSubmissionResult(data);
      setStep('success');
    } catch (err: any) {
      alert(`Submission Error: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Utility to check if a section is completed
  const isSectionAComplete = () => {
    return (
      datasetTitle.trim() !== '' &&
      versionDoiHandle.trim() !== '' &&
      submittingPiCustodian.trim() !== '' &&
      assessorNameAffiliation.trim() !== ''
    );
  };

  const isDomainAnswered = (id: number) => {
    if (domain11Na && id === 11) return true;
    return answers[id]?.factual_description.trim() !== '';
  };

  const isAllDomainsComplete = () => {
    for (let i = 1; i <= 15; i++) {
      if (!isDomainAnswered(i)) return false;
    }
    return true;
  };

  const isSectionDComplete = () => {
    if (datasetType === 'unstructured') {
      return datasetLink.trim() !== '';
    }
    return uploadedFiles.length > 0 && uploadedFiles.some((f) => f.status === 'success');
  };

  // Manual trigger save draft
  const handleSaveDraftClick = async () => {
    if (!user) return;
    setDraftSaving(true);
    setDraftStatus('Saving draft...');

    const draftPayload = {
      dataset_title: datasetTitle,
      version_doi_handle: versionDoiHandle,
      submitting_pi_custodian: submittingPiCustodian,
      date_of_assessment: dateOfAssessment,
      assessor_name_affiliation: assessorNameAffiliation,
      answers,
      domain_11_na: domain11Na,
      identification_risk: identificationRisk,
      sensitivity_multiplier: sensitivityMultiplier,
      dataset_type: datasetType,
      dataset_link: datasetLink,
      uploaded_files: uploadedFiles,
    };

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return;
      const res = await fetch('/api/v1/draft', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(draftPayload),
      });
      if (res.ok) {
        setDraftStatus('Draft saved successfully');
      } else {
        setDraftStatus('Failed to save draft');
      }
    } catch (err) {
      console.error(err);
      setDraftStatus('Failed to save draft');
    } finally {
      setDraftSaving(false);
    }
  };

  const handleNextClick = () => {
    if (step === 'metadata') {
      setStep('domains');
      setActiveDomainIdx(0);
    } else if (step === 'domains') {
      if (activeDomainIdx < 14) {
        setActiveDomainIdx((prev) => prev + 1);
      } else {
        setStep('prs');
      }
    } else if (step === 'prs') {
      setStep('upload');
    } else if (step === 'upload') {
      setStep('review');
    }
  };

  const handleBackClick = () => {
    if (step === 'domains') {
      if (activeDomainIdx > 0) {
        setActiveDomainIdx((prev) => prev - 1);
      } else {
        setStep('metadata');
      }
    } else if (step === 'prs') {
      setStep('domains');
      setActiveDomainIdx(14);
    } else if (step === 'upload') {
      setStep('prs');
    } else if (step === 'review') {
      setStep('upload');
    }
  };

  const handleResetForm = () => {
    // Clear navigation state (Fix #8)
    localStorage.removeItem('midas_step');
    localStorage.removeItem('midas_active_domain');
    setDatasetTitle('');
    setVersionDoiHandle('');
    setSubmittingPiCustodian('');
    setDateOfAssessment(new Date().toISOString().split('T')[0]);
    setAssessorNameAffiliation('');
    const initial: any = {};
    for (let i = 1; i <= 15; i++) {
      initial[i] = { score: 0, factual_description: '' };
    }
    setAnswers(initial);
    setDomain11Na(false);
    setIdentificationRisk(15);
    setSensitivityMultiplier(1.5);
    setUploadedFiles([]);
    setSubmissionResult(null);
    setStep('metadata');
    isFormLoaded.current = false;
    setDraftStatus('');
  };

  function uuid4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0,
        v = c == 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  // --- RENDERING ---

  // Graceful fallback if session is lost client-side (middleware already protects the route)
  if (!user) {
    if (isLoggingOut.current) return null;
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-slate-900 text-slate-100 min-h-screen">
        <Loader2 className="w-10 h-10 animate-spin text-brand-blue mb-4" />
        <p className="text-brand-slate text-sm font-semibold">Verifying session...</p>
      </div>
    );
  }

  return (
    <div className="flex bg-slate-50 h-screen w-screen overflow-hidden text-brand-navy">
      {/* SIDEBAR */}
      <Sidebar
        user={user}
        onLogout={handleLogout}
        onGoHome={handleResetForm}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
      />

      {/* MAIN CONTENT WRAPPER */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* BREATHABLE COMPACT HEADER */}
        <header className="h-20 border-b border-brand-border bg-white flex justify-between items-center px-10 shrink-0 select-none print:hidden z-30">
          <div className="flex flex-col">
            <h1 className="text-lg font-serif font-black text-brand-navy tracking-tight leading-none">
              New Assessment
            </h1>
            <span className="text-xs font-semibold text-brand-slate mt-2 leading-none">
              Submit your dataset for automated quality evaluation.
            </span>
          </div>

          {/* Draft Autosave Status Indicator */}
          <div className="flex items-center gap-3">
            {draftStatus && (
              <span className="text-xs font-bold text-brand-slate flex items-center gap-1.5 bg-brand-bg-start border border-brand-border px-3 py-1.5 rounded-full shadow-2xs">
                {draftSaving ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-brand-blue" />
                ) : (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                )}
                {draftStatus}
              </span>
            )}
          </div>
        </header>

        {/* WORKSPACE AREA (pinned header/stepper/footer, scrollable card) */}
        <div className="flex-grow px-10 py-5 flex flex-col items-center justify-between h-[calc(100vh-5rem)] overflow-hidden">
          {step === 'success' ? (
            <div className="flex-grow overflow-y-auto no-scrollbar w-full flex justify-center items-start py-4">
              <SuccessView
                datasetTitle={datasetTitle}
                versionDoiHandle={versionDoiHandle}
                submittingPiCustodian={submittingPiCustodian}
                submissionResult={submissionResult}
                onReset={handleResetForm}
              />
            </div>
          ) : (
            <div className="w-full max-w-5xl flex-grow flex flex-col justify-between overflow-hidden">
              {/* Stepper (Constant at top) */}
              <div className="shrink-0 mb-5">
                <Stepper
                  currentStep={step}
                  setStep={setStep}
                  isMetadataComplete={isSectionAComplete()}
                  isDomainsComplete={isAllDomainsComplete()}
                  isPrsComplete={true}
                  isUploadComplete={isSectionDComplete()}
                  activeDomainIdx={activeDomainIdx}
                  setActiveDomainIdx={setActiveDomainIdx}
                  isDomainAnswered={isDomainAnswered}
                  domain11Na={domain11Na}
                />
              </div>

              {/* CARD-BASED CONTENT (Scrollable Internally) */}
              <div className="flex-grow overflow-y-auto no-scrollbar bg-white border border-brand-border rounded-[24px] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.015)]">
                {step === 'metadata' && (
                  <DatasetBasicsForm
                    datasetTitle={datasetTitle}
                    setDatasetTitle={setDatasetTitle}
                    versionDoiHandle={versionDoiHandle}
                    setVersionDoiHandle={setVersionDoiHandle}
                    submittingPiCustodian={submittingPiCustodian}
                    setSubmittingPiCustodian={setSubmittingPiCustodian}
                    dateOfAssessment={dateOfAssessment}
                    setDateOfAssessment={setDateOfAssessment}
                    assessorNameAffiliation={assessorNameAffiliation}
                    setAssessorNameAffiliation={setAssessorNameAffiliation}
                  />
                )}

                {step === 'domains' && (
                  <QualityDomainForm
                    activeDomainIdx={activeDomainIdx}
                    answers={answers}
                    setAnswers={setAnswers}
                    domain11Na={domain11Na}
                    setDomain11Na={setDomain11Na}
                  />
                )}

                {step === 'prs' && (
                  <PrivacyCalculator
                    identificationRisk={identificationRisk}
                    setIdentificationRisk={setIdentificationRisk}
                    sensitivityMultiplier={sensitivityMultiplier}
                    setSensitivityMultiplier={setSensitivityMultiplier}
                  />
                )}

                {step === 'upload' && (
                  <DataUploadForm
                    datasetType={datasetType}
                    setDatasetType={setDatasetType}
                    datasetLink={datasetLink}
                    setDatasetLink={setDatasetLink}
                    uploadedFiles={uploadedFiles}
                    handleFileUpload={handleFileUpload}
                    removeFile={removeFile}
                  />
                )}

                {step === 'review' && (
                  <ReviewForm
                    datasetTitle={datasetTitle}
                    versionDoiHandle={versionDoiHandle}
                    submittingPiCustodian={submittingPiCustodian}
                    assessorNameAffiliation={assessorNameAffiliation}
                    domain11Na={domain11Na}
                    answers={answers}
                    identificationRisk={identificationRisk}
                    sensitivityMultiplier={sensitivityMultiplier}
                    datasetType={datasetType}
                    datasetLink={datasetLink}
                    uploadedFiles={uploadedFiles}
                  />
                )}
              </div>

              {/* OUTSIDE-CARD NAVIGATION FOOTER (Constant at bottom) */}
              <div className="shrink-0 mt-5 mb-1 flex justify-between items-center select-none print:hidden px-1">
                {/* Back / Cancel Button */}
                {step === 'metadata' ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (
                        confirm(
                          'Are you sure you want to cancel the assessment? Unsaved changes may be lost.'
                        )
                      ) {
                        handleResetForm();
                      }
                    }}
                    className="px-5 py-2.5 border border-brand-border hover:border-brand-slate bg-white text-brand-slate hover:text-brand-navy font-semibold text-sm rounded-xl transition-all cursor-pointer shadow-2xs"
                  >
                    Cancel
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleBackClick}
                    className="px-5 py-2.5 border border-brand-border hover:border-brand-slate bg-white text-brand-slate hover:text-brand-navy font-semibold text-sm rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-2xs"
                  >
                    <ChevronLeft className="w-4 h-4" /> Back
                  </button>
                )}

                {/* Save Draft & Action Buttons */}
                <div className="flex gap-4">
                  {step !== 'review' && (
                    <button
                      type="button"
                      onClick={handleSaveDraftClick}
                      disabled={draftSaving}
                      className="px-5 py-2.5 border border-brand-border hover:border-brand-slate bg-white text-brand-navy font-semibold text-sm rounded-xl transition-all cursor-pointer shadow-2xs disabled:opacity-50"
                    >
                      Save Draft
                    </button>
                  )}

                  {step === 'review' ? (
                    <button
                      type="button"
                      onClick={handleSubmitForm}
                      disabled={
                        isSubmitting ||
                        !isSectionAComplete() ||
                        !isAllDomainsComplete() ||
                        !isSectionDComplete()
                      }
                      className="px-6 py-2.5 bg-brand-blue hover:bg-brand-blue-hover disabled:bg-brand-bg-end disabled:text-brand-slate text-white font-semibold text-sm rounded-xl transition-all flex items-center justify-center gap-2 shadow-md shadow-brand-blue/10 cursor-pointer disabled:cursor-not-allowed disabled:shadow-none"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-white" />
                          Submitting...
                        </>
                      ) : (
                        'Confirm & Submit'
                      )}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleNextClick}
                      disabled={
                        step === 'metadata'
                          ? !isSectionAComplete()
                          : step === 'domains'
                          ? !(domainsData[activeDomainIdx].id === 11 && domain11Na) &&
                            answers[domainsData[activeDomainIdx].id].factual_description.trim() ===
                              ''
                          : step === 'upload'
                          ? !isSectionDComplete()
                          : false
                      }
                      className="px-5 py-2.5 bg-brand-blue hover:bg-brand-blue-hover disabled:bg-brand-bg-end disabled:text-brand-slate text-white font-semibold text-sm rounded-xl transition-all flex items-center justify-center gap-2 shadow-md shadow-brand-blue/10 cursor-pointer disabled:cursor-not-allowed disabled:shadow-none"
                    >
                      Next <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
