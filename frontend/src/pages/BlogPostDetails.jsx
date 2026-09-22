import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";

function BlogPostDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  // Delete panel state
  const [showDeletePanel, setShowDeletePanel] = useState(false);
  const [deleteSecret, setDeleteSecret] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:3000/blogs/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setBlog(data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, [id]);

  const handleDeleteSubmit = async (e) => {
    e.preventDefault();
    setDeleting(true);
    setDeleteError("");

    try {
      const response = await fetch(`http://localhost:3000/blogs/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ secret: deleteSecret }),
      });

      if (response.ok) {
        navigate("/blogs");
      } else if (response.status === 401) {
        setDeleteError("Incorrect delete secret.");
      } else if (response.status === 404) {
        setDeleteError("Blog not found.");
      } else {
        setDeleteError("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.log(error);
      setDeleteError("Network error. Could not connect to the server.");
    } finally {
      setDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeletePanel(false);
    setDeleteSecret("");
    setDeleteError("");
  };

  if (loading) {
    return (
      <main className="blog-details-page">
        <div className="article-container">
          <p className="article-loading">Loading blog...</p>
        </div>
      </main>
    );
  }

  if (!blog) {
    return (
      <main className="blog-details-page">
        <div className="article-container">
          <h1>Blog not found</h1>
          <Link to="/blogs" className="back-to-blogs">
            ← Back to Blogs
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="blog-details-page">
      <article className="article-container">
        <Link to="/blogs" className="back-to-blogs">
          ← Back to Blogs
        </Link>

        <header className="article-header">
          <p className="article-category">BLOG</p>
          <h1>{blog.title}</h1>

          <div className="article-meta">
            <span>By {blog.name}</span>

            {blog.createdAt && (
              <>
                <span className="meta-dot">•</span>
                <span>
                  {new Date(blog.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </>
            )}
          </div>
        </header>

        <div className="article-divider"></div>

        <div className="article-body">
          {blog.article
            .split("\n")
            .map(
              (paragraph, index) =>
                paragraph.trim() && <p key={index}>{paragraph}</p>,
            )}
        </div>

        <footer className="article-footer">
          <Link to="/blogs" className="back-to-blogs">
            ← Back to all blogs
          </Link>

          {!showDeletePanel ? (
            <button
              className="delete-blog-btn"
              onClick={() => setShowDeletePanel(true)}
            >
              Delete Blog
            </button>
          ) : (
            <div className="delete-panel">
              <p className="delete-panel-label">
                Enter your delete secret to confirm
              </p>

              <form className="delete-form" onSubmit={handleDeleteSubmit}>
                <input
                  type="password"
                  className="delete-secret-input"
                  placeholder="Delete secret"
                  value={deleteSecret}
                  onChange={(e) => setDeleteSecret(e.target.value)}
                  required
                  autoFocus
                />

                <div className="delete-form-actions">
                  <button
                    type="button"
                    className="delete-cancel-btn"
                    onClick={handleCancelDelete}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="delete-confirm-btn"
                    disabled={deleting}
                  >
                    {deleting ? "Deleting…" : "Confirm Delete"}
                  </button>
                </div>

                {deleteError && <p className="delete-error">{deleteError}</p>}
              </form>
            </div>
          )}
        </footer>
      </article>
    </main>
  );
}

export default BlogPostDetails;
