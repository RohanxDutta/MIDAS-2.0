import Link from 'next/link';
import { PortalPageLayout } from '@/components/portal/PortalPageLayout';

export function LandingPage() {
  return (
    <PortalPageLayout>

<section className="hero">
    <div className="hero-bg"></div>
    <div className="hero-pattern"></div>
    <div className="hero-inner">
        <div>
            <div className="hero-eyebrow"><div className="hero-eyebrow-line"></div>ICMR Framework</div>
            <h1>MIDAS 2.0: Assessing health dataset readiness for <span>safe, trustworthy AI</span></h1>
            <p className="hero-sub"><strong>MIDAS 2.0</strong>, the <em>Metric-based Integrity and Data Assessment System </em>is an upgrade of <strong>MIDAS 1.0</strong> <em>Medical Imaging and Information Datasets for India </em>, <strong> MIDAS 2.0 </strong>gives institutions a common method to check <strong>data quality</strong>, documentation, representativeness, interoperability, governance, and privacy before a dataset is shared, reused, or used to build AI tools.</p>
            <div className="hero-actions">
                
                    <a href="https://midas.icmr.org.in/delphiproposal/" target="_blank" rel="noopener noreferrer" className="btn btn-blue">Read Published Paper &rarr;</a>
                    <Link href="/login" className="btn btn-outline">Login</Link>
                
            </div>
        </div>
        <div className="hero-card">
            <div className="hero-card-title">MIDAS at a Glance</div>
            <div className="stat-grid">
                <div className="stat-item"><div className="stat-val">15</div><div className="stat-label">Quality Domains</div></div>
                <div className="stat-item"><div className="stat-val">2</div><div className="stat-label">Lite + Technical Versions</div></div>
                <div className="stat-item wide"><div className="stat-val">0-100</div><div className="stat-label">Clear quality and privacy scoring outputs</div></div>
            </div>
            <div className="hero-badge-row">
                <span className="hbadge hbadge-blue">Quality Scoring</span>
                <span className="hbadge hbadge-orange">Privacy Risk</span>
                <span className="hbadge hbadge-navy">Independent Validation</span>
            </div>
        </div>
    </div>
</section>

<section className="overview">
    <div className="container">
        <div className="fade-up">
            <div className="sec-eyebrow">What MIDAS Is</div>
            <h2 className="sec-title">A practical framework for deciding whether a biomedical dataset can be trusted and responsibly reused</h2>
            <p className="sec-sub">If you are new to MIDAS, think of it as a practical system that helps you understand whether a health dataset is truly ready for <strong>research</strong>, <strong>repository onboarding</strong>, and <strong>AI development</strong>, <span className="accent-underline">not just whether the files exist</span>.</p>
        </div>
        <div className="overview-grid">
            <div className="info-card fade-up" style={{ transitionDelay: '0ms' }}>
                <div className="info-card-kicker">Why It Exists</div>
                <h3>Many health datasets are useful, but not equally ready for AI</h3>
                <p>Useful datasets are often held back by uneven documentation, inconsistent metadata, weak interoperability, or unclear privacy safeguards. <strong>MIDAS 2.0</strong> exists to replace <strong>guesswork</strong> with a consistent, evidence-based way to judge whether a dataset is strong enough to be trusted and reused.</p>
            </div>
            <div className="info-card fade-up" style={{ transitionDelay: '90ms' }}>
                <div className="info-card-kicker">What It Measures</div>
                <h3>It looks beyond file quality to real-world trustworthiness</h3>
                <p><strong>MIDAS 2.0</strong> evaluates whether a dataset is not only complete, but also <strong>understandable</strong>, <strong>reusable</strong>, <strong>representative</strong>, and <strong>safe</strong>.</p>
                <ul className="info-list">
                    <li><strong>Data quality:</strong> annotation fidelity, metadata, documentation, and completeness</li>
                    <li><strong>Operational readiness:</strong> interoperability, AI-readiness, representativeness, and sustainability</li>
                    <li><strong>Trust safeguards:</strong> governance, ethics, security, consent, and privacy risk</li>
                </ul>
            </div>
            <div className="info-card fade-up" style={{ transitionDelay: '180ms' }}>
                <div className="info-card-kicker">What It Helps Decide</div>
                <h3>It supports improvement planning, certification, and access control</h3>
                <p>The framework helps centres identify gaps, improve weak areas, compare datasets on a common scale, and decide how confidently a dataset can be <strong>shared</strong>, <strong>governed</strong>, and <strong>reused</strong>. It also supports repository onboarding and future benchmark AI work.</p>
            </div>
        </div>
    </div>
</section>

<section>
    <div className="container">
        <div className="fade-up">
            <div className="sec-eyebrow">Why MIDAS 2.0</div>
            <h2 className="sec-title">Why MIDAS 2.0 had to go beyond MIDAS 1.0</h2>
            <p className="sec-sub"><strong>MIDAS 1.0</strong> proved that high-quality, standardized biomedical datasets could be built in a structured way. <strong>MIDAS 2.0</strong> takes the next necessary step. If datasets are going to be compared across centres, onboarded into trusted repositories, and reused for AI, they must be assessed with <strong>clearer evidence</strong>, <strong>stronger privacy safeguards</strong>, <strong>better interoperability checks</strong>, and a framework that <span className="accent-underline">works beyond imaging alone</span>.</p>
        </div>
        <div className="evolution-grid">
            <div className="evolution-card fade-up" style={{ transitionDelay: '0ms' }}>
                <div className="info-card-kicker">What MIDAS 1.0 Proved</div>
                <h3>It established the foundation for structured dataset curation</h3>
                <p><strong>MIDAS 1.0</strong> showed that biomedical datasets could be built with <strong>stronger annotation discipline</strong>, richer metadata, and more consistent curation standards instead of being assembled in an ad hoc way. That early work created the foundation for a more mature national framework.</p>
                <div className="evolution-note">Its biggest contribution was proving that <em>dataset quality</em> could be treated as a scientific and operational priority, not as an afterthought.</div>
            </div>
            <div className="evolution-card fade-up" style={{ transitionDelay: '90ms' }}>
                <div className="info-card-kicker">Why MIDAS 2.0 Matters</div>
                <h3>It adds the measurable rules needed for trusted reuse at scale</h3>
                <p><strong>MIDAS 1.0</strong> was an important beginning, but it was not enough for a national-quality ecosystem. A stronger framework was needed because datasets today must do more than look well curated inside one institution. They must be <strong>comparable across centres</strong>, <strong>usable across data types</strong>, and <strong>safe enough</strong> to support responsible sharing and AI development.</p>
                <ul className="info-list">
                    <li>It introduces reproducible quantitative scoring through the <strong>Composite Quality Index</strong> and <strong>Privacy-Risk Score</strong>.</li>
                    <li>It extends assessment beyond imaging to <strong>multimodal biomedical and health data</strong>, including text, voice, and EHR-linked datasets.</li>
                    <li>It adds stronger checks for <strong>interoperability</strong>, <strong>governance</strong>, <strong>representativeness</strong>, and <strong>privacy readiness</strong>.</li>
                    <li>It supports defensible decisions about <strong>dataset quality</strong>, safeguards, and readiness for wider reuse.</li>
                </ul>
            </div>
        </div>
    </div>
</section>

<section>
    <div className="container">
        <div className="fade-up">
            <div className="sec-eyebrow">How It Works</div>
            <h2 className="sec-title">From self-assessment to verified release decision</h2>
            <p className="sec-sub"><strong>MIDAS 2.0</strong> uses a two-stage pathway so dataset custodians can first complete the <strong>Lite Version</strong> themselves and then undergo an independent <strong>Technical review</strong> before the final <strong>CQI</strong> and <strong>PRS</strong> are assigned. This keeps the process practical for centres while still requiring evidence-based validation before broader sharing or repository onboarding.</p>
        </div>
        <div className="workflow-grid">
            <div className="step-card fade-up" style={{ transitionDelay: '0ms' }}>
                <div className="step-num">1</div>
                <h3>Centre completes the Lite Version</h3>
                <p>The dataset custodian performs a structured <strong>self-assessment</strong> and records the current state of the dataset against the MIDAS domains.</p>
            </div>
            <div className="step-card fade-up" style={{ transitionDelay: '90ms' }}>
                <div className="step-num">2</div>
                <h3>Evidence is assembled and retained</h3>
                <p><strong>Metadata</strong>, <strong>SOPs</strong>, validation logs, consent information, and privacy documentation are kept ready so every claim can be verified rather than assumed.</p>
            </div>
            <div className="step-card fade-up" style={{ transitionDelay: '180ms' }}>
                <div className="step-num">3</div>
                <h3>Nodal Centre performs the Technical review</h3>
                <p>An independent reviewer checks the submission in greater detail, asks for clarifications if needed, and computes the final <strong>quality</strong> and <strong>privacy</strong> scores.</p>
            </div>
            <div className="step-card fade-up" style={{ transitionDelay: '270ms' }}>
                <div className="step-num">4</div>
                <h3>Scores guide release and improvement</h3>
                <p>The final <strong>CQI</strong> and <strong>PRS</strong> determine whether the dataset is ready for broader use, needs targeted improvement, or requires stronger sharing restrictions.</p>
            </div>
        </div>
    </div>
</section>

<section className="scoring">
    <div className="container">
        <div className="fade-up">
            <div className="sec-eyebrow">Scoring Logic</div>
            <h2 className="sec-title">How MIDAS turns evidence into decisions</h2>
            <p className="sec-sub">The framework produces <strong>two outputs</strong>: one score for <strong>overall dataset quality</strong> and one score for <strong>residual privacy risk</strong>. Together, they show whether a dataset is strong enough to support trustworthy reuse and what level of safeguards it still needs. This is what turns <strong>MIDAS 2.0</strong> from a checklist into a decision framework for certification, repository onboarding, and responsible reuse.</p>
        </div>
        <div className="scoring-grid">
            <div className="score-card fade-up" style={{ transitionDelay: '0ms' }}>
                <div className="score-card-head">
                    <div className="score-icon score-icon-blue">📊</div>
                    <div className="score-card-head-text">
                        <h3>Composite Quality Index</h3>
                        <p>Summarises how complete, reusable, representative, and well-governed a dataset is across the <strong>15 MIDAS domains</strong>.</p>
                    </div>
                </div>
                <div className="score-card-body">
                    <p className="score-note">In simple terms, <strong>CQI</strong> answers: <em>&quot;How strong and trustworthy is this dataset overall?&quot;</em> A higher CQI means the dataset is better documented, easier to reuse, and more suitable for high-quality research and AI development.</p>
                    <div className="math-label">Quality Index Formula</div>
                    <div className="math-box">CQI = (Sum of domain scores / Maximum possible score) × 100</div>
                    <div className="math-label math-label-spaced">6-Tier Grading Ladder</div>
                    <ul className="tier-list">
                        <li><span className="tier-chip t-diamond">Diamond</span> ≥ 95 — Global exemplar</li>
                        <li><span className="tier-chip t-platinum">Platinum</span> 85–94 — Best-practice dataset</li>
                        <li><span className="tier-chip t-gold">Gold</span> 70–84 — High-quality dataset</li>
                        <li><span className="tier-chip t-silver">Silver</span> 50–69 — Permissible, needs improvement</li>
                        <li><span className="tier-chip t-bronze">Bronze</span> 25–49 — Embargoed for enhancement</li>
                        <li><span className="tier-chip t-remediation">Remediation</span> &lt; 25 — Iterative QA required</li>
                    </ul>
                </div>
            </div>
            <div className="score-card fade-up" style={{ transitionDelay: '90ms' }}>
                <div className="score-card-head">
                    <div className="score-icon score-icon-green">🔒</div>
                    <div className="score-card-head-text">
                        <h3>Privacy-Risk Score</h3>
                        <p>Estimates how much <strong>re-identification</strong> or sensitive-attribute risk remains after privacy protections have been applied.</p>
                    </div>
                </div>
                <div className="score-card-body">
                    <p className="score-note"><strong>PRS</strong> answers a different question: <em>&quot;Even after de-identification and other controls, how much privacy risk still remains?&quot;</em> A lower PRS supports wider reuse, while a higher PRS signals the need for tighter controls.</p>
                    <div className="math-label">Example Baseline for Tabular Data</div>
                    <div className="math-box">BaselineRisk<sub>tabular</sub> = 100 × p</div>
                    <div className="math-label">Example Baseline for Differential Privacy</div>
                    <div className="math-box">BaselineRisk<sub>DP</sub> = min(100, 20 × ε)</div>
                    <p className="small-label">&quot;ε = differential-privacy budget; lower ε = stronger privacy.&quot;</p>
                    <p className="small-label">The baseline is then adjusted for how sensitive the data are. Higher sensitivity means stricter handling requirements.</p>
                    <div className="math-box">PRS = round(AdjustedRisk)</div>
                    <div className="risk-row">
                        <span className="risk-pill rl-low">Low  0–15</span>
                        <span className="risk-pill rl-mod">Moderate  16–40</span>
                        <span className="risk-pill rl-high">High  41–70</span>
                        <span className="risk-pill rl-vhigh">Very High  71–100</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<section className="delphi" id="delphi-proposal">
    <div className="container">
        <div className="fade-up">
            <div className="sec-eyebrow">Expert Validation</div>
            <h2 className="sec-title">Why this portal includes Delphi review</h2>
            <p className="sec-sub">Before <strong>MIDAS 2.0</strong> is used more widely, ICMR is asking experts to review whether the framework is <strong>clear</strong>, <strong>scientifically sound</strong>, <strong>complete</strong>, and <strong>practical</strong> across different biomedical data contexts. The goal is not only to validate the wording, but also to ensure the framework can be applied consistently before it is used for wider implementation and dataset certification.</p>
        </div>
        <div className="delphi-grid">
            <div className="delphi-card fade-up" style={{ transitionDelay: '0ms' }}>
                <div className="delphi-card-top dc-blue"></div>
                <div className="delphi-card-body">
                    <div className="delphi-num">01</div>
                    <h4>What experts are reviewing</h4>
                    <ul>
                        <li>Whether the 15 domains cover the main dimensions of dataset quality, trustworthiness, and AI-readiness.</li>
                        <li>Whether the wording and scoring ladders are clear enough to be used consistently across centres.</li>
                        <li>Whether any domains, criteria, or evidence requirements need refinement before broader rollout.</li>
                    </ul>
                </div>
            </div>
            <div className="delphi-card fade-up" style={{ transitionDelay: '90ms' }}>
                <div className="delphi-card-top dc-orange"></div>
                <div className="delphi-card-body">
                    <div className="delphi-num">02</div>
                    <h4>How reviewers score items</h4>
                    <p className="delphi-score-note">Each statement is rated on a 5-point scale, and lower scores must be explained so unclear or impractical sections can be revised.</p>
                    <div className="likert-bars">
                        <div className="lb-row"><span className="lb-num">0</span><div className="lb-bg"><div className="lb-fill lb-fill-20"></div></div><span className="lb-desc">Very unclear</span></div>
                        <div className="lb-row"><span className="lb-num">1</span><div className="lb-bg"><div className="lb-fill lb-fill-40"></div></div><span className="lb-desc">Unclear</span></div>
                        <div className="lb-row"><span className="lb-num">2</span><div className="lb-bg"><div className="lb-fill lb-fill-60"></div></div><span className="lb-desc">Needs clarification</span></div>
                        <div className="lb-row"><span className="lb-num">3</span><div className="lb-bg"><div className="lb-fill lb-fill-80"></div></div><span className="lb-desc">Clear</span></div>
                        <div className="lb-row"><span className="lb-num">4</span><div className="lb-bg"><div className="lb-fill lb-fill-100"></div></div><span className="lb-desc">Exceptionally clear</span></div>
                    </div>
                    <div className="alert-banner">⚠️  Ratings of 0–2 must be accompanied by explanatory comments.</div>
                </div>
            </div>
            <div className="delphi-card fade-up" style={{ transitionDelay: '180ms' }}>
                <div className="delphi-card-top dc-navy"></div>
                <div className="delphi-card-body">
                    <div className="delphi-num">03</div>
                    <h4>How agreement is measured</h4>
                    <div className="consensus-list">
                        <div className="ci"><strong>Item-level agreement</strong>How many experts rated an item 4 or 5. Target: CVI ≥ 0.78 </div>
                        <div className="ci"><strong>Scale-level agreement</strong>Average agreement across the full framework. Target: S-CVI/Ave ≥ 0.90</div>
                        <div className="ci"><strong>Modified Kappa ($k^*$)</strong>Adjusts for agreement that might happen by chance. ≥ 0.74 indicates excellent consensus.</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<section className="cta-section">
    <div className="cta-inner">
        <img className="cta-logo" src="/logo.svg" alt="ICMR" />
        <h2>Ready to review or continue your assessment?</h2>
        <p>If you are an invited expert, you can log in and continue the validation workflow. If you are new to MIDAS, start with the Delphi Proposal to read the full review document and scoring context.</p>
        <div className="cta-actions">
            <a href="https://midas.icmr.org.in/delphiproposal/" target="_blank" rel="noopener noreferrer" className="btn btn-ghost-light">Read Delphi Proposal</a>
            <Link href="/login" className="btn btn-orange">Login &rarr;</Link>
        </div>
    </div>
</section>

    </PortalPageLayout>
  );
}
