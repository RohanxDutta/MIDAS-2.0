import Link from 'next/link';

export function PortalNav() {
  return (
    <nav>
      <Link href="/" className="nav-left">
        <img className="nav-logo-img" src="/logo.svg" alt="ICMR Logo" />
        <div className="nav-divider"></div>
        <div className="nav-title-group">
          <span className="nav-title">MIDAS 2.0</span>
          <span className="nav-subtitle">Framework Overview</span>
        </div>
      </Link>
      <div className="nav-right">
        <span className="nav-btn nav-btn-outline">
          Delphi Proposal
        </span>
        <Link href="/lite-version" className="nav-btn nav-btn-outline">
          Lite Version Framework
        </Link>
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
