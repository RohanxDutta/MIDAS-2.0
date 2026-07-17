'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { domainsData, DomainDetail } from '@/lib/domainsData';
import { 
  CheckCircle2, 
  AlertCircle, 
  Upload, 
  Link2, 
  Trash2, 
  Loader2, 
  Lock, 
  LogOut, 
  FileSpreadsheet, 
  BookOpen, 
  HelpCircle,
  FileCheck,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';

interface FileUpload {
  id: string;
  name: string;
  size: number;
  status: 'pending' | 'success' | 'failed';
}

export default function Home() {
  // --- AUTH STATE ---
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [authError, setAuthError] = useState('');

  // --- FORM STATE ---
  const [step, setStep] = useState<'welcome' | 'metadata' | 'domains' | 'prs' | 'upload' | 'review' | 'success'>('welcome');
  const [activeDomainIdx, setActiveDomainIdx] = useState(0); // 0 to 14

  // Section A
  const [datasetTitle, setDatasetTitle] = useState('');
  const [versionDoiHandle, setVersionDoiHandle] = useState('');
  const [submittingPiCustodian, setSubmittingPiCustodian] = useState('');
  const [dateOfAssessment, setDateOfAssessment] = useState(new Date().toISOString().split('T')[0]);
  const [assessorNameAffiliation, setAssessorNameAffiliation] = useState('');

  // Section B (Answers)
  const [answers, setAnswers] = useState<{ [key: number]: { score: number; factual_description: string } }>(() => {
    const initial: any = {};
    for (let i = 1; i <= 15; i++) {
      initial[i] = { score: 0, factual_description: '' };
    }
    return initial;
  });
  const [domain11Na, setDomain11Na] = useState(false);

  // Section C (PRS-Lite)
  const [identificationRisk, setIdentificationRisk] = useState<number>(15); // Default: 15
  const [sensitivityMultiplier, setSensitivityMultiplier] = useState<number>(1.5); // Default: 1.5

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

  // --- SUPABASE SESSION LISTENER ---
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // --- RETRIEVE DRAFT (ON USER LOGIN) ---
  useEffect(() => {
    if (user && !isFormLoaded.current) {
      fetch('/api/v1/draft', {
        headers: { 'Authorization': `Bearer ${user.aud}` }
      })
      .then(res => res.json())
      .then(data => {
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
      .catch(err => console.error('Error fetching draft:', err));
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
        uploaded_files: uploadedFiles
      };

      supabase.auth.getSession().then(({ data: { session } }) => {
        if (!session) return;
        fetch('/api/v1/draft', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`
          },
          body: JSON.stringify(draftPayload)
        })
        .then(res => res.json())
        .then(() => {
          setDraftSaving(false);
          setDraftStatus('Draft saved automatically');
        })
        .catch(err => {
          console.error(err);
          setDraftSaving(false);
          setDraftStatus('Failed to autosave draft');
        });
      });
    }, 2000); // 2-second debounce

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
    user
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
          filter: `id=eq.${fileId}`
        },
        (payload) => {
          const updated = payload.new as any;
          setUploadedFiles(prev =>
            prev.map(f => f.id === fileId ? { ...f, status: updated.status } : f)
          );
          // Unsubscribe once processing is complete
          if (updated.status !== 'pending') {
            supabase.removeChannel(channel);
          }
        }
      )
      .subscribe();
  };

  // --- AUTHENTICATION FLOWS ---
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);

    try {
      if (authMode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({
          email: authEmail,
          password: authPassword
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email: authEmail,
          password: authPassword
        });
        if (error) throw error;
        alert('Verification email sent! Please check your inbox.');
      }
    } catch (err: any) {
      setAuthError(err.message || 'Authentication error occurred.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setStep('welcome');
    isFormLoaded.current = false;
  };

  // --- FILE UPLOAD FLOW ---
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !user) return;

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Add temporary state
      const tempId = uuid4(); // Client placeholder URL
      const newFileObj: FileUpload = {
        id: tempId,
        name: file.name,
        size: file.size,
        status: 'pending'
      };
      setUploadedFiles(prev => [...prev, newFileObj]);

      try {
        // Step 1: Request presigned PUT URL from FastAPI backend
        const res = await fetch('/api/v1/upload-url', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`
          },
          body: JSON.stringify({
            file_name: file.name,
            file_size: file.size
          })
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.detail || 'Failed to request upload signature.');
        }

        const { file_id, upload_url } = await res.json();

        // Update list with real database ID
        setUploadedFiles(prev =>
          prev.map(f => f.id === tempId ? { ...f, id: file_id } : f)
        );

        // Subscribe to real-time status updates before triggering upload
        subscribeToFileStatus(file_id);

        // Step 2: Upload file directly to Supabase storage using the presigned URL
        const uploadRes = await fetch(upload_url, {
          method: 'PUT',
          headers: {
            'Content-Type': 'text/csv'
          },
          body: file
        });

        if (!uploadRes.ok) {
          throw new Error('Storage file upload failed.');
        }

      } catch (err: any) {
        console.error('Upload error:', err);
        setUploadedFiles(prev =>
          prev.map(f => f.id === tempId ? { ...f, status: 'failed' } : f)
        );
      }
    }
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  // --- FINAL FORM SUBMISSION ---
  const handleSubmitForm = async () => {
    if (!user) return;
    setIsSubmitting(true);

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    // Convert local answers dictionary to flat list for backend
    const answersList = Object.entries(answers).map(([id, val]) => ({
      domain_id: parseInt(id),
      score: val.score,
      factual_description: val.factual_description
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
      uploaded_file_ids: datasetType === 'structured' ? uploadedFiles.filter(f => f.status === 'success').map(f => f.id) : []
    };

    try {
      const res = await fetch('/api/v1/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify(submitPayload)
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || 'Failed to submit form.');
      }

      const data = await res.json();
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
    return datasetTitle.trim() !== '' &&
      versionDoiHandle.trim() !== '' &&
      submittingPiCustodian.trim() !== '' &&
      assessorNameAffiliation.trim() !== '';
  };

  const isDomainAnswered = (id: number) => {
    if (domain11Na && id === 11) return true;
    return answers[id].factual_description.trim() !== '';
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
    return uploadedFiles.length > 0 && uploadedFiles.some(f => f.status === 'success');
  };

  // Helper for mock client UI UUID generation
  function uuid4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  // --- RENDERING HANDLERS ---

  if (authLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-slate-950 text-slate-100 min-h-screen">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-500 mb-4" />
        <p className="text-slate-400 font-medium">Loading session...</p>
      </div>
    );
  }

  // Auth gate
  if (!user) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-slate-950 text-slate-100 min-h-screen px-6 py-12 relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="w-full max-w-md bg-slate-900/60 border border-slate-800 backdrop-blur-xl rounded-2xl p-8 shadow-2xl relative z-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              ICMR MIDAS 2.0
            </h1>
            <p className="text-slate-400 text-sm mt-2">
              Dataset Quality and Trust Framework (Lite Version)
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-6">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Email Address
              </label>
              <input
                type="email"
                required
                value={authEmail}
                onChange={e => setAuthEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 transition-colors placeholder-slate-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Password
              </label>
              <input
                type="password"
                required
                value={authPassword}
                onChange={e => setAuthPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 transition-colors placeholder-slate-600"
              />
            </div>

            {authError && (
              <div className="flex gap-2 bg-red-950/40 border border-red-900 rounded-lg p-3 text-xs text-red-400">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold py-3 rounded-lg shadow-lg shadow-indigo-500/20 transform hover:-translate-y-[1px] active:translate-y-0 transition-all flex items-center justify-center"
            >
              {authMode === 'login' ? 'Sign In' : 'Sign Up'}
            </button>
          </form>

          <div className="text-center mt-6">
            <button
              onClick={() => setAuthMode(prev => prev === 'login' ? 'signup' : 'login')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium underline"
            >
              {authMode === 'login' ? 'Create a new account' : 'Already have an account? Sign In'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main UI Form layout
  return (
    <div className="flex-1 flex flex-col bg-slate-950 text-slate-100 min-h-screen relative font-sans">
      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-slate-950/80 border-b border-slate-900 backdrop-blur-md px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <BookOpen className="w-6 h-6 text-indigo-500" />
          <div>
            <h1 className="font-bold text-lg tracking-tight text-slate-100">ICMR MIDAS 2.0</h1>
            <span className="text-xs text-slate-400 block -mt-1">Self-Assessment Tool (Lite)</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {draftStatus && (
            <span className="text-xs text-slate-500 flex items-center gap-1.5 bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
              {draftSaving ? (
                <Loader2 className="w-3 h-3 animate-spin text-indigo-400" />
              ) : (
                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
              )}
              {draftStatus}
            </span>
          )}

          <div className="text-right">
            <span className="text-xs font-semibold text-slate-300 block">{user.email}</span>
            <span className="text-[10px] text-slate-500 block">Data Custodian</span>
          </div>

          <button
            onClick={handleLogout}
            className="p-2 hover:bg-slate-900 border border-transparent hover:border-slate-800 rounded-lg transition-colors text-slate-400 hover:text-red-400"
            title="Log Out"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* CORE WORKSPACE */}
      {step === 'welcome' && (
        <div className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto px-6 py-12 text-center relative z-10">
          <div className="w-16 h-16 bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 rounded-2xl flex items-center justify-center mb-6">
            <FileSpreadsheet className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight mb-4">Start Dataset Self-Assessment</h2>
          <p className="text-slate-400 leading-relaxed mb-8">
            Assess dataset quality, integrity, and privacy risk under the ICMR MIDAS 2.0 guidelines. 
            All submissions will be evaluated by the Nodal Centre. Drafts are auto-saved to cloud cache as you type.
          </p>
          <button
            onClick={() => {
              isFormLoaded.current = true;
              setStep('metadata');
            }}
            className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg shadow-indigo-500/20 transition-all flex items-center gap-2"
          >
            Begin Assessment <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {step !== 'welcome' && step !== 'success' && (
        <div className="flex-1 flex">
          {/* LEFT SIDE NAVIGATION */}
          <aside className="w-72 border-r border-slate-900 bg-slate-950/50 p-6 space-y-6 hidden md:block shrink-0">
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-4">Form Progress</span>
              <nav className="space-y-1.5">
                {/* Section A */}
                <button
                  onClick={() => setStep('metadata')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    step === 'metadata' ? 'bg-indigo-950/40 text-indigo-400 border border-indigo-900/60' : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/50 border border-transparent'
                  }`}
                >
                  <span>Section A: Basic Info</span>
                  {isSectionAComplete() && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                </button>

                {/* Section B (15 Domains) */}
                <div className="pt-2">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2 px-3">Section B: Rubrics</span>
                  <div className="max-h-[320px] overflow-y-auto pr-1 space-y-1 scrollbar-thin">
                    {domainsData.map((d, index) => (
                      <button
                        key={d.id}
                        onClick={() => {
                          setStep('domains');
                          setActiveDomainIdx(index);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          step === 'domains' && activeDomainIdx === index
                            ? 'bg-indigo-950/40 text-indigo-400 border border-indigo-900/60'
                            : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/50 border border-transparent'
                        }`}
                      >
                        <span className="truncate">{d.id}. {d.title}</span>
                        {isDomainAnswered(d.id) && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Section C */}
                <button
                  onClick={() => setStep('prs')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all mt-4 ${
                    step === 'prs' ? 'bg-indigo-950/40 text-indigo-400 border border-indigo-900/60' : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/50 border border-transparent'
                  }`}
                >
                  <span>Section C: PRS-Lite</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                </button>

                {/* Section D */}
                <button
                  onClick={() => setStep('upload')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    step === 'upload' ? 'bg-indigo-950/40 text-indigo-400 border border-indigo-900/60' : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/50 border border-transparent'
                  }`}
                >
                  <span>Section D: Data Upload</span>
                  {isSectionDComplete() && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                </button>

                {/* Review */}
                <button
                  onClick={() => setStep('review')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    step === 'review' ? 'bg-indigo-950/40 text-indigo-400 border border-indigo-900/60' : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/50 border border-transparent'
                  }`}
                >
                  <span>Review & Submit</span>
                </button>
              </nav>
            </div>
          </aside>

          {/* MAIN FORM PANEL */}
          <main className="flex-1 p-6 md:p-10 max-w-4xl mx-auto w-full overflow-y-auto">
            
            {/* SECTION A: METADATA */}
            {step === 'metadata' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-100">Section A: Basic Assessment Information</h3>
                  <p className="text-slate-400 text-sm mt-1">Please provide metadata detailing the origins and custody of this dataset.</p>
                </div>

                <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 space-y-6">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Dataset Title</label>
                    <input
                      type="text"
                      value={datasetTitle}
                      onChange={e => setDatasetTitle(e.target.value)}
                      placeholder="e.g. Longitudinal Indian Health Dataset"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 transition-colors placeholder-slate-700"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Version / DOI / Handle</label>
                      <input
                        type="text"
                        value={versionDoiHandle}
                        onChange={e => setVersionDoiHandle(e.target.value)}
                        placeholder="e.g. v1.0.0 or doi:10.5061/dryad.xxx"
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 transition-colors placeholder-slate-700"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Submitting PI / Custodian</label>
                      <input
                        type="text"
                        value={submittingPiCustodian}
                        onChange={e => setSubmittingPiCustodian(e.target.value)}
                        placeholder="e.g. Dr. A. K. Sharma"
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 transition-colors placeholder-slate-700"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Date of Assessment</label>
                      <input
                        type="date"
                        value={dateOfAssessment}
                        onChange={e => setDateOfAssessment(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 transition-colors text-slate-300"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Assessor Name / Affiliation</label>
                      <input
                        type="text"
                        value={assessorNameAffiliation}
                        onChange={e => setAssessorNameAffiliation(e.target.value)}
                        placeholder="e.g. Jane Doe / Nodal Center Chennai"
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 transition-colors placeholder-slate-700"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    onClick={() => {
                      setStep('domains');
                      setActiveDomainIdx(0);
                    }}
                    disabled={!isSectionAComplete()}
                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-900 disabled:text-slate-600 font-semibold rounded-lg shadow-md transition-all flex items-center gap-1.5"
                  >
                    Next Section <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* SECTION B: QUALITY DOMAINS */}
            {step === 'domains' && (
              <div className="space-y-6">
                {/* Domain Header */}
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <span className="text-xs font-bold text-indigo-500 uppercase tracking-widest">
                      Domain {activeDomainIdx + 1} of 15
                    </span>
                    <h3 className="text-xl font-bold text-slate-100 mt-1">
                      {domainsData[activeDomainIdx].title}
                    </h3>
                  </div>

                  {domainsData[activeDomainIdx].id === 11 && (
                    <div className="flex items-center gap-2 bg-slate-900 px-4 py-2 border border-slate-800 rounded-lg">
                      <label className="text-xs font-semibold text-slate-300 cursor-pointer" htmlFor="na-toggle">
                        Not Applicable (N/A)
                      </label>
                      <input
                        id="na-toggle"
                        type="checkbox"
                        checked={domain11Na}
                        onChange={e => setDomain11Na(e.target.checked)}
                        className="w-4 h-4 rounded text-indigo-600 border-slate-800 focus:ring-indigo-500"
                      />
                    </div>
                  )}
                </div>

                {/* Score Options List */}
                {!(domainsData[activeDomainIdx].id === 11 && domain11Na) ? (
                  <div className="space-y-3">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Select Rubric Score (0 to 4)
                    </label>

                    <div className="grid grid-cols-1 gap-3">
                      {[0, 1, 2, 3, 4].map(scoreOption => {
                        const isSelected = answers[domainsData[activeDomainIdx].id].score === scoreOption;
                        return (
                          <button
                            key={scoreOption}
                            type="button"
                            onClick={() => setAnswers(prev => ({
                              ...prev,
                              [domainsData[activeDomainIdx].id]: {
                                ...prev[domainsData[activeDomainIdx].id],
                                score: scoreOption
                              }
                            }))}
                            className={`text-left p-4 rounded-xl border transition-all relative flex items-start gap-4 ${
                              isSelected
                                ? 'bg-indigo-950/20 border-indigo-500 shadow-lg shadow-indigo-500/5'
                                : 'bg-slate-900/40 border-slate-900 hover:border-slate-800 hover:bg-slate-900/60'
                            }`}
                          >
                            <span className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 font-bold text-xs ${
                              isSelected ? 'bg-indigo-500 text-white' : 'bg-slate-950 text-slate-500 border border-slate-800'
                            }`}>
                              {scoreOption}
                            </span>
                            <p className={`text-sm leading-relaxed ${isSelected ? 'text-slate-100 font-medium' : 'text-slate-400'}`}>
                              {domainsData[activeDomainIdx].descriptions[scoreOption]}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="p-8 bg-slate-900/30 border border-slate-900 rounded-xl text-center">
                    <BookOpen className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-400 font-medium">This domain is flagged as Not Applicable.</p>
                    <p className="text-xs text-slate-500 mt-1">Its score is excluded from calculations and does not require inputs.</p>
                  </div>
                )}

                {/* Justification Box */}
                {!(domainsData[activeDomainIdx].id === 11 && domain11Na) && (
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Factual Description
                    </label>
                    <textarea
                      rows={4}
                      value={answers[domainsData[activeDomainIdx].id].factual_description}
                      onChange={e => setAnswers(prev => ({
                        ...prev,
                        [domainsData[activeDomainIdx].id]: {
                          ...prev[domainsData[activeDomainIdx].id],
                          factual_description: e.target.value
                        }
                      }))}
                      placeholder="Detail factual evidence supporting your choice. State systems, workflows, or SOP structures."
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 transition-colors placeholder-slate-700"
                    />
                  </div>
                )}

                {/* Stepper Footer */}
                <div className="flex justify-between items-center pt-6 border-t border-slate-900">
                  <button
                    onClick={() => {
                      if (activeDomainIdx > 0) {
                        setActiveDomainIdx(prev => prev - 1);
                      } else {
                        setStep('metadata');
                      }
                    }}
                    className="px-4 py-2 border border-slate-850 hover:bg-slate-900 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5"
                  >
                    <ChevronLeft className="w-4 h-4" /> Previous
                  </button>

                  <button
                    onClick={() => {
                      if (activeDomainIdx < 14) {
                        setActiveDomainIdx(prev => prev + 1);
                      } else {
                        setStep('prs');
                      }
                    }}
                    disabled={!(domainsData[activeDomainIdx].id === 11 && domain11Na) && answers[domainsData[activeDomainIdx].id].factual_description.trim() === ''}
                    className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-900 disabled:text-slate-600 font-semibold rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    Next <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* SECTION C: PRS-LITE CALCULATOR */}
            {step === 'prs' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-100">Section C: Privacy-Risk Score (PRS-Lite)</h3>
                  <p className="text-slate-400 text-sm mt-1">Configure parameters to calculate re-identifiability risk and sensitivity bands.</p>
                </div>

                <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 space-y-8">
                  {/* Step 1: Identification Risk */}
                  <div className="space-y-3">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Step 1 – Identification Risk Score (0 to 50)
                    </label>

                    <div className="grid grid-cols-1 gap-3">
                      {[
                        { val: 50, label: "50 - High Traceability", desc: "Names, phone numbers, IDs, GPS, or full Date of Birth are visible; easily traceable individuals." },
                        { val: 30, label: "30 - Indirect Identification", desc: "Direct identifiers removed, but unique combinations can reveal identities (e.g. rare disease + village + date)." },
                        { val: 15, label: "15 - Coarse Anonymization", desc: "Only coarse variables remain (age, sex, district, month); re-identification is hard but not impossible." },
                        { val: 5, label: "5 - Strongly Masked", desc: "Generalized categories only (age bands, state, quarter); identities effectively hidden." },
                        { val: 0, label: "0 - Aggregated Outputs Only", desc: "Only aggregated counts are present; no individual rows are stored." }
                      ].map(riskOption => (
                        <button
                          key={riskOption.val}
                          type="button"
                          onClick={() => setIdentificationRisk(riskOption.val)}
                          className={`text-left p-4 rounded-xl border transition-all flex items-start gap-4 ${
                            identificationRisk === riskOption.val
                              ? 'bg-indigo-950/20 border-indigo-500'
                              : 'bg-slate-900/40 border-slate-900 hover:border-slate-800'
                          }`}
                        >
                          <span className={`w-4 h-4 rounded-full border shrink-0 mt-1 flex items-center justify-center ${
                            identificationRisk === riskOption.val ? 'border-indigo-500 bg-indigo-500' : 'border-slate-800 bg-slate-950'
                          }`}>
                            {identificationRisk === riskOption.val && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </span>
                          <div>
                            <span className="text-sm font-bold text-slate-100 block">{riskOption.label}</span>
                            <span className="text-xs text-slate-400 leading-normal block mt-1">{riskOption.desc}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Step 2: Sensitivity Multiplier */}
                  <div className="space-y-3">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Step 2 – Sensitivity / Harm Multiplier
                    </label>

                    <div className="grid grid-cols-1 gap-3">
                      {[
                        { val: 1.0, label: "1.0 - Routine / Low Harm", desc: "Non-stigmatizing routine parameters (e.g. vitals or service utilization statistics)." },
                        { val: 1.5, label: "1.5 - High Stigma / Personal Impact", desc: "TB, HIV, reproductive health, mental health, genomic assets, vulnerable groups, or undocumented status." },
                        { val: 2.0, label: "2.0 - Critical / Safety-Sensitive", desc: "Forensic details, detainee health, conflict data, tribal GPS coordinates, or refugee records." }
                      ].map(multOption => (
                        <button
                          key={multOption.val}
                          type="button"
                          onClick={() => setSensitivityMultiplier(multOption.val)}
                          className={`text-left p-4 rounded-xl border transition-all flex items-start gap-4 ${
                            sensitivityMultiplier === multOption.val
                              ? 'bg-indigo-950/20 border-indigo-500'
                              : 'bg-slate-900/40 border-slate-900 hover:border-slate-800'
                          }`}
                        >
                          <span className={`w-4 h-4 rounded-full border shrink-0 mt-1 flex items-center justify-center ${
                            sensitivityMultiplier === multOption.val ? 'border-indigo-500 bg-indigo-500' : 'border-slate-800 bg-slate-950'
                          }`}>
                            {sensitivityMultiplier === multOption.val && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </span>
                          <div>
                            <span className="text-sm font-bold text-slate-100 block">{multOption.label}</span>
                            <span className="text-xs text-slate-400 leading-normal block mt-1">{multOption.desc}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer Navigation */}
                <div className="flex justify-between items-center pt-6 border-t border-slate-900">
                  <button
                    onClick={() => {
                      setStep('domains');
                      setActiveDomainIdx(14);
                    }}
                    className="px-4 py-2 border border-slate-850 hover:bg-slate-900 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5"
                  >
                    <ChevronLeft className="w-4 h-4" /> Previous
                  </button>

                  <button
                    onClick={() => setStep('upload')}
                    className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 font-semibold rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    Next Section <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* SECTION D: DATASET UPLOADER */}
            {step === 'upload' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-100">Section D: Dataset Asset Upload</h3>
                  <p className="text-slate-400 text-sm mt-1">Upload the dataset CSV files or provide a link for unstructured assets.</p>
                </div>

                <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 space-y-6">
                  {/* Upload Mode Toggle */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                      Dataset Structure Type
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setDatasetType('structured')}
                        className={`py-3 rounded-lg border font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                          datasetType === 'structured'
                            ? 'bg-indigo-950/20 border-indigo-500 text-indigo-400 font-bold'
                            : 'bg-slate-900/40 border-slate-900 text-slate-400 hover:border-slate-800'
                        }`}
                      >
                        <FileSpreadsheet className="w-4 h-4" /> Structured CSV
                      </button>
                      <button
                        type="button"
                        onClick={() => setDatasetType('unstructured')}
                        className={`py-3 rounded-lg border font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                          datasetType === 'unstructured'
                            ? 'bg-indigo-950/20 border-indigo-500 text-indigo-400 font-bold'
                            : 'bg-slate-900/40 border-slate-900 text-slate-400 hover:border-slate-800'
                        }`}
                      >
                        <Link2 className="w-4 h-4" /> Unstructured Link
                      </button>
                    </div>
                  </div>

                  {/* Input Rendering based on toggle */}
                  {datasetType === 'unstructured' ? (
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                        Dataset Reference Link
                      </label>
                      <input
                        type="url"
                        value={datasetLink}
                        onChange={e => setDatasetLink(e.target.value)}
                        placeholder="https://example.com/unstructured-data-url"
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 transition-colors placeholder-slate-700"
                      />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Drag & Drop Input Box */}
                      <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-slate-800 hover:border-indigo-500/50 bg-slate-950/40 rounded-xl cursor-pointer transition-all">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 text-slate-500 mb-3" />
                          <p className="text-sm font-semibold text-slate-300">Click to upload CSV files</p>
                          <p className="text-xs text-slate-500 mt-1">Accepts multiple .csv files only</p>
                        </div>
                        <input
                          type="file"
                          multiple
                          accept=".csv"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>

                      {/* Uploaded Files Table */}
                      {uploadedFiles.length > 0 && (
                        <div className="border border-slate-850 rounded-lg overflow-hidden">
                          <div className="bg-slate-950 px-4 py-2 border-b border-slate-850">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Uploaded Files</span>
                          </div>
                          <div className="divide-y divide-slate-900 bg-slate-900/10">
                            {uploadedFiles.map(file => (
                              <div key={file.id} className="flex justify-between items-center px-4 py-3 text-sm">
                                <div className="flex items-center gap-3">
                                  <FileCheck className="w-4 h-4 text-indigo-400 shrink-0" />
                                  <div>
                                    <span className="font-semibold text-slate-200 block truncate max-w-xs md:max-w-md">{file.name}</span>
                                    <span className="text-[10px] text-slate-500">{(file.size / 1024).toFixed(1)} KB</span>
                                  </div>
                                </div>

                                <div className="flex items-center gap-4">
                                  {/* Status indicators */}
                                  {file.status === 'pending' && (
                                    <span className="text-xs text-slate-500 flex items-center gap-1.5">
                                      <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                                      Validating...
                                    </span>
                                  )}
                                  {file.status === 'success' && (
                                    <span className="text-xs text-emerald-400 flex items-center gap-1 bg-emerald-950/20 border border-emerald-900 px-2 py-0.5 rounded-full">
                                      ✓ Validated
                                    </span>
                                  )}
                                  {file.status === 'failed' && (
                                    <span className="text-xs text-red-400 flex items-center gap-1 bg-red-950/20 border border-red-900 px-2 py-0.5 rounded-full" title="File must end with .csv and contain data">
                                      ✕ Failed Verification
                                    </span>
                                  )}

                                  <button
                                    onClick={() => removeFile(file.id)}
                                    className="p-1.5 hover:bg-slate-900 text-slate-500 hover:text-red-400 border border-transparent hover:border-slate-800 rounded-md transition-colors"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Footer Navigation */}
                <div className="flex justify-between items-center pt-6 border-t border-slate-900">
                  <button
                    onClick={() => setStep('prs')}
                    className="px-4 py-2 border border-slate-850 hover:bg-slate-900 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5"
                  >
                    <ChevronLeft className="w-4 h-4" /> Previous
                  </button>

                  <button
                    onClick={() => setStep('review')}
                    disabled={!isSectionDComplete()}
                    className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-900 disabled:text-slate-600 font-semibold rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    Review Submission <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* REVIEW PANEL */}
            {step === 'review' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-100">Review & Submit Assessment</h3>
                  <p className="text-slate-400 text-sm mt-1">Verify your responses before locking and submitting. Calculations will execute on the backend.</p>
                </div>

                <div className="space-y-4">
                  {/* Metadata Summary */}
                  <div className="bg-slate-900/40 border border-slate-900 rounded-xl p-5 space-y-3">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block border-b border-slate-850 pb-2">
                      Section A: Basic Info
                    </span>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-slate-500 block text-xs">Dataset Title</span>
                        <span className="text-slate-200 font-semibold mt-0.5 block">{datasetTitle || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-xs">Version/DOI</span>
                        <span className="text-slate-200 font-semibold mt-0.5 block">{versionDoiHandle || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-xs">PI / Custodian</span>
                        <span className="text-slate-200 font-semibold mt-0.5 block">{submittingPiCustodian || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-xs">Assessor Name</span>
                        <span className="text-slate-200 font-semibold mt-0.5 block">{assessorNameAffiliation || 'N/A'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Section B & C Completion checks */}
                  <div className="bg-slate-900/40 border border-slate-900 rounded-xl p-5 flex justify-between items-center text-sm">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      <div>
                        <span className="font-semibold text-slate-200 block">Section B: 15 Rubric Domains</span>
                        <span className="text-xs text-slate-500 mt-0.5 block">
                          {domain11Na ? "14 domains + Domain 11 (Not Applicable) answered" : "All 15 domains answered"}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/20 border border-emerald-900 px-2 py-0.5 rounded-full">
                      Complete
                    </span>
                  </div>

                  <div className="bg-slate-900/40 border border-slate-900 rounded-xl p-5 flex justify-between items-center text-sm">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      <div>
                        <span className="font-semibold text-slate-200 block">Section C: Privacy Configurations</span>
                        <span className="text-xs text-slate-500 mt-0.5 block">
                          Risk: {identificationRisk} | Multiplier: {sensitivityMultiplier}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/20 border border-emerald-900 px-2 py-0.5 rounded-full">
                      Complete
                    </span>
                  </div>

                  {/* Section D Summary */}
                  <div className="bg-slate-900/40 border border-slate-900 rounded-xl p-5 space-y-3">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block border-b border-slate-850 pb-2">
                      Section D: Upload Assets ({datasetType})
                    </span>
                    {datasetType === 'unstructured' ? (
                      <div className="flex items-center gap-2 text-sm">
                        <Link2 className="w-4 h-4 text-indigo-400" />
                        <span className="text-slate-300 font-semibold">{datasetLink}</span>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        {uploadedFiles.filter(f => f.status === 'success').map(f => (
                          <div key={f.id} className="text-xs text-slate-400 flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            <span className="font-semibold truncate max-w-xs">{f.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Submit Trigger Actions */}
                <div className="flex gap-4 p-4 bg-indigo-950/10 border border-indigo-900/30 rounded-xl text-xs text-indigo-400 leading-normal">
                  <Lock className="w-5 h-5 shrink-0 text-indigo-500" />
                  <p>
                    By submitting, the assessment is pushed to PostgreSQL permanently and lock validations will be applied. 
                    The draft cached in Redis will be deleted. Ensure all inputs are correct.
                  </p>
                </div>

                <div className="flex justify-between items-center pt-6 border-t border-slate-900">
                  <button
                    onClick={() => setStep('upload')}
                    className="px-4 py-2 border border-slate-850 hover:bg-slate-900 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5"
                  >
                    <ChevronLeft className="w-4 h-4" /> Previous
                  </button>

                  <button
                    onClick={handleSubmitForm}
                    disabled={isSubmitting || !isSectionAComplete() || !isAllDomainsComplete() || !isSectionDComplete()}
                    className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-indigo-600 hover:from-emerald-600 hover:to-indigo-700 text-white font-bold rounded-lg shadow-lg shadow-emerald-500/10 transition-all flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        Confirm & Finalize Submit
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>
      )}

      {/* SUCCESS PAGE: READ-ONLY REPORT */}
      {step === 'completed' || step === 'success' && submissionResult && (
        <div className="flex-1 flex flex-col items-center justify-center max-w-3xl mx-auto px-6 py-12 text-center relative z-10 w-full animate-fade-in">
          <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mb-6">
            <FileCheck className="w-8 h-8" />
          </div>

          <h2 className="text-3xl font-extrabold tracking-tight mb-2">Self-Assessment Submitted Successfully</h2>
          <p className="text-slate-400 text-sm max-w-md mx-auto mb-8">
            The assessment is recorded in PostgreSQL. Under policy, details are locked and the Redis cache has been cleared.
          </p>

          <div className="w-full bg-slate-900/60 border border-slate-800 rounded-xl p-6 text-left space-y-6 shadow-2xl relative">
            <div className="absolute top-6 right-6 flex items-center gap-2 border border-slate-800 bg-slate-950 px-3 py-1 rounded-full text-xs font-semibold text-indigo-400">
              <Lock className="w-3.5 h-3.5 text-indigo-500" /> Read-Only Submission
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-4 border-b border-slate-850 pb-2">
                Assessment Metadata
              </span>
              <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
                <div>
                  <span className="text-slate-500 block text-xs">Dataset Title</span>
                  <span className="text-slate-200 font-semibold mt-0.5 block">{datasetTitle}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-xs">Submission ID</span>
                  <span className="text-indigo-400 font-semibold mt-0.5 block font-mono text-xs">{submissionResult.assessment_id}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-xs">Version / DOI</span>
                  <span className="text-slate-200 font-semibold mt-0.5 block">{versionDoiHandle}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-xs">Submitting PI / Custodian</span>
                  <span className="text-slate-200 font-semibold mt-0.5 block">{submittingPiCustodian}</span>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-850 pt-6">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-4 border-b border-slate-850 pb-2">
                Submission Metrics (Stored on DB)
              </span>
              <div className="grid grid-cols-3 gap-6 text-center">
                <div className="bg-slate-950 p-4 border border-slate-850 rounded-lg">
                  <span className="text-slate-500 text-[10px] uppercase font-bold block">CQI Grade</span>
                  <span className="text-slate-100 text-lg font-extrabold mt-1 block">{submissionResult.cqi_grade}</span>
                </div>
                <div className="bg-slate-950 p-4 border border-slate-850 rounded-lg">
                  <span className="text-slate-500 text-[10px] uppercase font-bold block">PRS Risk Band</span>
                  <span className="text-slate-100 text-lg font-extrabold mt-1 block">{submissionResult.prs_band}</span>
                </div>
                <div className="bg-slate-950 p-4 border border-slate-850 rounded-lg">
                  <span className="text-slate-500 text-[10px] uppercase font-bold block">Release Category</span>
                  <span className="text-indigo-400 text-lg font-extrabold mt-1 block">{submissionResult.release_category}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4 mt-8 print:hidden">
            <button
              onClick={() => window.print()}
              className="px-6 py-2.5 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 hover:text-white font-semibold rounded-lg transition-colors flex items-center gap-1.5"
            >
              Print Assessment Report
            </button>

            <button
              onClick={() => {
                // Reset state for new form assessment
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
                setStep('welcome');
                isFormLoaded.current = false;
              }}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md transition-colors"
            >
              New Assessment
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
