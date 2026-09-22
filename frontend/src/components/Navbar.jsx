import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { clearTokens, getAccessToken, isAdmin } from "../lib/auth";
import "./Navbar.css";

function ThemeIcon({ darkMode }) {
  return darkMode ? (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5 8.5 8.5 0 1 0 20.5 14.2Z" />
    </svg>
  );
}

function MenuIcon({ open }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {open ? (
        <path d="m6 6 12 12M18 6 6 18" />
      ) : (
        <path d="M4 7h16M4 12h16M4 17h16" />
      )}
    </svg>
  );
}

function Navbar() {
  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  useLocation();
  const loggedIn = Boolean(getAccessToken());
  const admin = isAdmin();
  const closeMenu = () => setMenuOpen(false);
  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle("dark");
  };
  const logout = () => {
    clearTokens();
    closeMenu();
    navigate("/");
  };

  return (
    <nav className="site-nav">
      <div className="nav-content">
        <Link to="/" className="brand" onClick={closeMenu}>
          <span className="brand-name">CodeBlogs</span>
          <span className="brand-subtitle">
            Personal &amp; Public Coding Development Journal
          </span>
        </Link>
        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
        >
          <MenuIcon open={menuOpen} />
        </button>
        <div className={`nav-links ${menuOpen ? "nav-links-open" : ""}`}>
          <NavLink to="/" end onClick={closeMenu}>
            Home
          </NavLink>
          <NavLink to="/blogs" onClick={closeMenu}>
            Dispatches
          </NavLink>
          <NavLink to="/articles" onClick={closeMenu}>
            Articles
          </NavLink>
          {loggedIn ? (
            <>
              <NavLink
                className="nav-write"
                to="/create-blog"
                onClick={closeMenu}
              >
                Write a dispatch
              </NavLink>
              {admin && (
                <NavLink to="/create-article" onClick={closeMenu}>
                  Create Article
                </NavLink>
              )}
              <button className="nav-logout" onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink className="nav-login" to="/login" onClick={closeMenu}>
                Login
              </NavLink>
              <NavLink
                className="nav-register"
                to="/register"
                onClick={closeMenu}
              >
                Register
              </NavLink>
            </>
          )}
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
          >
            <ThemeIcon darkMode={darkMode} />
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
