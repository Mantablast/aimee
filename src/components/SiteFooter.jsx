export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <p className="footer-copy">© {year} Aimee Jesso.</p>
      <a
        className="footer-kofi"
        href="https://ko-fi.com/aimeej"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Support on Ko-fi"
      >
        <img src="/kofi.png" alt="" aria-hidden="true" loading="lazy" />
      </a>
    </footer>
  );
}
