import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../lib/api";

// Convert rich-text HTML into plain text for the blog preview
const getPreviewText = (content) => {
  if (!content) return "";

  const spaced = content.replace(/<\/(p|h[1-6]|li|div|blockquote)>/gi, " ");
  const doc = new DOMParser().parseFromString(spaced, "text/html");

  return (doc.body.textContent || "").replace(/\s+/g, " ").trim();
};

function MyBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [search, setSearch] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadMyBlogs = async (searchTerm = "", pageNumber = 1) => {
    try {
      setLoading(true);
      setError("");

      const response = await apiFetch(
        `/blogs/me?search=${encodeURIComponent(searchTerm)}&page=${pageNumber}&limit=10`
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message || "Unable to load your blogs."
        );
        return;
      }

      setBlogs(data.blogs);
      setPage(data.page);
      setTotalPages(data.totalPages);
    } catch (error) {
      setError("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMyBlogs();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const term = search.trim();
    setAppliedSearch(term);
    loadMyBlogs(term, 1);
  };

  const handleClear = () => {
    setSearch("");
    setAppliedSearch("");
    loadMyBlogs("", 1);
  };

  const goToPage = (pageNumber) => {
    loadMyBlogs(appliedSearch, pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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

        {/* Search bar */}
        <form className="blog-search" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search your blogs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button type="submit" disabled={loading}>
            Search
          </button>

          {search && (
            <button
              type="button"
              onClick={handleClear}
              disabled={loading}
            >
              Clear
            </button>
          )}
        </form>

        {loading ? (
          <p className="my-blogs-status">
            Loading your blogs...
          </p>
        ) : error ? (
          <p className="my-blogs-status my-blogs-error">
            {error}
          </p>
        ) : blogs.length === 0 ? (
          appliedSearch ? (
            <p className="my-blogs-status">
              No blogs found. Try another search.
            </p>
          ) : (
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
          )
        ) : (
          <section className="my-blogs-list">
            {blogs.map((blog) => {
              const previewText = getPreviewText(blog.content);

              return (
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
                    {previewText.length > 180
                      ? previewText.slice(0, 180) + "..."
                      : previewText}
                  </p>

                  <Link
                    to={`/blogs/${blog._id}`}
                    className="my-blog-read-link"
                  >
                    Read blog <span>→</span>
                  </Link>
                </article>
              );
            })}
          </section>
        )}

        {/* Pagination */}
        {totalPages > 1 && !loading && !error && (
          <nav className="pagination" aria-label="Pagination">
            <button
              type="button"
              onClick={() => goToPage(page - 1)}
              disabled={page <= 1}
            >
              ← Previous
            </button>

            <span>
              Page {page} of {totalPages}
            </span>

            <button
              type="button"
              onClick={() => goToPage(page + 1)}
              disabled={page >= totalPages}
            >
              Next →
            </button>
          </nav>
        )}

      </div>
    </main>
  );
}

export default MyBlogs;