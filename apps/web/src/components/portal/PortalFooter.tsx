export function PortalFooter() {
  return (
    <footer className="!py-3.5 shrink-0">
      <div className="footer-left">
        <img className="footer-logo" src="/logo.svg" alt="ICMR" />
        <p className="footer-text">
          Prepared by the <strong>Division of Development Research</strong>,<br />
          Indian Council of Medical Research (ICMR), New Delhi, India.
        </p>
      </div>
      <div className="footer-right">
        <span className="footer-tag">MIDAS 2.0</span>
        <span className="footer-tag">ICMR</span>
        <span className="footer-tag">Framework Overview</span>
      </div>
    </footer>
  );
}
