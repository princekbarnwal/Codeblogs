import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { API_URL, apiFetch } from "../lib/api";
import { getCurrentUser } from "../lib/auth";
import RichTextEditor from "../components/RichTextEditor";

function BlogPostDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [editing, setEditing] = useState(false);

  const [editForm, setEditForm] = useState({
    title: "",
    content: "",
    anonymous: false,
  });

  const [editError, setEditError] = useState("");
  const [saving, setSaving] = useState(false);

  const [showDeletePanel, setShowDeletePanel] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const loadBlog = async () => {
      try {
        setLoading(true);
        setLoadError("");

        const response = await fetch(`${API_URL}/blogs/${id}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error || data.message || "Blog not found."
          );
        }

        setBlog(data);
      } catch (error) {
        setLoadError(
          error.message || "Unable to connect to the server."
        );
      } finally {
        setLoading(false);
      }
    };

    loadBlog();
  }, [id]);

  const startEditing = () => {
    setEditForm({
      title: blog.title || "",
      content: blog.content || "",
      anonymous: blog.anonymous ?? false,
    });

    setEditError("");
    setEditing(true);
  };

  const saveChanges = async (event) => {
    event.preventDefault();

    setEditError("");
    setSaving(true);

    try {
      const response = await apiFetch(`/blogs/${id}`, {
        method: "PUT",
        body: JSON.stringify(editForm),
      });

      const data = await response.json();

      if (!response.ok) {
        setEditError(
          response.status === 401
            ? "Please sign in to edit this blog."
            : response.status === 403
              ? "You do not have permission to edit this blog."
              : data.error ||
                data.message ||
                "Unable to save changes."
        );

        return;
      }

      setBlog(data);
      setEditing(false);
    } catch {
      setEditError("Unable to connect to the server.");
    } finally {
      setSaving(false);
    }
  };

  const deleteBlog = async () => {
    setDeleteError("");
    setDeleting(true);

    try {
      const response = await apiFetch(`/blogs/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (response.ok) {
        navigate("/blogs");
        return;
      }

      setDeleteError(
        response.status === 401
          ? "Please sign in to delete this blog."
          : response.status === 403
            ? "You do not have permission to delete this blog."
            : data.error ||
              data.message ||
              "Unable to delete the blog."
      );
    } catch {
      setDeleteError("Unable to connect to the server.");
    } finally {
      setDeleting(false);
    }
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
          <h1>{loadError || "Blog not found"}</h1>

          <Link to="/blogs" className="back-to-blogs">
            ← Back to Blogs
          </Link>
        </div>
      </main>
    );
  }

  const isOwner =
    currentUser?.username === blog.author?.username;

  return (
    <main className="blog-details-page">
      <article className="article-container">

        <Link to="/blogs" className="back-to-blogs">
          ← Back to Blogs
        </Link>

        {editing ? (
          <form className="blog-form" onSubmit={saveChanges}>

            {/* Title */}
            <div className="form-group">
              <label htmlFor="edit-title">
                Title
              </label>

              <input
                id="edit-title"
                value={editForm.title}
                onChange={(event) =>
                  setEditForm({
                    ...editForm,
                    title: event.target.value,
                  })
                }
                required
              />
            </div>

            {/* Publish As */}
            <div className="form-group">
              <label>
                Publish as
              </label>

              <div className="author-options">

                <label>
                  <input
                    type="radio"
                    name="editPublishAs"
                    checked={!editForm.anonymous}
                    onChange={() =>
                      setEditForm({
                        ...editForm,
                        anonymous: false,
                      })
                    }
                  />

                  Use my username
                </label>

                <label>
                  <input
                    type="radio"
                    name="editPublishAs"
                    checked={editForm.anonymous}
                    onChange={() =>
                      setEditForm({
                        ...editForm,
                        anonymous: true,
                      })
                    }
                  />

                  Post anonymously
                </label>

              </div>
            </div>

            {/* Rich Text Content */}
            <div className="form-group">
              <label>
                Content
              </label>

              <RichTextEditor
                content={editForm.content}
                setContent={(value) =>
                  setEditForm({
                    ...editForm,
                    content: value,
                  })
                }
              />
            </div>

            {editError && (
              <p className="form-error">
                {editError}
              </p>
            )}

            {/* Edit Actions */}
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
                {saving
                  ? "Saving..."
                  : "Save changes"}
              </button>

            </div>
          </form>
        ) : (
          <>
            {/* Blog Header */}
            <header className="article-header">

              <p className="article-category">
                BLOG
              </p>

              <h1>
                {blog.title}
              </h1>

              <p className="blog-author">
                {blog.anonymous
                  ? "Written by Anonymous"
                  : `Written by ${
                      blog.author?.name || "Unknown"
                    } (@${
                      blog.author?.username || "unknown"
                    })`}
              </p>

              <div className="article-meta">
                {blog.createdAt && (
                  <span>
                    {new Date(
                      blog.createdAt
                    ).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                )}
              </div>

            </header>

            <div className="article-divider" />

            {/* Rich Text Blog Content */}
            <div
              className="article-body"
              dangerouslySetInnerHTML={{
                __html: blog.content || "",
              }}
            />
          </>
        )}

        {/* Footer */}
        <footer className="article-footer">

          <Link
            to="/blogs"
            className="back-to-blogs"
          >
            ← Back to all blogs
          </Link>

          {isOwner && !editing && (
            <div className="blog-actions">

              {!showDeletePanel ? (
                <>
                  <button
                    className="edit-blog-btn"
                    onClick={startEditing}
                  >
                    Edit Blog
                  </button>

                  <button
                    className="delete-blog-btn"
                    onClick={() =>
                      setShowDeletePanel(true)
                    }
                  >
                    Delete Blog
                  </button>
                </>
              ) : (
                <div className="delete-panel">

                  <p className="delete-panel-label">
                    Delete this blog permanently?
                  </p>

                  <div className="delete-form-actions">

                    <button
                      type="button"
                      className="delete-cancel-btn"
                      onClick={() =>
                        setShowDeletePanel(false)
                      }
                    >
                      Cancel
                    </button>

                    <button
                      type="button"
                      className="delete-confirm-btn"
                      onClick={deleteBlog}
                      disabled={deleting}
                    >
                      {deleting
                        ? "Deleting..."
                        : "Confirm Delete"}
                    </button>

                  </div>

                  {deleteError && (
                    <p className="delete-error">
                      {deleteError}
                    </p>
                  )}

                </div>
              )}

            </div>
          )}

        </footer>

      </article>
    </main>
  );
}

export default BlogPostDetails;