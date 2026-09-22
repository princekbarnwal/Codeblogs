import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
import "./Navbar.css";
function Navbar() {
  const [darkMode, setDarkMode] = useState(false);
  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle("dark");
  };
  return (
    <nav className="site-nav">
      <div className="nav-content">
        <Link to="/" className="brand">
          <span className="brand-name">CodeBlogs</span>
          <span className="brand-subtitle">
            Personal &amp; Public Coding Development Journal
          </span>
        </Link>
        <div className="nav-links">
          <NavLink to="/" end>
            Home
          </NavLink>
          <NavLink to="/blogs">Dispatches</NavLink>
          <NavLink to="/articles">Articles</NavLink>
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
          >
            {darkMode ? "Sun" : "Moon"}
          </button>
        </div>
      </div>
    </nav>
  );
}
export default Navbar;
