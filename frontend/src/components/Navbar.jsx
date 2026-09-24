import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import {
    getAccessToken,
    getCurrentUser,
    isAdmin
} from "../lib/auth";
import "./Navbar.css";

function DockIcon({ type }) {
    if (type === "home") {
        return (
            <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M3 10.5 12 3l9 7.5" />
                <path d="M5.5 9.5V21h13V9.5" />
                <path d="M9.5 21v-6h5v6" />
            </svg>
        );
    }

    if (type === "dispatches") {
        return (
            <svg viewBox="0 0 24 24" aria-hidden="true">
                <rect
                    x="4"
                    y="4"
                    width="16"
                    height="16"
                    rx="2"
                />
                <path d="M8 8h8M8 12h8M8 16h5" />
            </svg>
        );
    }

    if (type === "articles") {
        return (
            <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6 3h9l4 4v14H6z" />
                <path d="M15 3v5h4M9 12h6M9 16h6" />
            </svg>
        );
    }

    if (type === "write") {
        return (
            <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 20h4L19 9l-4-4L4 16v4z" />
                <path d="m13.5 6.5 4 4" />
            </svg>
        );
    }

    if (type === "profile") {
        return (
            <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21c.8-4 3.5-6 8-6s7.2 2 8 6" />
            </svg>
        );
    }

    if (type === "login") {
        return (
            <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M10 4H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h5" />
                <path d="M13 8l4 4-4 4" />
                <path d="M8 12h9" />
            </svg>
        );
    }

    if (type === "register") {
        return (
            <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="9" cy="8" r="4" />
                <path d="M2.5 21c.8-4 3-6 6.5-6s5.7 2 6.5 6" />
                <path d="M18 10v8M14 14h8" />
            </svg>
        );
    }

    if (type === "create-article") {
        return (
            <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5 3h14v18H5z" />
                <path d="M8 7h8M8 11h8M8 15h4" />
                <path d="M17 16v5M14.5 18.5h5" />
            </svg>
        );
    }

    return null;
}

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

function Navbar() {
    const [darkMode, setDarkMode] = useState(false);

    const [loggedIn, setLoggedIn] = useState(
        Boolean(getAccessToken())
    );

    const [admin, setAdmin] = useState(isAdmin());

    const [currentUser, setCurrentUser] = useState(
        getCurrentUser()
    );

    useEffect(() => {
        const updateAuth = () => {
            setLoggedIn(Boolean(getAccessToken()));
            setAdmin(isAdmin());
            setCurrentUser(getCurrentUser());
        };

        window.addEventListener("authChanged", updateAuth);

        return () => {
            window.removeEventListener("authChanged", updateAuth);
        };
    }, []);

    const toggleTheme = () => {
        setDarkMode((prev) => !prev);
        document.body.classList.toggle("dark");
    };

    return (
        <nav className="site-nav">
            <div className="nav-content">
                <div className="nav-links">

                    {/* Home */}
                    <NavLink
                        to="/"
                        end
                        className="dock-item"
                        aria-label="Home"
                    >
                        <DockIcon type="home" />
                        <span className="dock-tooltip">
                            Home
                        </span>
                    </NavLink>


                    {/* Dispatches */}
                    <NavLink
                        to="/blogs"
                        className="dock-item"
                        aria-label="Dispatches"
                    >
                        <DockIcon type="dispatches" />
                        <span className="dock-tooltip">
                            Dispatches
                        </span>
                    </NavLink>


                    {/* Articles */}
                    <NavLink
                        to="/articles"
                        className="dock-item"
                        aria-label="Articles"
                    >
                        <DockIcon type="articles" />
                        <span className="dock-tooltip">
                            Articles
                        </span>
                    </NavLink>


                    {loggedIn ? (
                        <>
                            {/* Profile */}
                            <NavLink
                                to={`/users/${currentUser?.username}`}
                                className="dock-item"
                                aria-label="Profile"
                            >
                                <DockIcon type="profile" />
                                <span className="dock-tooltip">
                                    Profile
                                </span>
                            </NavLink>


                            {/* Write */}
                            <NavLink
                                to="/create-blog"
                                className="dock-item"
                                aria-label="Write a dispatch"
                            >
                                <DockIcon type="write" />
                                <span className="dock-tooltip">
                                    Write
                                </span>
                            </NavLink>


                            {/* Admin */}
                            {admin && (
                                <NavLink
                                    to="/create-article"
                                    className="dock-item"
                                    aria-label="Create article"
                                >
                                    <DockIcon type="create-article" />
                                    <span className="dock-tooltip">
                                        Create Article
                                    </span>
                                </NavLink>
                            )}
                        </>
                    ) : (
                        <>
                            {/* Login */}
                            <NavLink
                                to="/login"
                                className="dock-item"
                                aria-label="Login"
                            >
                                <DockIcon type="login" />
                                <span className="dock-tooltip">
                                    Login
                                </span>
                            </NavLink>


                            {/* Register */}
                            <NavLink
                                to="/register"
                                className="dock-item"
                                aria-label="Register"
                            >
                                <DockIcon type="register" />
                                <span className="dock-tooltip">
                                    Register
                                </span>
                            </NavLink>
                        </>
                    )}


                    {/* Theme */}
                    <button
                        className="theme-toggle dock-item"
                        onClick={toggleTheme}
                        aria-label="Toggle dark mode"
                    >
                        <ThemeIcon darkMode={darkMode} />

                        <span className="dock-tooltip">
                            {darkMode ? "Light Mode" : "Dark Mode"}
                        </span>
                    </button>

                </div>
            </div>
        </nav>
    );
}

export default Navbar;