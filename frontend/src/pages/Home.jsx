import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Home.css";

const excerpt = (text, length = 145) =>
  text?.length > length ? `${text.slice(0, length).trim()}...` : text;
const formatDate = (value) =>
  value
    ? new Date(value).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Recently";

function Home() {
  const [blogs, setBlogs] = useState([]);
  const [quote, setQuote] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3000/blogs")
      .then(async (response) => (response.ok ? response.json() : []))
      .then((data) =>
        setBlogs(
          [...data]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 3),
        ),
      )
      .catch(() => setBlogs([]));

    fetch("http://localhost:3000/quotes")
      .then(async (response) => (response.ok ? response.json() : null))
      .then(setQuote)
      .catch(() => setQuote(null));
  }, []);

  return (
    <main className="home">
      <section className="home-hero">
        <div>
          <div className="hero-kicker">
            PERSONAL &amp; PUBLIC CODING DEVELOPMENT JOURNAL
          </div>
          <h1 className="hero-title">
            Notes from the
            <br />
            edge of <em>curiosity.</em>
          </h1>
          <p className="page-copy">
            A quiet place for software, systems, experiments, and the ideas that
            become clearer once they are written down.
          </p>
          <div className="hero-actions">
            <Link className="editorial-button" to="/blogs">
              Explore dispatches →
            </Link>
            <Link className="secondary-button" to="/create-blog">
              Write a dispatch
            </Link>
          </div>
          <p className="hero-note">SYSTEMS · SOFTWARE · TECHNOLOGY</p>
        </div>
        <div className="hero-visual">
          <div className="editorial-card">
            <div className="card-bar">~/CodeBlogs/field-notes</div>
            <div className="card-body card-code">
              <div>
                <span className="code-muted">01</span> const{" "}
                <span className="code-green">curiosity</span> = true;
              </div>
              <div>
                <span className="code-muted">02</span> while (building) {"{"}
              </div>
              <div>
                <span className="code-muted">03</span> &nbsp;&nbsp;learn();
              </div>
              <div>
                <span className="code-muted">04</span> &nbsp;&nbsp;write();
              </div>
              <div>
                <span className="code-muted">05</span> {"}"}
              </div>
            </div>
            <div className="card-footer">
              <span>THOUGHTS IN PROGRESS</span>
              <span>ONLINE</span>
            </div>
          </div>
        </div>
      </section>

      {quote && (
        <section className="quote-section" aria-label="Featured quote">
          <div className="quote-rule" />
          <blockquote>
            <p>“{quote.quote}”</p>
            <footer>— {quote.author}</footer>
          </blockquote>
          <div className="quote-label">A NOTE TO KEEP</div>
        </section>
      )}

      <section className="home-section latest-writing-section">
        <div className="section-head">
          <div>
            <p className="eyebrow">LATEST WRITING</p>
            <h2>Latest dispatches.</h2>
          </div>
          <Link className="text-link" to="/blogs">
            View all dispatches →
          </Link>
        </div>
        <div className="preview-grid">
          {blogs.length ? (
            blogs.map((blog, index) => (
              <Link
                className="preview"
                to={`/blogs/${blog._id}`}
                key={blog._id}
              >
                <span className="preview-meta">
                  {String(index + 1).padStart(2, "0")} &nbsp; DISPATCH ·{" "}
                  {formatDate(blog.createdAt).toUpperCase()}
                </span>
                <div>
                  <h3>{blog.title}</h3>
                  <p>{excerpt(blog.article, 130)}</p>
                </div>
                <span className="preview-meta">Read dispatch →</span>
              </Link>
            ))
          ) : (
            <p className="empty-message">No dispatches published yet.</p>
          )}
        </div>
      </section>
    </main>
  );
}

export default Home;
