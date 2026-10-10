import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_URL } from "../lib/api";

// Convert rich-text HTML into plain text for the blog preview
const getPreviewText = (content) => {
  if (!content) return "";

  // put a space after each block tag so paragraphs don't run together
  const spaced = content.replace(/<\/(p|h[1-6]|li|div|blockquote)>/gi, " ");
  const doc = new DOMParser().parseFromString(spaced, "text/html");

  return (doc.body.textContent || "").replace(/\s+/g, " ").trim();
};

function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [search, setSearch] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const loadBlogs = async (searchTerm = "", pageNumber = 1) => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/blogs?search=${encodeURIComponent(searchTerm)}&page=${pageNumber}&limit=10`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || data.message || "Unable to load blogs."
        );
      }

      setBlogs(data.blogs);
      setPage(data.page);
      setTotalPages(data.totalPages);
    } catch (loadError) {
      setError(
        loadError.message || "Unable to connect to the server."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBlogs();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const term = search.trim();
    setAppliedSearch(term);
    loadBlogs(term, 1);
  };

  const handleClear = () => {
    setSearch("");
    setAppliedSearch("");
    loadBlogs("", 1);
  };

  const goToPage = (pageNumber) => {
    loadBlogs(appliedSearch, pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="blogs-page">

      {/* Search bar */}
      <form className="blog-search" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search blogs..."
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

      {/* Hero section */}
      <section className="blogs-hero">
        <div>
          <p className="eyebrow">MY WRITINGS</p>

          <h1>
            Thoughts, ideas
            <br />
            & things I've learned.
          </h1>

          <p className="blogs-description">
            A collection of my experiences, experiments, and lessons
            from building software.
          </p>
        </div>

        <Link
          to="/create-blog"
          className="create-blog-btn"
        >
          + Write a Blog
        </Link>
      </section>

      {/* Blog list */}
      <section className="blogs-content">

        <div className="blogs-heading">
          <div>
            <p className="section-label">ALL POSTS</p>
            <h2>Latest writing</h2>
          </div>
        </div>

        <div className="blogs-list">

          {loading ? (
            <p className="empty-blogs">
              Loading blogs...
            </p>
          ) : error ? (
            <p className="empty-blogs">
              {error}
            </p>
          ) : blogs.length === 0 ? (
            <p className="empty-blogs">
              {appliedSearch
                ? "No blogs found. Try another search."
                : "No blogs published yet."}
            </p>
          ) : (
            blogs.map((blog) => {
              const previewText = getPreviewText(blog.content);

              return (
                <Link
                  to={`/blogs/${blog._id}`}
                  className="blog-item"
                  key={blog._id}
                >
                  <div className="blog-item-content">

                    <div className="blog-meta">
                      <span>BLOG</span>

                      {blog.createdAt && (
                        <>
                          <span>·</span>

                          <span>
                            {new Date(
                              blog.createdAt
                            ).toLocaleDateString()}
                          </span>
                        </>
                      )}

                      <span>·</span>

                      <span>
                        By{" "}
                        {blog.anonymous
                          ? "Anonymous"
                          : `${blog.author?.name || "Unknown"} (@${
                              blog.author?.username || "unknown"
                            })`}
                      </span>
                    </div>

                    <h3>
                      {blog.title}
                    </h3>

                    <p>
                      {previewText.length > 180
                        ? previewText.substring(0, 180) + "..."
                        : previewText}
                    </p>

                    <span className="read-blog">
                      Read blog <span>→</span>
                    </span>

                  </div>
                </Link>
              );
            })
          )}

        </div>

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
      </section>
    </main>
  );
}

export default Blogs;