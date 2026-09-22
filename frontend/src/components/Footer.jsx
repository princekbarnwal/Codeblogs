import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-top">
          <Link to="/" className="brand">
            <span className="brand-name">CodeBlogs</span>
          </Link>
          <div className="footer-links">
            <Link to="/blogs">Dispatches</Link>
            <Link to="/articles">Archive</Link>
            <Link to="/create-blog">Write a dispatch</Link>
          </div>
        </div>
        <div className="footer-bottom">
          <span>
            (c) 2026 CodeBlogs. A personal and public coding development
            journal.
          </span>
          <span className="footer-mark">Designed for thoughtful reading.</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
