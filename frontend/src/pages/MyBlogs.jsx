import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../lib/api";

function MyBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMyBlogs = async () => {
      try {
        const response = await apiFetch("/blogs/me");

        const data = await response.json();

        if (!response.ok) {
          setError(
            data.message || "Unable to load your blogs."
          );
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
      <main className="my-blogs-page">
        <div className="my-blogs-container">
          <p className="my-blogs-status">
            Loading your blogs...
          </p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="my-blogs-page">
        <div className="my-blogs-container">
          <p className="my-blogs-status my-blogs-error">
            {error}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="my-blogs-page">
      <div className="my-blogs-container">

        <header className="my-blogs-header">
          <p className="eyebrow">YOUR WRITING</p>

          <h1>My Blogs</h1>

          <p className="my-blogs-description">
            All the blogs you have published.
          </p>
        </header>

        {blogs.length === 0 ? (
          <section className="my-blogs-empty">
            <h2>No blogs yet</h2>

            <p>
              You haven't written any blogs yet.
              Start sharing your ideas with the world.
            </p>

            <Link
              to="/create-blog"
              className="create-blog-btn"
            >
              + Write a Blog
            </Link>
          </section>
        ) : (
          <section className="my-blogs-list">
            {blogs.map((blog) => (
              <article
                key={blog._id}
                className="my-blog-item"
              >
                <div className="my-blog-meta">
                  <span>BLOG</span>

                  {blog.createdAt && (
                    <>
                      <span>·</span>
                      <span>
                        {new Date(
                          blog.createdAt
                        ).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </>
                  )}
                </div>

                <h2 className="my-blog-title">
                  {blog.title}
                </h2>

                <p className="my-blog-preview">
                  {(blog.content || "").length > 180
                    ? blog.content.slice(0, 180) + "..."
                    : blog.content || ""}
                </p>

                <Link
                  to={`/blogs/${blog._id}`}
                  className="my-blog-read-link"
                >
                  Read blog <span>→</span>
                </Link>
              </article>
            ))}
          </section>
        )}

      </div>
    </main>
  );
}

export default MyBlogs;