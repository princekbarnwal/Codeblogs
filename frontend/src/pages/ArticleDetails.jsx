import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";

function ArticleDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  // Delete panel state
  const [showDeletePanel, setShowDeletePanel] = useState(false);
  const [deleteSecret, setDeleteSecret] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:3000/articles/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setArticle(data);
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
      const response = await fetch(`http://localhost:3000/articles/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ secret: deleteSecret }),
      });

      if (response.ok) {
        navigate("/articles");
      } else if (response.status === 401) {
        setDeleteError("Incorrect delete secret.");
      } else if (response.status === 404) {
        setDeleteError("Article not found.");
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
      <main className="article-details-page">
        <div className="article-details-container">
          <p className="article-details-loading">Loading article...</p>
        </div>
      </main>
    );
  }

  if (!article) {
    return (
      <main className="article-details-page">
        <div className="article-details-container">
          <h1>Article not found</h1>
          <Link to="/articles" className="back-to-articles">
            ← Back to Articles
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="article-details-page">
      <article className="article-details-container">
        <Link to="/articles" className="back-to-articles">
          ← Back to Articles
        </Link>

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

        <footer className="article-details-footer">
          <Link to="/articles" className="back-to-articles">
            ← Back to all articles
          </Link>

          {!showDeletePanel ? (
            <button
              className="delete-article-btn"
              onClick={() => setShowDeletePanel(true)}
            >
              Delete Article
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

export default ArticleDetails;
