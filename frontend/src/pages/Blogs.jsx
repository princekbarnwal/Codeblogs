import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Blogs() {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/blogs")
      .then((res) => res.json())
      .then((data) => setBlogs(data))
      .catch((error) => console.log(error));
  }, []);

  return (
    <main className="blogs-page">
      <section className="blogs-hero">
        <div>
          <p className="eyebrow">MY WRITINGS</p>

          <h1>
            Thoughts, ideas
            <br />& things I've learned.
          </h1>

          <p className="blogs-description">
            A collection of my experiences, experiments, and lessons from
            building software.
          </p>
        </div>

        <Link to="/create-blog" className="create-blog-btn">
          + Write a Blog
        </Link>
      </section>

      <section className="blogs-content">
        <div className="blogs-heading">
          <div>
            <p className="section-label">ALL POSTS</p>
            <h2>Latest writing</h2>
          </div>

          <span className="blog-count">{blogs.length} posts</span>
        </div>

        <div className="blogs-list">
          {blogs.length === 0 ? (
            <p className="empty-blogs">No blogs published yet.</p>
          ) : (
            blogs.map((blog, index) => (
              <Link
                to={`/blogs/${blog._id}`}
                className="blog-item"
                key={blog._id}
              >
                <span className="blog-number">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <div className="blog-item-content">
                  <div className="blog-meta">
                    <span>BLOG</span>

                    {blog.createdAt && (
                      <>
                        <span>·</span>
                        <span>
                          {new Date(blog.createdAt).toLocaleDateString()}
                        </span>
                      </>
                    )}
                  </div>

                  <h3>{blog.title}</h3>

                  <p>
                    {blog.article.length > 180
                      ? blog.article.substring(0, 180) + "..."
                      : blog.article}
                  </p>

                  <span className="read-blog">
                    Read blog <span>→</span>
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

export default Blogs;
