import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAuthorizationHeader } from "../lib/auth";

function MyBlogs() {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchMyBlogs = async () => {
            try {
                const response = await fetch(
                    "http://localhost:3000/blogs/me",
                    {
                        headers: {
                            ...getAuthorizationHeader()
                        }
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    setError(data.message || "Unable to load your blogs.");
                    return;
                }

                setBlogs(data);

            } catch (error) {
                setError("Unable to connect to the server.");
            } finally {
                setLoading(false);
            }
        };

        fetchMyBlogs();
    }, []);

    if (loading) {
        return (
            <main className="blogs-page">
                Loading your blogs...
            </main>
        );
    }

    if (error) {
        return (
            <main className="blogs-page">
                {error}
            </main>
        );
    }

    return (
        <main className="blogs-page">

            <header className="page-header">
                <p className="eyebrow">YOUR WRITING</p>
                <h1>My Blogs</h1>
                <p>All the blogs you have published.</p>
            </header>

            {blogs.length === 0 ? (
                <p>You haven't written any blogs yet.</p>
            ) : (
                <section className="my-blogs-list">

                    {blogs.map((blog, index) => (
                        <article
                            key={blog._id}
                            className="my-blog-item"
                        >
                            <span>
                                {String(index + 1).padStart(2, "0")}
                            </span>

                            <div>
                                <p className="eyebrow">
                                    BLOG ·{" "}
                                    {new Date(
                                        blog.createdAt
                                    ).toLocaleDateString()}
                                </p>

                                <h2>{blog.title}</h2>

                                <p>
                                    {blog.article.length > 180
                                        ? blog.article.slice(0, 180) + "..."
                                        : blog.article}
                                </p>

                                <Link
                                    to={`/blogs/${blog._id}`}
                                    className="text-link"
                                >
                                    Read blog →
                                </Link>
                            </div>
                        </article>
                    ))}

                </section>
            )}

        </main>
    );
}

export default MyBlogs;