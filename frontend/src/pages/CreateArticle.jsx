import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuthorizationHeader, isAdmin } from "../lib/auth";

function CreateArticle() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    content: "",
    name: "",
    category: "",
    sourceUrl: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const updateField = (event) =>
    setForm({ ...form, [event.target.name]: event.target.value });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const response = await fetch("http://localhost:3000/articles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthorizationHeader(),
        },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(
          response.status === 401
            ? "Please sign in to create an article."
            : response.status === 403
              ? "You do not have permission to create articles."
              : data.error || data.message || "Unable to create the article.",
        );
        return;
      }
      navigate(`/articles/${data._id}`);
    } catch {
      setError("Unable to connect to the server.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isAdmin())
    return (
      <main className="create-page">
        <section className="create-container">
          <Link to="/articles" className="back-link">
            ← Back to Articles
          </Link>
          <p className="form-error">
            You do not have permission to create articles.
          </p>
        </section>
      </main>
    );
  return (
    <main className="create-page">
      <section className="create-container">
        <Link to="/articles" className="back-link">
          ← Back to Articles
        </Link>
        <div className="create-header">
          <p className="eyebrow">NEW ARTICLE</p>
          <h1>Write an article.</h1>
          <p>Publish a technical guide or deep-dive.</p>
        </div>
        <form className="article-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="article-title">Title</label>
            <input
              id="article-title"
              name="title"
              value={form.title}
              onChange={updateField}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="article-author">Author</label>
            <input
              id="article-author"
              name="name"
              value={form.name}
              onChange={updateField}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="article-category">Category</label>
            <input
              id="article-category"
              name="category"
              value={form.category}
              onChange={updateField}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="article-content">Content</label>
            <textarea
              id="article-content"
              name="content"
              value={form.content}
              onChange={updateField}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="article-source">Further reading URL</label>
            <input
              id="article-source"
              name="sourceUrl"
              type="url"
              value={form.sourceUrl}
              onChange={updateField}
            />
          </div>
          {error && <p className="form-error">{error}</p>}
          <div className="form-footer">
            <span className="writing-hint">
              Articles are published for the public archive.
            </span>
            <button
              type="submit"
              className="publish-button"
              disabled={submitting}
            >
              {submitting ? "Publishing..." : "Publish Article"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

export default CreateArticle;
