import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getAuthorizationHeader, isAdmin } from "../lib/auth";

const apiUrl = "http://localhost:3000";

function ArticleDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    title: "",
    content: "",
    name: "",
    category: "",
    sourceUrl: "",
  });
  const [editError, setEditError] = useState("");
  const [saving, setSaving] = useState(false);
  const [showDeletePanel, setShowDeletePanel] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [deleting, setDeleting] = useState(false);
  const admin = isAdmin();

  useEffect(() => {
    const loadArticle = async () => {
      try {
        const response = await fetch(`${apiUrl}/articles/${id}`);
        const data = await response.json();
        if (!response.ok)
          throw new Error(data.error || data.message || "Article not found.");
        setArticle(data);
      } catch (error) {
        setLoadError(error.message || "Unable to connect to the server.");
      } finally {
        setLoading(false);
      }
    };
    loadArticle();
  }, [id]);

  const updateArticle = async (event) => {
    event.preventDefault();
    setEditError("");
    setSaving(true);
    try {
      const response = await fetch(`${apiUrl}/articles/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...getAuthorizationHeader(),
        },
        body: JSON.stringify(editForm),
      });
      const data = await response.json();
      if (!response.ok) {
        setEditError(
          response.status === 401
            ? "Please sign in to edit this article."
            : response.status === 403
              ? "You do not have permission to edit articles."
              : data.error || data.message || "Unable to save changes.",
        );
        return;
      }
      setArticle(data);
      setEditing(false);
    } catch {
      setEditError("Unable to connect to the server.");
    } finally {
      setSaving(false);
    }
  };

  const deleteArticle = async () => {
    setDeleteError("");
    setDeleting(true);
    try {
      const response = await fetch(`${apiUrl}/articles/${id}`, {
        method: "DELETE",
        headers: getAuthorizationHeader(),
      });
      const data = await response.json();
      if (response.ok) {
        navigate("/articles");
        return;
      }
      setDeleteError(
        response.status === 401
          ? "Please sign in to delete this article."
          : response.status === 403
            ? "You do not have permission to delete articles."
            : data.error || data.message || "Unable to delete the article.",
      );
    } catch {
      setDeleteError("Unable to connect to the server.");
    } finally {
      setDeleting(false);
    }
  };

  if (loading)
    return (
      <main className="article-details-page">
        <div className="article-details-container">
          <p className="article-details-loading">Loading article...</p>
        </div>
      </main>
    );
  if (!article)
    return (
      <main className="article-details-page">
        <div className="article-details-container">
          <h1>{loadError || "Article not found"}</h1>
          <Link to="/articles" className="back-to-articles">
            ← Back to Articles
          </Link>
        </div>
      </main>
    );

  return (
    <main className="article-details-page">
      <article className="article-details-container">
        <Link to="/articles" className="back-to-articles">
          ← Back to Articles
        </Link>
        {editing ? (
          <form className="article-form" onSubmit={updateArticle}>
            <div className="form-group">
              <label htmlFor="edit-article-title">Title</label>
              <input
                id="edit-article-title"
                value={editForm.title}
                onChange={(event) =>
                  setEditForm({ ...editForm, title: event.target.value })
                }
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="edit-article-author">Author</label>
              <input
                id="edit-article-author"
                value={editForm.name}
                onChange={(event) =>
                  setEditForm({ ...editForm, name: event.target.value })
                }
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="edit-article-category">Category</label>
              <input
                id="edit-article-category"
                value={editForm.category}
                onChange={(event) =>
                  setEditForm({ ...editForm, category: event.target.value })
                }
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="edit-article-content">Content</label>
              <textarea
                id="edit-article-content"
                value={editForm.content}
                onChange={(event) =>
                  setEditForm({ ...editForm, content: event.target.value })
                }
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="edit-article-source">Further reading URL</label>
              <input
                id="edit-article-source"
                type="url"
                value={editForm.sourceUrl || ""}
                onChange={(event) =>
                  setEditForm({ ...editForm, sourceUrl: event.target.value })
                }
              />
            </div>
            {editError && <p className="form-error">{editError}</p>}
            <div className="form-footer">
              <button
                type="button"
                className="delete-cancel-btn"
                onClick={() => setEditing(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="publish-button"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save changes"}
              </button>
            </div>
          </form>
        ) : (
          <>
            <header className="article-details-header">
              <p className="article-details-category">
                {article.category.toUpperCase()}
              </p>
              <h1>{article.title}</h1>
              <div className="article-details-meta">
                <span>By {article.name}</span>
                {article.createdAt && (
                  <>
                    <span className="ad-meta-dot">•</span>
                    <span>
                      {new Date(article.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </>
                )}
              </div>
            </header>
            <div className="article-details-divider" />
            <div className="article-details-body">
              {article.content
                .split("\n")
                .map(
                  (paragraph, index) =>
                    paragraph.trim() && <p key={index}>{paragraph}</p>,
                )}
            </div>
            {article.sourceUrl && (
              <div className="further-reading">
                <p className="further-reading-label">FURTHER READING</p>
                <a
                  href={article.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="further-reading-link"
                >
                  Read more on this topic →
                </a>
              </div>
            )}
          </>
        )}
        <footer className="article-details-footer">
          <Link to="/articles" className="back-to-articles">
            ← Back to all articles
          </Link>
          {admin && !editing && (
            <div>
              {!showDeletePanel ? (
                <>
                  <button
                    className="create-blog-btn"
                    onClick={() => {
                      setEditForm(article);
                      setEditError("");
                      setEditing(true);
                    }}
                  >
                    Edit Article
                  </button>
                  <button
                    className="delete-article-btn"
                    onClick={() => setShowDeletePanel(true)}
                  >
                    Delete Article
                  </button>
                </>
              ) : (
                <div className="delete-panel">
                  <p className="delete-panel-label">
                    Delete this article permanently?
                  </p>
                  <div className="delete-form-actions">
                    <button
                      type="button"
                      className="delete-cancel-btn"
                      onClick={() => setShowDeletePanel(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="delete-confirm-btn"
                      onClick={deleteArticle}
                      disabled={deleting}
                    >
                      {deleting ? "Deleting..." : "Confirm Delete"}
                    </button>
                  </div>
                  {deleteError && <p className="delete-error">{deleteError}</p>}
                </div>
              )}
            </div>
          )}
        </footer>
      </article>
    </main>
  );
}

export default ArticleDetails;
