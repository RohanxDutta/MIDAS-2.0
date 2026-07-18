import Link from 'next/link';

export function PortalNav() {
  return (
    <nav>
      <div className="nav-left">
        <img className="nav-logo-img" src="/logo.svg" alt="ICMR Logo" />
        <div className="nav-divider"></div>
        <div className="nav-title-group">
          <span className="nav-title">MIDAS 2.0</span>
          <span className="nav-subtitle">Framework Overview</span>
        </div>
      </div>
      <div className="nav-right">
        <span className="nav-btn nav-btn-outline">
          Delphi Proposal
        </span>
        <a
          href="https://midas.icmr.org.in/lite_version/"
          target="_blank"
          rel="noopener noreferrer"
          className="nav-btn nav-btn-outline"
        >
          Lite Version Framework
        </a>
        <span className="nav-btn nav-btn-outline">
          Technical Version Framework
        </span>
        <span className="nav-btn nav-btn-outline">
          Expert Registration
        </span>
        <Link href="/login" className="nav-btn nav-btn-outline">
          Expert Login
        </Link>
      </div>
    </nav>
  );
}
