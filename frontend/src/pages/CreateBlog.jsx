import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuthorizationHeader } from "../lib/auth";

function CreateBlog() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [article, setArticle] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const response = await fetch("http://localhost:3000/blogs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthorizationHeader(),
        },
        body: JSON.stringify({ title, article, name }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(
          response.status === 401
            ? "Please sign in to publish a blog."
            : response.status === 403
              ? "You do not have permission to publish a blog."
              : data.error || data.message || "Unable to publish the blog.",
        );
        return;
      }
      navigate(`/blogs/${data._id}`);
    } catch {
      setError("Unable to connect to the server.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="create-page">
      <section className="create-container">
        <Link to="/blogs" className="back-link">
          ← Back to Blogs
        </Link>
        <div className="create-header">
          <p className="eyebrow">NEW POST</p>
          <h1>Write something.</h1>
          <p>Share an idea, experience, or something you've learned.</p>
        </div>
        <form className="blog-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="blog-title">Title</label>
            <input
              id="blog-title"
              type="text"
              placeholder="Give your blog a title..."
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="blog-author">Author</label>
            <input
              id="blog-author"
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="blog-article">Article</label>
            <textarea
              id="blog-article"
              placeholder="Start writing..."
              value={article}
              onChange={(event) => setArticle(event.target.value)}
              required
            />
          </div>
          {error && <p className="form-error">{error}</p>}
          <div className="form-footer">
            <span className="writing-hint">
              Take your time. Write something worth reading.
            </span>
            <button
              type="submit"
              className="publish-button"
              disabled={submitting}
            >
              {submitting ? "Publishing..." : "Publish Blog"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

export default CreateBlog;
