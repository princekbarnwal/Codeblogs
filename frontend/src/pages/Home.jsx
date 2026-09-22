import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Home.css";
const excerpt = (text, n = 145) =>
  text?.length > n ? `${text.slice(0, n).trim()}...` : text;
const date = (value) =>
  value
    ? new Date(value).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Recently";
function Home() {
  const [blogs, setBlogs] = useState([]);
  const [articles, setArticles] = useState([]);
  const [quote, setQuote] = useState(null);
  useEffect(() => {
    Promise.all([
      fetch("http://localhost:3000/blogs"),
      fetch("http://localhost:3000/articles"),
      fetch("http://localhost:3000/quotes"),
    ])
      .then(async ([b, a, q]) => [
        b.ok ? await b.json() : [],
        a.ok ? await a.json() : [],
        q.ok ? await q.json() : null,
      ])
      .then(([b, a, q]) => {
        setBlogs(
          [...b].sort((x, y) => new Date(y.createdAt) - new Date(x.createdAt)),
        );
        setArticles(
          [...a].sort((x, y) => new Date(y.createdAt) - new Date(x.createdAt)),
        );
        setQuote(q);
      })
      .catch(() => undefined);
  }, []);
  const featured = articles[0] || blogs[0];
  const latest = [
    ...blogs.map((x) => ({
      ...x,
      kind: "Dispatch",
      body: x.article,
      url: `/blogs/${x._id}`,
    })),
    ...articles.map((x) => ({
      ...x,
      kind: x.category || "Article",
      body: x.content,
      url: `/articles/${x._id}`,
    })),
  ]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);
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
            <Link className="editorial-button" to="/articles">
              Explore the archive -&gt;
            </Link>
            <Link className="secondary-button" to="/create-blog">
              Write a dispatch
            </Link>
          </div>
          <p className="hero-note">SYSTEMS · SOFTWARE · TECHNOLOGY</p>
        </div>
        <div className="hero-visual">
          <div className="editorial-card">
            <div className="card-bar">~/Codeblogs/field-notes</div>
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
      <section className="home-section">
        <div className="section-head">
          <div>
            <p className="eyebrow">THE JOURNAL</p>
            <h2>Two ways of thinking out loud.</h2>
          </div>
          <p>
            Personal notes and durable technical explanations, kept distinct but
            connected by the same impulse to understand.
          </p>
        </div>
        <div className="stream-grid">
          <Link className="stream" to="/blogs">
            <span>01 / PERSONAL DISPATCHES</span>
            <div>
              <h3>Blogs</h3>
              <p>
                Observations, experiments, mistakes, and lessons gathered while
                making things.
              </p>
            </div>
            <span>EXPLORE DISPATCHES</span>
          </Link>
          <Link className="stream" to="/articles">
            <span>02 / TECHNICAL ARCHIVE</span>
            <div>
              <h3>Articles</h3>
              <p>
                Guides and deep-dives designed to make difficult ideas more
                approachable.
              </p>
            </div>
            <span>EXPLORE ARTICLES</span>
          </Link>
        </div>
      </section>
      <section className="home-section">
        <div className="section-head">
          <div>
            <p className="eyebrow">FROM THE ARCHIVE</p>
            <h2>Worth a closer read.</h2>
          </div>
          <Link className="text-link" to="/articles">
            View all articles -&gt;
          </Link>
        </div>
        {featured ? (
          <Link
            to={
              featured.content
                ? `/articles/${featured._id}`
                : `/blogs/${featured._id}`
            }
            className="feature-grid"
          >
            <div className="feature-copy">
              <p className="eyebrow">
                {featured.category || "LATEST DISPATCH"}
              </p>
              <h3>{featured.title}</h3>
              <p>{excerpt(featured.content || featured.article, 260)}</p>
              <div className="feature-meta">
                BY {featured.name} · {date(featured.createdAt)}
              </div>
            </div>
            <div className="feature-visual">
              <strong>01</strong>
              <span>FEATURED READING</span>
            </div>
          </Link>
        ) : (
          <p className="empty-message">
            The archive is waiting for its first entry.
          </p>
        )}
      </section>
      <section className="home-section">
        <div className="section-head">
          <div>
            <p className="eyebrow">RECENTLY PUBLISHED</p>
            <h2>Latest notes.</h2>
          </div>
          <Link className="text-link" to="/blogs">
            View all writing -&gt;
          </Link>
        </div>
        <div className="preview-grid">
          {latest.length ? (
            latest.map((item, index) => (
              <Link className="preview" to={item.url} key={item._id}>
                <span className="preview-meta">
                  0{index + 1} / {item.kind.toUpperCase()}
                </span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{excerpt(item.body, 120)}</p>
                </div>
                <span className="preview-meta">
                  {date(item.createdAt)} -&gt;
                </span>
              </Link>
            ))
          ) : (
            <p className="empty-message">No entries yet.</p>
          )}
        </div>
      </section>
    </main>
  );
}
export default Home;
