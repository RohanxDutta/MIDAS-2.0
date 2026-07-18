'use client';

import { PortalPageLayout } from './PortalPageLayout';
import { DOCX_HTML } from './lite-content';

export function LiteVersionPage() {
  return (
    <PortalPageLayout>
      <section className="document-hero">
        <div className="container">
          <div className="document-hero-card">
            <div className="document-kicker">DOCUMENT VIEW</div>
            <h1>ICMR MIDAS 2.0 Framework</h1>
            <p>Dataset Quality and Trust Framework (Lite Version)</p>
            <div className="document-meta">
              <span>Uploaded MIDAS 2.0 Lite document</span>
              <span>Portal-styled HTML presentation</span>
            </div>
          </div>
        </div>
      </section>

      <section className="document-shell">
        <div className="container">
          <div className="document-card">
            <div
              className="docx-render"
              dangerouslySetInnerHTML={{ __html: DOCX_HTML }}
            />
          </div>
        </div>
      </section>
    </PortalPageLayout>
  );
}
