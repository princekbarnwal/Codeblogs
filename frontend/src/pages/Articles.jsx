import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Articles() {
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadArticles = async () => {
      try {
        const response = await fetch("http://localhost:3000/articles");
        const data = await response.json();
        if (!response.ok)
          throw new Error(
            data.error || data.message || "Unable to load articles.",
          );
        setArticles(data);
      } catch (loadError) {
        setError(loadError.message || "Unable to connect to the server.");
      } finally {
        setLoading(false);
      }
    };
    loadArticles();
  }, []);

  return (
    <main className="articles-page">
      <section className="articles-hero">
        <div>
          <p className="eyebrow">KNOWLEDGE BASE</p>

          <h1>
            Guides, concepts
            <br />& technical deep-dives.
          </h1>

          <p className="articles-description">
            Structured articles designed to help you understand topics clearly —
            tutorials, explanations, and walkthroughs worth bookmarking.
          </p>
        </div>
      </section>

      <section className="articles-content">
        <div className="articles-heading">
          <div>
            <p className="section-label">ALL ARTICLES</p>
            <h2>Learn something new</h2>
          </div>

          <span className="articles-count">
            {articles.length} {articles.length === 1 ? "article" : "articles"}
          </span>
        </div>

        <div className="articles-list">
          {loading ? (
            <p className="empty-articles">Loading articles...</p>
          ) : error ? (
            <p className="empty-articles">{error}</p>
          ) : articles.length === 0 ? (
            <p className="empty-articles">No articles published yet.</p>
          ) : (
            articles.map((article, index) => (
              <Link
                to={`/articles/${article._id}`}
                className="article-item"
                key={article._id}
              >
                <span className="article-number">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <div className="article-item-content">
                  <div className="article-meta-tag">
                    <span>{article.category.toUpperCase()}</span>

                    {article.createdAt && (
                      <>
                        <span>·</span>
                        <span>
                          {new Date(article.createdAt).toLocaleDateString()}
                        </span>
                      </>
                    )}
                  </div>

                  <h3>{article.title}</h3>

                  <p>
                    {article.content.length > 180
                      ? article.content.substring(0, 180) + "..."
                      : article.content}
                  </p>

                  <span className="read-article">
                    Read article <span>→</span>
                  </span>
                </div>
              </Link>
            ))
          )}
        </div>
      </section>
    </main>
  );
}

export default Articles;
