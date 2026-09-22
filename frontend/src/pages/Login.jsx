import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { saveTokens } from "../lib/auth";

function Login() {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: identifier,
          email: identifier,
          password,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Unable to sign in.");
        return;
      }

      saveTokens(data);
      navigate("/");
    } catch {
      setError("Unable to connect to the server.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="create-page auth-page">
      <section className="create-container auth-container">
        <Link to="/" className="back-link">
          Back to home
        </Link>
        <div className="create-header auth-header">
          <h1>Welcome back</h1>
          <p>Sign in to continue writing.</p>
        </div>
        <form className="blog-form auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="login-identifier">Username or email</label>
            <input
              id="login-identifier"
              value={identifier}
              onChange={(event) => setIdentifier(event.target.value)}
              required
              autoComplete="username"
            />
          </div>
          <div className="form-group">
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
          {error && <p className="form-error">{error}</p>}
          <div className="form-footer">
            <span className="writing-hint">
              Don't have an account?{" "}
              <Link to="/register" className="text-link">
                Register
              </Link>
            </span>
            <button
              type="submit"
              className="publish-button"
              disabled={submitting}
            >
              {submitting ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

export default Login;
