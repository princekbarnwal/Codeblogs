import { Link, NavLink } from "react-router-dom";

import { useEffect, useState } from "react";

import {
    getAccessToken,
    getCurrentUser,
    isAdmin
} from "../lib/auth";

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

    const [loggedIn, setLoggedIn] = useState(
        Boolean(getAccessToken())
    );

    const [admin, setAdmin] = useState(isAdmin());

    const [currentUser, setCurrentUser] = useState(
        getCurrentUser()
    );

    const closeMenu = () => setMenuOpen(false);

    // Update Navbar whenever login/logout happens
    useEffect(() => {

        const updateAuth = () => {

            setLoggedIn(
                Boolean(getAccessToken())
            );

            setAdmin(
                isAdmin()
            );

            setCurrentUser(
                getCurrentUser()
            );
        };

        window.addEventListener(
            "authChanged",
            updateAuth
        );

        return () => {

            window.removeEventListener(
                "authChanged",
                updateAuth
            );

        };

    }, []);

    const toggleTheme = () => {

        setDarkMode((prev) => !prev);

        document.body.classList.toggle("dark");

    };

    return (

        <nav className="site-nav">

            <div className="nav-content">

                <Link
                    to="/"
                    className="brand"
                    onClick={closeMenu}
                >

                    <span className="brand-name">
                        CodeBlogs
                    </span>

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

                <div
                    className={`nav-links ${
                        menuOpen ? "nav-links-open" : ""
                    }`}
                >

                    <NavLink
                        to="/"
                        end
                        onClick={closeMenu}
                    >
                        Home
                    </NavLink>

                    <NavLink
                        to="/blogs"
                        onClick={closeMenu}
                    >
                        Dispatches
                    </NavLink>

                    <NavLink
                        to="/articles"
                        onClick={closeMenu}
                    >
                        Articles
                    </NavLink>

                    {loggedIn ? (
                        <>

                            <NavLink
                                to={`/users/${currentUser?.username}`}
                                onClick={closeMenu}
                            >
                                Profile
                            </NavLink>

                            <NavLink
                                className="nav-write"
                                to="/create-blog"
                                onClick={closeMenu}
                            >
                                Write a dispatch
                            </NavLink>

                            {admin && (

                                <NavLink
                                    to="/create-article"
                                    onClick={closeMenu}
                                >
                                    Create Article
                                </NavLink>

                            )}

                        </>
                    ) : (
                        <>

                            <NavLink
                                className="nav-login"
                                to="/login"
                                onClick={closeMenu}
                            >
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