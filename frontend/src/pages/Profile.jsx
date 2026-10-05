import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { API_URL } from "../lib/api";
import {
    clearTokens,
    getCurrentUser,
    getRefreshToken
} from "../lib/auth";

function Profile() {
    const { username } = useParams();
    const navigate = useNavigate();
    const currentUser = getCurrentUser();

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [logoutLoading, setLogoutLoading] = useState(false);

    const isOwner = currentUser?.username === username;

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await fetch(
                    `${API_URL}/users/${username}`
                );

                const data = await response.json();

                if (!response.ok) {
                    setError(
                        data.message || "Unable to load profile."
                    );
                    return;
                }

                setProfile(data);
            } catch (error) {
                setError("Unable to connect to the server.");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [username]);

    const logout = async () => {
        if (logoutLoading) return;

        setLogoutLoading(true);

        const refresh_token = getRefreshToken();

        try {
            if (refresh_token) {
                await fetch(`${API_URL}/auth/logout`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ refresh_token })
                });
            }
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            clearTokens();
            window.dispatchEvent(new Event("authChanged"));
            setLogoutLoading(false);
            navigate("/");
        }
    };

    // Convert rich-text HTML into plain text
    // for the profile blog preview.
    const getPreviewText = (content) => {
        if (!content) {
            return "";
        }

        const doc = new DOMParser().parseFromString(
            content,
            "text/html"
        );

        return (doc.body.textContent || "")
            .replace(/\s+/g, " ")
            .trim();
    };

    if (loading) {
        return (
            <main className="profile-page">
                Loading profile...
            </main>
        );
    }

    if (error) {
        return (
            <main className="profile-page">
                {error}
            </main>
        );
    }

    const latestBlogPreview = getPreviewText(
        profile.latestBlog?.content
    );

    return (
        <main className="profile-page">

            <section className="profile-header">

                <h1>
                    {profile.name}
                </h1>

                {isOwner && (
                    <p className="profile-username">
                        @{profile.username}
                    </p>
                )}

                <div className="profile-stats">
                    <span>
                        <strong>
                            {profile.blogCount}
                        </strong>{" "}
                        {profile.blogCount === 1
                            ? "Dispatch"
                            : "Dispatches"}
                    </span>
                </div>

            </section>

            {profile.latestBlog && (
                <section className="latest-profile-blog">

                    <p className="section-label">
                        Latest dispatch
                    </p>

                    <h2>
                        {profile.latestBlog.title}
                    </h2>

                    <p>
                        {latestBlogPreview.length > 180
                            ? latestBlogPreview.slice(0, 180) + "..."
                            : latestBlogPreview}
                    </p>

                    <Link
                        to={`/blogs/${profile.latestBlog._id}`}
                        className="text-link"
                    >
                        Read dispatch →
                    </Link>

                </section>
            )}

            {isOwner && (
                <section className="profile-actions">

                    <Link
                        to="/my-blogs"
                        className="profile-action-link"
                    >
                        My Blogs
                    </Link>

                    <button
                        className="profile-logout"
                        onClick={logout}
                        disabled={logoutLoading}
                    >
                        {logoutLoading
                            ? "Logging out..."
                            : "Logout"}
                    </button>

                </section>
            )}

        </main>
    );
}

export default Profile;