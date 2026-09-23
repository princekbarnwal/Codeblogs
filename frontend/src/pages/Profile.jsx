import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
    clearTokens,
    getCurrentUser
} from "../lib/auth";

function Profile() {

    const { username } = useParams();

    const navigate = useNavigate();

    const currentUser = getCurrentUser();

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const isOwner =
        currentUser?.username === username;

    useEffect(() => {

        const fetchProfile = async () => {

            try {

                setLoading(true);
                setError("");

                const response = await fetch(
                    `http://localhost:3000/users/${username}`
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

                setError(
                    "Unable to connect to the server."
                );

            } finally {

                setLoading(false);

            }
        };

        fetchProfile();

    }, [username]);

    const logout = () => {

        clearTokens();

        window.dispatchEvent(
            new Event("authChanged")
        );

        navigate("/");

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
                        {profile.latestBlog.article.length > 180
                            ? profile.latestBlog.article.slice(0, 180) + "..."
                            : profile.latestBlog.article}
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
                    >
                        Logout
                    </button>

                </section>
            )}

        </main>
    );
}

export default Profile;