import { useState } from "react";
import { Link } from "react-router-dom";

function CreateBlog() {
  const [title, setTitle] = useState("");
  const [article, setArticle] = useState("");
  const [name, setName] = useState("");
  const [deleteSecret, setDeleteSecret] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/blogs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          article,
          name,
          deleteSecret,
        }),
      });

      const data = await response.json();

      console.log(data);

      if (response.ok) {
        setTitle("");
        setArticle("");
        setName("");
        setDeleteSecret("");

        alert("Blog published successfully!");
      }
    } catch (error) {
      console.log(error);
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
            <label>Title</label>

            <input
              type="text"
              placeholder="Give your blog a title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Author</label>

            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Article</label>

            <textarea
              placeholder="Start writing..."
              value={article}
              onChange={(e) => setArticle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Delete Secret</label>

            <input
              type="password"
              placeholder="Set a secret you'll need to delete this blog later"
              value={deleteSecret}
              onChange={(e) => setDeleteSecret(e.target.value)}
              required
            />
          </div>

          <div className="form-footer">
            <span className="writing-hint">
              Take your time. Write something worth reading.
            </span>

            <button type="submit" className="publish-button">
              Publish Blog
              <span>→</span>
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

export default CreateBlog;
