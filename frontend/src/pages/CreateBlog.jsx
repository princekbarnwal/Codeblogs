import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiFetch } from "../lib/api";
import RichTextEditor from "../components/RichTextEditor";

function CreateBlog() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const response = await apiFetch("/blogs", {
        method: "POST",
        body: JSON.stringify({
          title,
          content,
          anonymous,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(
          response.status === 401
            ? "Please sign in to publish a blog."
            : response.status === 403
              ? "You do not have permission to publish a blog."
              : data.error ||
                data.message ||
                "Unable to publish the blog."
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

          <p>
            Share an idea, experience, or something you've learned.
          </p>
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
            <label>Publish as</label>

            <div className="author-options">
              <label>
                <input
                  type="radio"
                  name="publishAs"
                  checked={!anonymous}
                  onChange={() => setAnonymous(false)}
                />
                Use my username
              </label>

              <label>
                <input
                  type="radio"
                  name="publishAs"
                  checked={anonymous}
                  onChange={() => setAnonymous(true)}
                />
                Post anonymously
              </label>
            </div>
          </div>

          <div className="form-group">
            <label>Content</label>

            <RichTextEditor
              content={content}
              setContent={setContent}
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