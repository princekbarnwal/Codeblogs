import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_URL } from "../lib/api";

function Articles() {
  const [articles, setArticles] = useState([]);
  const [search, setSearch] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const loadArticles = async (searchTerm = "", pageNumber = 1) => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/articles?search=${encodeURIComponent(searchTerm)}&page=${pageNumber}&limit=10`
      );
      const data = await response.json();

      if (!response.ok)
        throw new Error(
          data.error ||
            data.message ||
            "Unable to load articles."
        );

      setArticles(data.articles);
      setPage(data.page);
      setTotalPages(data.totalPages);
    } catch (loadError) {
      setError(
        loadError.message ||
          "Unable to connect to the server."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadArticles();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const term = search.trim();
    setAppliedSearch(term);
    loadArticles(term, 1);
  };

  const handleClear = () => {
    setSearch("");
    setAppliedSearch("");
    loadArticles("", 1);
  };

  const goToPage = (pageNumber) => {
    loadArticles(appliedSearch, pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="articles-page">
      {/* Search bar */}
      <form className="blog-search" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search articles..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button type="submit" disabled={loading}>
          Search
        </button>

        {search && (
          <button
            type="button"
            onClick={handleClear}
            disabled={loading}
          >
            Clear
          </button>
        )}
      </form>

      <section className="articles-hero">
        <div>
          <p className="eyebrow">KNOWLEDGE BASE</p>

          <h1>
            Guides, concepts
            <br />
            & technical deep-dives.
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
        </div>

        <div className="articles-list">
          {loading ? (
            <p className="empty-articles">
              Loading articles...
            </p>
          ) : error ? (
            <p className="empty-articles">{error}</p>
          ) : articles.length === 0 ? (
            <p className="empty-articles">
              {appliedSearch
                ? "No articles found. Try another search."
                : "No articles published yet."}
            </p>
          ) : (
            articles.map((article) => (
              <Link
                to={`/articles/${article._id}`}
                className="article-item"
                key={article._id}
              >
                <div className="article-item-content">
                  <div className="article-meta-tag">
                    <span>
                      {article.category.toUpperCase()}
                    </span>

                    {article.createdAt && (
                      <>
                        <span>·</span>
                        <span>
                          {new Date(
                            article.createdAt
                          ).toLocaleDateString()}
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

        {/* Pagination */}
        {totalPages > 1 && !loading && !error && (
          <nav className="pagination" aria-label="Pagination">
            <button
              type="button"
              onClick={() => goToPage(page - 1)}
              disabled={page <= 1}
            >
              ← Previous
            </button>

            <span>
              Page {page} of {totalPages}
            </span>

            <button
              type="button"
              onClick={() => goToPage(page + 1)}
              disabled={page >= totalPages}
            >
              Next →
            </button>
          </nav>
        )}
      </section>
    </main>
  );
}

export default Articles;