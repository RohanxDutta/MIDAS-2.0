export const DOCX_HTML = `
             <p class="p1"><b>ICMR MIDAS 2.0 Framework</b></p>
<p class="p2"><b><i>(Metric-based Integrity and Data Assessment System)</i></b></p>
<p class="p2"><b>Dataset Quality and Trust Framework</b><br>
<b>(Lite Version)</b></p>
<p class="p3"><b></b><br></p>
<p class="p3"><b></b><br></p>
<p class="p4"><b>Version 1.0 | Draft for Expert Validation</b></p>
<p class="p4"><b>Date:</b> 10.30.2025</p>
<p class="p3"><br></p>
<p class="p3"><br></p>
<p class="p5"><b>Prepared by:</b></p>
<p class="p5"><b>Indian Council of Medical Research (ICMR)</b></p>
<p class="p5">Division of Development Research</p>
<p class="p5">New Delhi, India</p>
<p class="p6"><br></p>
<p class="p6"><br></p>
<p class="p4"><b>Document Purpose</b></p>
<p class="p4">Lite Version of MIDAS 2.0 is a simplified framework for assessing dataset quality, integrity, interoperability, and privacy. It is a preliminary self-assessment of datasets by Independent Centers which may be submitted to the Nodal Centre for detailed evaluation using the Technical Version of the framework. Centers submitting the Lite framework, must maintain all supporting evidence and records for each entry to enable the Nodal Centre to verify, validate, and compute the final Composite Quality Index (CQI) and Privacy-Risk Score (PRS) during technical assessment.</p>
<p class="p3"><br></p>
<p class="p5"><b>Confidential Draft – For Review Only</b></p>
<p class="p5">Please do not distribute without authorization from ICMR.</p>
<p class="p6"><br></p>
<p class="p6"><br></p>
<p class="p7"><b>SECTION – A<span class="Apple-converted-space"> </span></b></p>
<p class="p8"><b>Basic information</b></p>
<table cellspacing="0" cellpadding="0" class="t1">
  <tbody>
    <tr>
      <td valign="middle" class="td1">
        <p class="p9">Dataset Title</p>
      </td>
      <td valign="middle" class="td1">
        <p class="p10"><br></p>
      </td>
    </tr>
    <tr>
      <td valign="middle" class="td1">
        <p class="p9">Version / DOI / Handle</p>
      </td>
      <td valign="middle" class="td1">
        <p class="p10"><br></p>
      </td>
    </tr>
    <tr>
      <td valign="middle" class="td1">
        <p class="p9">Submitting PI / Custodian</p>
      </td>
      <td valign="middle" class="td1">
        <p class="p10"><br></p>
      </td>
    </tr>
    <tr>
      <td valign="middle" class="td1">
        <p class="p9">Date of Assessment</p>
      </td>
      <td valign="middle" class="td1">
        <p class="p10"><br></p>
      </td>
    </tr>
    <tr>
      <td valign="middle" class="td1">
        <p class="p9">Assessor Name / Affiliation</p>
      </td>
      <td valign="middle" class="td1">
        <p class="p10"><br></p>
      </td>
    </tr>
  </tbody>
</table>
<p class="p11"><br></p>
<p class="p8"><b>What is MIDAS 2.0 (Lite Version)</b></p>
<p class="p8">The Lite Version of MIDAS 2.0 (Metric-based Integrity and Data Assessment System) is a self-assessment tool for evaluating dataset quality, integrity, interoperability, and privacy. It is designed for Independent Centers to provide an overview of their datasets which may be submitted for a formal validation by the Nodal Centre. This version uses simplified options and scoring ladders that reflect the main domains of the Technical Version while reducing computational complexity. It helps institutions identify strengths, gaps, and readiness for inclusion in the AI-ready dataset repository.</p>
<p class="p12"><b>How the MIDAS 2.0 scores are calculated</b></p>
<p class="p8">For a given dataset, quality is assessed across 15 domains where each domain is scored from 0 to 4, where <i>0 = absent</i> and <i>4 = exemplary</i>. Each domain in the technical version corresponds to a domain in the lite version, further complementing with additional clarifications. Both lite version of rubric and the additional information is provided by the data custodians.</p>
<p class="p8">The Composite Quality Index -Lite (CQI) is computed as:</p>
<div class="equation-block">
  <div class="equation">
    <span class="equation__lhs"><i>CQI</i><sub>Lite</sub> =</span>
    <span class="equation__fraction" aria-label="Sum of domain scores divided by maximum possible score">
      <span class="equation__numerator">Sum of domain scores</span>
      <span class="equation__line" aria-hidden="true"></span>
      <span class="equation__denominator">Maximum possible score</span>
    </span>
    <span class="equation__suffix">× 100</span>
  </div>
</div>
<p class="p14">Use the highest level where all statements are true. If any statement at that level is missing, step down one level. Attach the requested evidence. If a domain is formally marked as <i>"If Applicable"</i> (e.g. Domain 11), the CQI-Lite denominator becomes 14 × 4 = 56 instead of 60</p>
<p class="p8">The Privacy-Risk Score -Lite (PRS-Lite) is calculated separately on a scale of 0–100 (Low 0–15; Moderate 16–40; High 41–70; Very High 71–100) using the method detailed in Annexure I. PRS-Lite must be documented in the assessment record, including method, sensitivity class, and final score.<span class="Apple-converted-space"> </span></p>
<p class="p12"><b>How the scores can be Interpreted</b></p>
<p class="p12">The Composite Quality Index-Lite (CQI-Lite) determines the overall dataset quality and classified into six performance bands as follows:</p>
<table cellspacing="0" cellpadding="0" class="t1">
  <tbody>
    <tr>
      <td valign="middle" class="td1">
        <p class="p8"><b>Aggregated CQI-Lite band</b></p>
      </td>
      <td valign="middle" class="td1">
        <p class="p8"><b>Grade</b></p>
      </td>
      <td valign="middle" class="td1">
        <p class="p8"><b>Interpretation<span class="Apple-converted-space"> </span></b></p>
      </td>
    </tr>
    <tr>
      <td valign="middle" class="td1">
        <p class="p8"> ≥ 95</p>
      </td>
      <td valign="middle" class="td1">
        <p class="p8">Diamond</p>
      </td>
      <td valign="middle" class="td1">
        <p class="p8">Global exemplar</p>
      </td>
    </tr>
    <tr>
      <td valign="middle" class="td1">
        <p class="p8"> 85 – 94</p>
      </td>
      <td valign="middle" class="td1">
        <p class="p8">Platinum</p>
      </td>
      <td valign="middle" class="td1">
        <p class="p8">Best-practice dataset</p>
      </td>
    </tr>
    <tr>
      <td valign="middle" class="td1">
        <p class="p8"> 70 – 84</p>
      </td>
      <td valign="middle" class="td1">
        <p class="p8">Gold</p>
      </td>
      <td valign="middle" class="td1">
        <p class="p8">High-quality dataset</p>
      </td>
    </tr>
    <tr>
      <td valign="middle" class="td1">
        <p class="p8"> 50 – 69</p>
      </td>
      <td valign="middle" class="td1">
        <p class="p8">Silver</p>
      </td>
      <td valign="middle" class="td1">
        <p class="p8">Permissible but improvement plan must be recorded</p>
      </td>
    </tr>
    <tr>
      <td valign="middle" class="td1">
        <p class="p8"> 25 – 49</p>
      </td>
      <td valign="middle" class="td1">
        <p class="p8">Bronze</p>
      </td>
      <td valign="middle" class="td1">
        <p class="p8">Embargo until targeted enhancements completed</p>
      </td>
    </tr>
    <tr>
      <td valign="middle" class="td1">
        <p class="p8"> < 25</p>
      </td>
      <td valign="middle" class="td1">
        <p class="p8">Remediation</p>
      </td>
      <td valign="middle" class="td1">
        <p class="p8">Iterative QA and resubmission required</p>
      </td>
    </tr>
  </tbody>
</table>
<p class="p8">The Privacy-Risk Score -Lite (PRS-Lite) is calculated separately on a scale of 0–100 (Low 0–15; Moderate 16–40; High 41–70; Very High 71–100) using a method detailed in Annexure I. PRS-Lite must be documented in the assessment record, including method, sensitivity class, and final score.<span class="Apple-converted-space"> </span></p>
<p class="p8">Both CQI-Lite × PRS-Lite matrix determines Open / Controlled / Restricted release. By policy, clinical-genomic or high-stigma data default to Controlled unless PRS-Lite is Low with strong, independently verified Differential Privacy.</p>
<p class="p14"><b>CQI-Lite × PRS-Lite Release Matrix</b></p>
<table cellspacing="0" cellpadding="0" class="t1">
  <tbody>
    <tr>
      <td valign="middle" class="td1">
        <p class="p8"><b>PRS-Lite / CQI-Lite ↓</b></p>
      </td>
      <td valign="middle" class="td1">
        <p class="p8"><b>≥95 Diamond</b></p>
      </td>
      <td valign="middle" class="td1">
        <p class="p8"><b>85–94 Platinum</b></p>
      </td>
      <td valign="middle" class="td1">
        <p class="p8"><b>70–84 Gold</b></p>
      </td>
      <td valign="middle" class="td1">
        <p class="p8"><b>50–69 Silver</b></p>
      </td>
      <td valign="middle" class="td1">
        <p class="p8"><b>25-49 Bronze</b></p>
      </td>
    </tr>
    <tr>
      <td valign="middle" class="td1">
        <p class="p8">Low (0–15)</p>
      </td>
      <td valign="middle" class="td1">
        <p class="p8">Open</p>
      </td>
      <td valign="middle" class="td1">
        <p class="p8">Open/Controlled</p>
      </td>
      <td valign="middle" class="td1">
        <p class="p8">Controlled/Open</p>
      </td>
      <td valign="middle" class="td1">
        <p class="p8">Controlled</p>
      </td>
      <td valign="middle" class="td1">
        <p class="p8">Restricted</p>
      </td>
    </tr>
    <tr>
      <td valign="middle" class="td1">
        <p class="p8">Moderate (16–40)</p>
      </td>
      <td valign="middle" class="td1">
        <p class="p8">Open/Controlled</p>
      </td>
      <td valign="middle" class="td1">
        <p class="p8">Controlled</p>
      </td>
      <td valign="middle" class="td1">
        <p class="p8">Controlled</p>
      </td>
      <td valign="middle" class="td1">
        <p class="p8">Restricted</p>
      </td>
      <td valign="middle" class="td1">
        <p class="p8">Restricted</p>
      </td>
    </tr>
    <tr>
      <td valign="middle" class="td1">
        <p class="p8">High (41–70)</p>
      </td>
      <td valign="middle" class="td1">
        <p class="p8">Controlled</p>
      </td>
      <td valign="middle" class="td1">
        <p class="p8">Controlled</p>
      </td>
      <td valign="middle" class="td1">
        <p class="p8">Restricted</p>
      </td>
      <td valign="middle" class="td1">
        <p class="p8">Restricted</p>
      </td>
      <td valign="middle" class="td1">
        <p class="p8">Restricted</p>
      </td>
    </tr>
    <tr>
      <td valign="middle" class="td1">
        <p class="p8">Very High (71–100)</p>
      </td>
      <td valign="middle" class="td1">
        <p class="p8">Restricted</p>
      </td>
      <td valign="middle" class="td1">
        <p class="p8">Restricted</p>
      </td>
      <td valign="middle" class="td1">
        <p class="p8">Restricted</p>
      </td>
      <td valign="middle" class="td1">
        <p class="p8">Restricted</p>
      </td>
      <td valign="middle" class="td1">
        <p class="p8">Restricted</p>
      </td>
    </tr>
  </tbody>
</table>
<p class="p15"><b>How to Fill this Form</b></p>
<p class="p15">Each section contains simplified questions and scoring fields aligned with the 15 MIDAS 2.0 domains.<br>
Respondents should:</p>
<ul class="ul1">
  <li class="li15">Select the most appropriate option for each domain based on available evidence.</li>
  <li class="li15">Provide short, factual descriptions in text fields.</li>
  <li class="li15">Attach or reference supporting materials (e.g., SOPs, validation logs, metadata).</li>
</ul>
<p class="p15">Scores should reflect the current dataset state, not future plans.</p>
<p class="p15">Incomplete information may delay validation. Retain copies of all evidence for review by the Nodal Centre during technical assessment.</p>
<p class="p15"><b>What Happens After Submission</b></p>
<p class="p15">Once submitted, the completed Lite Version will be reviewed by the Nodal Centre. The Nodal Centre will:</p>
<ul class="ul1">
  <li class="li15">Verify and cross-check all entries and supporting evidence.</li>
  <li class="li15">Compute the Composite Quality Index (CQI) and Privacy-Risk Score (PRS) using the Technical Version.</li>
  <li class="li15">Classify the dataset into the appropriate quality and access category (Open, Controlled, or Restricted).</li>
</ul>
<p class="p15">If clarifications or missing data are identified, the Nodal Centre will contact the respective PI or Centre. Verified datasets may then progress toward inclusion in the MIDAS repository.</p>
<p class="p16"><br></p>
<p class="p17"><b></b></p>
<p class="p8"><b>SECTION – B<span class="Apple-converted-space"> </span></b></p>
<p class="p18"><b>Data Quality Domains<span class="Apple-converted-space"> </span></b></p>
<p class="p15"><b>1. Annotation / Labelling Reliability</b></p>
<table cellspacing="0" cellpadding="0" class="t1">
  <tbody>
    <tr>
      <td valign="middle" class="td1">
        <p class="p8"><b>Score</b></p>
      </td>
      <td valign="middle" class="td1">
        <p class="p8"><b>Description</b></p>
      </td>
    </tr>
    <tr>
      <td valign="middle" class="td1">
        <p class="p8"><b>0</b></p>
      </td>
      <td valign="middle" class="td1">
        <p class="p8">Data were entered by a single person without supervision or checking. No evidence that labels, diagnoses, or responses were reviewed for correctness.<span class="Apple-converted-space"> </span></p>
      </td>
    </tr>
    <tr>
      <td valign="middle" class="td1">
        <p class="p8"><b>1</b></p>
      </td>
      <td valign="middle" class="td1">
        <p class="p8">Occasional or informal checking by another person, but no written record of who checked or what was corrected.<span class="Apple-converted-space"> </span></p>
      </td>
    </tr>
    <tr>
      <td valign="middle" class="td1">
        <p class="p8"><b>2</b></p>
      </td>
      <td valign="middle" class="td1">
        <p class="p8">Two people have reviewed at least some records, discussed differences informally, but without recording results.<span class="Apple-converted-space"> </span></p>
      </td>
    </tr>
    <tr>
      <td valign="middle" class="td1">
        <p class="p8"><b>3</b></p>
      </td>
      <td valign="middle" class="td1">
        <p class="p8">Most records reviewed independently by two trained persons; disagreements settled by a senior reviewer. Records of corrections exist.<span class="Apple-converted-space"> </span></p>
      </td>
    </tr>
    <tr>
      <td valign="middle" class="td1">
        <p class="p8"><b>4</b></p>
      </td>
      <td valign="middle" class="td1">
        <p class="p8">A well-defined double-review system used for all data. Agreement consistently high (>80%). Correction logs and reviewer names recorded.<span class="Apple-converted-space"> </span></p>
      </td>
    </tr>
  </tbody>
</table>
<p class="p11"><br></p>
<p class="p15"><b>2. Metadata Completeness</b></p>
<table cellspacing="0" cellpadding="0" class="t1">
  <tbody>
    <tr>
      <td valign="middle" class="td1">
        <p class="p8"><b>Score</b></p>
      </td>
      <td valign="middle" class="td1">
        <p class="p8"><b>Description</b></p>
      </td>
    </tr>
    <tr>
      <td valign="middle" class="td1">
        <p class="p8"><b>0</b></p>
      </td>
      <td valign="middle" class="td1">
        <p class="p8">Only a file name or title; no information about creator, location, or date.<span class="Apple-converted-space"> </span></p>
      </td>
    </tr>
    <tr>
      <td valign="middle" class="td1">
        <p class="p8"><b>1</b></p>
      </td>
      <td valign="middle" class="td1">
        <p class="p8">Basic details such as project title, collection site, or month are present but not standardized. Contact person unknown.</p>
      </td>
    </tr>
    <tr>
      <td valign="middle" class="td1">
        <p class="p8"><b>2</b></p>
      </td>
      <td valign="middle" class="td1">
        <p class="p8">Dataset includes structured description (who, what, when, where). A contact person or institutional email is listed.<span class="Apple-converted-space"> </span></p>
      </td>
    </tr>
    <tr>
      <td valign="middle" class="td1">
        <p class="p8"><b>3</b></p>
      </td>
      <td valign="middle" class="td1">
        <p class="p8">Metadata include keywords, version number, and institutional identifiers (ORCID, grant, or project code).<span class="Apple-converted-space"> </span></p>
      </td>
    </tr>
    <tr>
      <td valign="middle" class="td1">
        <p class="p8"><b>4</b></p>
      </td>
      <td valign="middle" class="td1">
        <p class="p8">Full metadata available with DOI or handle, funding information, and cross-reference to related outputs. Machine-readable metadata (e.g., JSON/XML) exist for indexing or repository upload.</p>
      </td>
    </tr>
  </tbody>
</table>
<p class="p11"><br></p>
<p class="p15"><b>3. Documentation & User Guidance</b></p>
<table cellspacing="0" cellpadding="0" class="t1">
  <tbody>
    <tr>
      <td valign="middle" class="td1">
        <p class="p8"><b>Score</b></p>
      </td>
      <td valign="middle" class="td1">
        <p class="p8"><b>Description</b></p>
      </td>
    </tr>
    <tr>
      <td valign="middle" class="td1">
        <p class="p8"><b>0</b></p>
      </td>
      <td valign="middle" class="td1">
        <p class="p8">No documentation. Only data files exist. External users would not understand columns or measurement units.</p>
      </td>
    </tr>
    <tr>
      <td valign="middle" class="td1">
        <p class="p8"><b>1</b></p>
      </td>
      <td valign="middle" class="td1">
        <p class="p8">A short note or document explains variables but lacks collection methods, consent, or cleaning steps.<span class="Apple-converted-space"> </span></p>
      </td>
    </tr>
    <tr>
      <td valign="middle" class="td1">
        <p class="p8"><b>2</b></p>
      </td>
      <td valign="middle" class="td1">
        <p class="p8">Variable definitions, measurement methods, and consent statements included. Users can read and interpret values correctly.</p>
      </td>
    </tr>
    <tr>
      <td valign="middle" class="td1">
        <p class="p8"><b>3</b></p>
      </td>
      <td valign="middle" class="td1">
        <p class="p8">Clear SOPs or manuals, change logs, and limitation notes are attached. Users can replicate data processing confidently.</p>
      </td>
    </tr>
    <tr>
      <td valign="middle" class="td1">
        <p class="p8"><b>4</b></p>
      </td>
      <td valign="middle" class="td1">
        <p class="p8">Complete guide with examples, diagrams, and data-use policy publicly accessible. Allows immediate understanding and reuse by external researchers.</p>
      </td>
    </tr>
  </tbody>
</table>
<p class="p11"><br></p>
<p class="p15"><b>4. Population Representativeness</b></p>
<table cellspacing="0" cellpadding="0" class="t1">
  <tbody>
    <tr>
      <td valign="middle" class="td1">
        <p class="p8"><b>Score</b></p>
      </td>
      <td valign="middle" class="td1">
        <p class="p8"><b>Description</b></p>
      </td>
    </tr>
    <tr>
      <td valign="middle" class="td1">
        <p class="p8"><b>0</b></p>
      </td>
      <td valign="middle" class="td1">
        <p class="p8">Source population unclear. Data may come from a small convenience sample or single location.</p>
      </td>
    </tr>
    <tr>
      <td valign="middle" class="td1">
        <p class="p8"><b>1</b></p>
      </td>
      <td valign="middle" class="td1">
        <p class="p8">Contains demographic fields (age, sex, location) but from one facility or group. Limited diversity and external validity.</p>
      </td>
    </tr>
    <tr>
      <td valign="middle" class="td1">
        <p class="p8"><b>2</b></p>
      </td>
      <td valign="middle" class="td1">
        <p class="p8">Includes records from multiple sites or regions, covering varied demographics but no balance or gap analysis performed.</p>
      </td>
    </tr>
    <tr>
      <td valign="middle" class="td1">
        <p class="p8"><b>3</b></p>
      </td>
      <td valign="middle" class="td1">
        <p class="p8">Dataset includes a summary table comparing actual vs target enrolment for age, sex, or geography; imbalances documented.</p>
      </td>
    </tr>
    <tr>
      <td valign="middle" class="td1">
        <p class="p8"><b>4</b></p>
      </td>
      <td valign="middle" class="td1">
        <p class="p8">Representativeness periodically reviewed (e.g., quarterly). Under-represented groups flagged and corrections attempted. Provides evidence of true diversity.</p>
      </td>
    </tr>
  </tbody>
</table>
<p class="p11"><br></p>
<p class="p15"><b>5. Data Structure & Interoperability</b></p>
<table cellspacing="0" cellpadding="0" class="t1">
  <tbody>
    <tr>
      <td valign="middle" class="td1">
        <p class="p8"><b>Score</b></p>
      </td>
      <td valign="middle" class="td1">
        <p class="p8"><b>Description</b></p>
      </td>
    </tr>
    <tr>
      <td valign="middle" class="td1">
        <p class="p8"><b>0</b></p>
      </td>
      <td valign="middle" class="td1">
        <p class="p8">Raw spreadsheets or text files with inconsistent headers; frequent manual errors. Not machine-readable.</p>
      </td>
    </tr>
    <tr>
      <td valign="middle" class="td1">
        <p class="p8"><b>1</b></p>
      </td>
      <td valign="middle" class="td1">
        <p class="p8">Partial structure; column names partially standardized but inconsistent across sheets or sites.</p>
      </td>
    </tr>
    <tr>
      <td valign="middle" class="td1">
        <p class="p8"><b>2</b></p>
      </td>
      <td valign="middle" class="td1">
        <p class="p8">Mapped to recognized structure/standard (e.g., ABDM, FHIR, DICOM, WHO templates) with some missing elements.</p>
      </td>
    </tr>
    <tr>
      <td valign="middle" class="td1">
        <p class="p8"><b>3</b></p>
      </td>
      <td valign="middle" class="td1">
        <p class="p8">All essential fields filled; logical consistency verified (e.g., no impossible ages). Fit for database import or analysis.</p>
      </td>
    </tr>
    <tr>
      <td valign="middle" class="td1">
        <p class="p8"><b>4</b></p>
      </td>
      <td valign="middle" class="td1">
        <p class="p8">Dataset passes automatic validator or schema checks. Can move between systems without error or data loss.</p>
      </td>
    </tr>
  </tbody>
</table>
<p class="p11"><br></p>
<p class="p15"><b>6. AI / Analytics Readiness</b></p>
<table cellspacing="0" cellpadding="0" class="t1">
  <tbody>
    <tr>
      <td valign="middle" class="td1">
        <p class="p8"><b>Score</b></p>
      </td>
      <td valign="middle" class="td1">
        <p class="p8"><b>Description</b></p>
      </td>
    </tr>
    <tr>
      <td valign="middle" class="td1">
        <p class="p8"><b>0</b></p>
      </td>
      <td valign="middle" class="td1">
        <p class="p8">Data raw, uncleaned, and may include duplicates or outliers. Unsuitable for modelling or statistics.</p>
      </td>
    </tr>
    <tr>
      <td valign="middle" class="td1">
        <p class="p8"><b>1</b></p>
      </td>
      <td valign="middle" class="td1">
        <p class="p8">Cleaned but not documented; same individuals may appear twice. Splitting for training/testing unclear.</p>
      </td>
    </tr>
    <tr>
      <td valign="middle" class="td1">
        <p class="p8"><b>2</b></p>
      </td>
      <td valign="middle" class="td1">
        <p class="p8">Clear record IDs, duplicates removed, training/test or analysis subsets defined. Reliable for basic model training.</p>
      </td>
    </tr>
    <tr>
      <td valign="middle" class="td1">
        <p class="p8"><b>3</b></p>
      </td>
      <td valign="middle" class="td1">
        <p class="p8">Benchmark dataset created; fairness checks across key subgroups performed. Basic drift review done.</p>
      </td>
    </tr>
    <tr>
      <td valign="middle" class="td1">
        <p class="p8"><b>4</b></p>
      </td>
      <td valign="middle" class="td1">
        <p class="p8">Dataset re-audited periodically by an external reviewer; stability and reproducibility confirmed. Ready for long-term AI evaluation.</p>
      </td>
    </tr>
  </tbody>
</table>
<p class="p11"><br></p>
<p class="p15"><b>7. Privacy & Identifiability</b></p>
<table cellspacing="0" cellpadding="0" class="t1">
  <tbody>
    <tr>
      <td valign="middle" class="td1">
        <p class="p8"><b>Score</b></p>
      </td>
      <td valign="middle" class="td1">
        <p class="p8"><b>Description</b></p>
      </td>
    </tr>
    <tr>
      <td valign="middle" class="td1">
        <p class="p8"><b>0</b></p>
      </td>
      <td valign="middle" class="td1">
        <p class="p8">Direct identifiers—such as names, mobile numbers, Aadhaar, or GPS coordinates—remain visible. No anonymization steps have been documented. Privacy not protected.</p>
      </td>
    </tr>
    <tr>
      <td valign="middle" class="td1">
        <p class="p8"><b>1</b></p>
      </td>
      <td valign="middle" class="td1">
        <p class="p8">Obvious identifiers were removed, but there is no formal review of residual risk. Rare combinations of fields could still reveal individuals.<span class="Apple-converted-space"> </span></p>
      </td>
    </tr>
    <tr>
      <td valign="middle" class="td1">
        <p class="p8"><b>2</b></p>
      </td>
      <td valign="middle" class="td1">
        <p class="p8">Explicit anonymization performed following internal SOPs. Potentially identifying variables were generalized or masked. A qualitative note estimates remaining risk.</p>
      </td>
    </tr>
    <tr>
      <td valign="middle" class="td1">
        <p class="p8"><b>3</b></p>
      </td>
      <td valign="middle" class="td1">
        <p class="p8">Independent reviewer confirmed anonymization quality using the PRS-Lite calculator. Privacy risk numerically recorded and archived. No visible traces of identity remain.</p>
      </td>
    </tr>
    <tr>
      <td valign="middle" class="td1">
        <p class="p8"><b>4</b></p>
      </td>
      <td valign="middle" class="td1">
        <p class="p8">Formal re-identification simulation conducted on sample records. Success probability below one percent. Statistical disclosure control verified. Dataset certified low-risk for identity disclosure.</p>
      </td>
    </tr>
  </tbody>
</table>
<p class="p11"><br></p>
<p class="p15"><b>8. Security & Access Governance</b></p>
<table cellspacing="0" cellpadding="0" class="t1">
  <tbody>
    <tr>
      <td valign="middle" class="td1">
        <p class="p8"><b>Score</b></p>
      </td>
      <td valign="middle" class="td1">
        <p class="p8"><b>Description</b></p>
      </td>
    </tr>
    <tr>
      <td valign="middle" class="td1">
        <p class="p8"><b>0</b></p>
      </td>
      <td valign="middle" class="td1">
        <p class="p8">Data stored on personal drives or external devices without encryption. Multiple unauthorized copies exist. No record of who accessed or modified files.</p>
      </td>
    </tr>
    <tr>
      <td valign="middle" class="td1">
        <p class="p8"><b>1</b></p>
      </td>
      <td valign="middle" class="td1">
        <p class="p8">Password protection or folder permissions/access privileges applied but never reviewed. No backups tested. Security depends on individual users rather than institutional oversight.</p>
      </td>
    </tr>
    <tr>
      <td valign="middle" class="td1">
        <p class="p8"><b>2</b></p>
      </td>
      <td valign="middle" class="td1">
        <p class="p8">List of authorized users maintained; passwords and access reviewed periodically. Routine backups stored securely. Dataset meets minimal organizational security. Documentation exists but enforcement inconsistent.</p>
      </td>
    </tr>
    <tr>
      <td valign="middle" class="td1">
        <p class="p8"><b>3</b></p>
      </td>
      <td valign="middle" class="td1">
        <p class="p8">Written data-security policy implemented. Backups and Access logs reviewed periodically. Role-based permissions enforced through IT system. Dataset protected by both administrative and technical controls consistent with national health-data guidelines.</p>
      </td>
    </tr>
    <tr>
      <td valign="middle" class="td1">
        <p class="p8"><b>4</b></p>
      </td>
      <td valign="middle" class="td1">
        <p class="p8">Comprehensive security governance in place: encryption at rest, detailed audit trails, breach-response playbook tested through drills. Independent security audit completed with actionable recommendations. Dataset classified, monitored, and resilient against internal or external compromise.</p>
      </td>
    </tr>
  </tbody>
</table>
<p class="p11"><br></p>
<p class="p15"><b>9. Provenance & Workflow Transparency</b></p>
<table cellspacing="0" cellpadding="0" class="t1">
  <tbody>
    <tr>
      <td valign="middle" class="td1">
        <p class="p8"><b>Score</b></p>
      </td>
      <td valign="middle" class="td1">
        <p class="p8"><b>Description</b></p>
      </td>
    </tr>
    <tr>
      <td valign="middle" class="td1">
        <p class="p8"><b>0</b></p>
      </td>
      <td valign="middle" class="td1">
        <p class="p8">No information on how the dataset was assembled or cleaned. Raw and final versions indistinguishable. Future users cannot reconstruct processing steps.</p>
      </td>
    </tr>
    <tr>
      <td valign="middle" class="td1">
        <p class="p8"><b>1</b></p>
      </td>
      <td valign="middle" class="td1">
        <p class="p8">General description exists—such as "data cleaned in Excel"—but lacks detailed steps, version numbers, or responsible personnel. Transformation history incomplete.</p>
      </td>
    </tr>
    <tr>
      <td valign="middle" class="td1">
        <p class="p8"><b>2</b></p>
      </td>
      <td valign="middle" class="td1">
        <p class="p8">Processing steps described in a written SOP or analytical script. Each stage—import, cleaning, merging—documented. Versions are manually tracked.</p>
      </td>
    </tr>
    <tr>
      <td valign="middle" class="td1">
        <p class="p8"><b>3</b></p>
      </td>
      <td valign="middle" class="td1">
        <p class="p8">All scripts, software versions, and dependencies archived together. Processing reproducible end-to-end using container or workflow system. Each update creates a new version.</p>
      </td>
    </tr>
    <tr>
      <td valign="middle" class="td1">
        <p class="p8"><b>4</b></p>
      </td>
      <td valign="middle" class="td1">
        <p class="p8">Independent rerun using provided package and reproduced identical results. Dataset has complete provenance chain and qualifies as fully reproducible scientific asset.</p>
      </td>
    </tr>
  </tbody>
</table>
<p class="p15"><b>10. Ethical & Social Accountability</b></p>
<table cellspacing="0" cellpadding="0" class="t1">
  <tbody>
    <tr>
      <td valign="middle" class="td1">
        <p class="p8"><b>Score</b></p>
      </td>
      <td valign="middle" class="td1">
        <p class="p8"><b>Description</b></p>
      </td>
    </tr>
    <tr>
      <td valign="middle" class="td1">
        <p class="p8"><b>0</b></p>
      </td>
      <td valign="middle" class="td1">
        <p class="p8">Dataset lacks any ethics-committee approval or documented consent. Its use may violate participant rights. Release or analysis prohibited until compliance verified.</p>
      </td>
    </tr>
    <tr>
      <td valign="middle" class="td1">
        <p class="p8"><b>1</b></p>
      </td>
      <td valign="middle" class="td1">
        <p class="p8">Formal ethics or administrative clearance available, but participants were not informed about data reuse or potential risks. Ethical compliance minimal</p>
      </td>
    </tr>
    <tr>
      <td valign="middle" class="td1">
        <p class="p8"><b>2</b></p>
      </td>
      <td valign="middle" class="td1">
        <p class="p8">Participants or community representatives informed about intended data uses and privacy measures. A contact person for complaints or withdrawal requests designated.</p>
      </td>
    </tr>
    <tr>
      <td valign="middle" class="td1">
        <p class="p8"><b>3</b></p>
      </td>
      <td valign="middle" class="td1">
        <p class="p8">Dataset reviewed for equity, gender, and vulnerable-group impact. Steps taken to prevent misuse or bias. Grievance and redress records maintained.</p>
      </td>
    </tr>
    <tr>
      <td valign="middle" class="td1">
        <p class="p8"><b>4</b></p>
      </td>
      <td valign="middle" class="td1">
        <p class="p8">Public report or community feedback summary released. Ethical outcomes reviewed annually.<span class="Apple-converted-space"> </span></p>
      </td>
    </tr>
  </tbody>
</table>
<p class="p11"><br></p>
<p class="p15"><b>11. Synthetic / Simulated Data (if applicable)</b></p>
<table cellspacing="0" cellpadding="0" class="t1">
  <tbody>
    <tr>
      <td valign="middle" class="td1">
        <p class="p8"><b>Score</b></p>
      </td>
      <td valign="middle" class="td1">
        <p class="p8"><b>Description</b></p>
      </td>
    </tr>
    <tr>
      <td valign="middle" class="td1">
        <p class="p8"><b>0</b></p>
      </td>
      <td valign="middle" class="td1">
        <p class="p8">No information provided, OR data labelled 'synthetic' without supporting explanation.</p>
      </td>
    </tr>
    <tr>
      <td valign="middle" class="td1">
        <p class="p8"><b>1</b></p>
      </td>
      <td valign="middle" class="td1">
        <p class="p8">Synthetic dataset compared to real data using simple summaries (mean, SD, frequencies) but utility or privacy not verified. </p>
      </td>
    </tr>
    <tr>
      <td valign="middle" class="td1">
        <p class="p8"><b>2</b></p>
      </td>
      <td valign="middle" class="td1">
        <p class="p8">Statistical and analytic behaviors of synthetic and real data match within acceptable range. Basic similarity analysis done.</p>
      </td>
    </tr>
    <tr>
      <td valign="middle" class="td1">
        <p class="p8"><b>3</b></p>
      </td>
      <td valign="middle" class="td1">
        <p class="p8">Both utility and privacy tests performed. Memorization risk ≤5%. Synthetic dataset reproduces key relationships without containing identifiable individuals.</p>
      </td>
    </tr>
    <tr>
      <td valign="middle" class="td1">
        <p class="p8"><b>4</b></p>
      </td>
      <td valign="middle" class="td1">
        <p class="p8">Multiple independent privacy and fidelity audits show <1% re-identification potential. Synthetic generator documented; random seed archived. Dataset formally certified privacy-preserving</p>
      </td>
    </tr>
  </tbody>
</table>
<p class="p11"><br></p>
<p class="p15"><b>12. Stewardship & Governance</b></p>
<table cellspacing="0" cellpadding="0" class="t1">
  <tbody>
    <tr>
      <td valign="middle" class="td1">
        <p class="p8"><b>Score</b></p>
      </td>
      <td valign="middle" class="td1">
        <p class="p8"><b>Description</b></p>
      </td>
    </tr>
    <tr>
      <td valign="middle" class="td1">
        <p class="p8"><b>0</b></p>
      </td>
      <td valign="middle" class="td1">
        <p class="p8">No named custodian or data-protection oversight. Ownership unclear; dataset unmanaged after creation.</p>
      </td>
    </tr>
    <tr>
      <td valign="middle" class="td1">
        <p class="p8"><b>1</b></p>
      </td>
      <td valign="middle" class="td1">
        <p class="p8">Custodian identified but responsibilities undefined. Governance relies on individual rather than system. High continuity risk if personnel change.</p>
      </td>
    </tr>
    <tr>
      <td valign="middle" class="td1">
        <p class="p8"><b>2</b></p>
      </td>
      <td valign="middle" class="td1">
        <p class="p8">Data-processing register (what, why, where stored) exists. Data-protection impact assessment completed. Compliance documentation traceable.</p>
      </td>
    </tr>
    <tr>
      <td valign="middle" class="td1">
        <p class="p8"><b>3</b></p>
      </td>
      <td valign="middle" class="td1">
        <p class="p8">Governance reviewed periodically; metrics such as access requests and incident logs tracked.<span class="Apple-converted-space"> </span></p>
      </td>
    </tr>
    <tr>
      <td valign="middle" class="td1">
        <p class="p8"><b>4</b></p>
      </td>
      <td valign="middle" class="td1">
        <p class="p8">Independent audit evaluated governance framework; deficiencies corrected. Public statement or report shared. Dataset demonstrates accountability with data-protection law.</p>
      </td>
    </tr>
  </tbody>
</table>
<p class="p11"><br></p>
<p class="p15"><b>13. Model Linkage Integrity</b></p>
<table cellspacing="0" cellpadding="0" class="t1">
  <tbody>
    <tr>
      <td valign="middle" class="td1">
        <p class="p8"><b>Score</b></p>
      </td>
      <td valign="middle" class="td1">
        <p class="p8"><b>Description</b></p>
      </td>
    </tr>
    <tr>
      <td valign="middle" class="td1">
        <p class="p8"><b>0</b></p>
      </td>
      <td valign="middle" class="td1">
        <p class="p8">AI or statistical models derived from this dataset lack any trace of which data version was used. Replication impossible.</p>
      </td>
    </tr>
    <tr>
      <td valign="middle" class="td1">
        <p class="p8"><b>1</b></p>
      </td>
      <td valign="middle" class="td1">
        <p class="p8">Approximate link noted informally in documentation but not verifiable. Potential mismatch between data and model versions.</p>
      </td>
    </tr>
    <tr>
      <td valign="middle" class="td1">
        <p class="p8"><b>2</b></p>
      </td>
      <td valign="middle" class="td1">
        <p class="p8">File-version mapping table maintained showing which data builds each model. Traceability achievable but not automated.</p>
      </td>
    </tr>
    <tr>
      <td valign="middle" class="td1">
        <p class="p8"><b>3</b></p>
      </td>
      <td valign="middle" class="td1">
        <p class="p8">Dataset and model both digitally fingerprinted (hash/ checksum). Link confirmed programmatically before release. Prevents accidental mismatch.</p>
      </td>
    </tr>
    <tr>
      <td valign="middle" class="td1">
        <p class="p8"><b>4</b></p>
      </td>
      <td valign="middle" class="td1">
        <p class="p8">Automated verification of dataset hash before every model training or deployment. Chain-of-custody complete. Ensures scientific and regulatory integrity for downstream use.</p>
      </td>
    </tr>
  </tbody>
</table>
<p class="p11"><br></p>
<p class="p15"><b>14. Environmental Sustainability</b></p>
<table cellspacing="0" cellpadding="0" class="t1">
  <tbody>
    <tr>
      <td valign="middle" class="td1">
        <p class="p8"><b>Score</b></p>
      </td>
      <td valign="middle" class="td1">
        <p class="p8"><b>Description</b></p>
      </td>
    </tr>
    <tr>
      <td valign="middle" class="td1">
        <p class="p8"><b>0</b></p>
      </td>
      <td valign="middle" class="td1">
        <p class="p8">No awareness or record of energy consumption or storage load. Computational cost ignored entirely.</p>
      </td>
    </tr>
    <tr>
      <td valign="middle" class="td1">
        <p class="p8"><b>1</b></p>
      </td>
      <td valign="middle" class="td1">
        <p class="p8">General acknowledgement of resource use but no quantitative tracking. No optimization or recycling actions documented.</p>
      </td>
    </tr>
    <tr>
      <td valign="middle" class="td1">
        <p class="p8"><b>2</b></p>
      </td>
      <td valign="middle" class="td1">
        <p class="p8">Approximate compute hours, storage space, or carbon estimate recorded for key processes. Encourages mindful management though goals not formalized.</p>
      </td>
    </tr>
    <tr>
      <td valign="middle" class="td1">
        <p class="p8"><b>3</b></p>
      </td>
      <td valign="middle" class="td1">
        <p class="p8">Reduction targets set (for compute, duplication, retention). Actions such as data archiving or hardware consolidation logged and reviewed.</p>
      </td>
    </tr>
    <tr>
      <td valign="middle" class="td1">
        <p class="p8"><b>4</b></p>
      </td>
      <td valign="middle" class="td1">
        <p class="p8">Independent or internal sustainability audit conducted; results publicly shared. Dataset operations meet institutional "green computing" or ISO-aligned benchmarks.</p>
      </td>
    </tr>
  </tbody>
</table>
<p class="p11"><br></p>
<p class="p15"><b>15. Continuous Curation & Feedback</b></p>
<table cellspacing="0" cellpadding="0" class="t1">
  <tbody>
    <tr>
      <td valign="middle" class="td1">
        <p class="p8"><b>Score</b></p>
      </td>
      <td valign="middle" class="td1">
        <p class="p8"><b>Description</b></p>
      </td>
    </tr>
    <tr>
      <td valign="middle" class="td1">
        <p class="p8"><b>0</b></p>
      </td>
      <td valign="middle" class="td1">
        <p class="p8">Dataset frozen after initial creation; no mechanism for update or user correction. Quickly becomes outdated or inconsistent with field reality.</p>
      </td>
    </tr>
    <tr>
      <td valign="middle" class="td1">
        <p class="p8"><b>1</b></p>
      </td>
      <td valign="middle" class="td1">
        <p class="p8">Updates occur irregularly when staff remember or users complain. No written schedule; changes undocumented.</p>
      </td>
    </tr>
    <tr>
      <td valign="middle" class="td1">
        <p class="p8"><b>2</b></p>
      </td>
      <td valign="middle" class="td1">
        <p class="p8">Formal release cycle (monthly, quarterly, annually) defined. Issue log records problems and resolutions. Demonstrates active curation mindset.</p>
      </td>
    </tr>
    <tr>
      <td valign="middle" class="td1">
        <p class="p8"><b>3</b></p>
      </td>
      <td valign="middle" class="td1">
        <p class="p8">Update adherence exceeds 90% of schedule. User queries or corrections acknowledged within defined timeframe. Dataset remains timely and credible.</p>
      </td>
    </tr>
    <tr>
      <td valign="middle" class="td1">
        <p class="p8"><b>4</b></p>
      </td>
      <td valign="middle" class="td1">
        <p class="p8">Automated freshness monitoring and change tracking integrated. Standing advisory committee reviews metrics and user feedback each cycle. Dataset exhibits living, self-correcting governance model.</p>
      </td>
    </tr>
  </tbody>
</table>
<p class="p11"><br></p>
<p class="p17"></p>
<p class="p8"><b>SECTION – C</b></p>
<p class="p19">Annexure - I</p>
<p class="p15"><b>PRS-Lite (Privacy-Risk Score for Collected Data)</b></p>
<p class="p15"><i>(Two questions; score 0–100 → Low / Moderate / High / Very High)</i></p>
<p class="p15"><b>Step 1 – Identification Risk (0–50)</b></p>
<ul class="ul1">
  <li class="li15"><b>50</b> – Names, phone numbers, IDs, GPS or full DOB still visible; easily traceable individuals.</li>
  <li class="li15"><b>30</b> – Identifiers removed but unique event combinations could reveal identity (rare disease + village + date).</li>
  <li class="li15"><b>15</b> – Only coarse info (age, sex, district, month); re-identification hard but not impossible.</li>
  <li class="li15"><b>5</b> – Generalized categories (age bands, state, quarter); identities effectively hidden.</li>
  <li class="li15"><b>0</b> – Only aggregated counts; no individual rows.</li>
</ul>
<p class="p15"><b>Step 2 – Sensitivity / Harm Multiplier</b></p>
<ul class="ul1">
  <li class="li15"><b>1.0 – Routine / Low Harm</b> – Non-stigmatizing, routine data like vitals or service utilization.</li>
  <li class="li15"><b>1.5 – High Stigma / Personal Impact</b> – TB, HIV, reproductive, mental-health, genomic, caste/tribe, violence, or undocumented status.</li>
  <li class="li15"><b>2.0 – Critical / Safety-Sensitive</b> – Forensic, detainee, conflict, tribal GPS, refugee, or protest-related health records.</li>
</ul>
<p class="p15"><b>Step 3 – Compute PRS-Lite</b></p>
<div class="equation-block">
  <div class="equation equation--compact">PRS = round (Identification Risk × Multiplier)</div>
  <div class="equation-note">(capped at 100)</div>
</div>
<p class="p15"><b>Step 4 – Risk Band</b></p>
<table cellspacing="0" cellpadding="0" class="t1">
  <tbody>
    <tr>
      <td valign="middle" class="td1">
        <p class="p8"><b>PRS</b></p>
      </td>
      <td valign="middle" class="td1">
        <p class="p8"><b>Band</b></p>
      </td>
      <td valign="middle" class="td1">
        <p class="p8"><b>Interpretation</b></p>
      </td>
    </tr>
    <tr>
      <td valign="middle" class="td1">
        <p class="p8">0–15</p>
      </td>
      <td valign="middle" class="td1">
        <p class="p8">Low</p>
      </td>
      <td valign="middle" class="td1">
        <p class="p8">Minimal re-identification or harm risk.</p>
      </td>
    </tr>
    <tr>
      <td valign="middle" class="td1">
        <p class="p8">16–40</p>
      </td>
      <td valign="middle" class="td1">
        <p class="p8">Moderate</p>
      </td>
      <td valign="middle" class="td1">
        <p class="p8">Manageable risk; requires controlled sharing.</p>
      </td>
    </tr>
    <tr>
      <td valign="middle" class="td1">
        <p class="p8">41–70</p>
      </td>
      <td valign="middle" class="td1">
        <p class="p8">High</p>
      </td>
      <td valign="middle" class="td1">
        <p class="p8">Substantial privacy concern; restrict use.</p>
      </td>
    </tr>
    <tr>
      <td valign="middle" class="td1">
        <p class="p8">71–100</p>
      </td>
      <td valign="middle" class="td1">
        <p class="p8">Very High</p>
      </td>
      <td valign="middle" class="td1">
        <p class="p8">Serious risk; share only aggregated results.</p>
      </td>
    </tr>
  </tbody>
</table>
<p class="p20"><br></p>
`;
