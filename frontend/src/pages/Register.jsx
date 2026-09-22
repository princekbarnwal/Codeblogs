import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const updateField = (event) =>
    setForm({ ...form, [event.target.name]: event.target.value });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const response = await fetch("http://localhost:3000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Unable to create the account.");
        return;
      }

      navigate("/login");
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
          <h1>Create an account</h1>
          <p>Start writing with us.</p>
        </div>
        <form className="blog-form auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="register-name">Name</label>
            <input
              id="register-name"
              name="name"
              value={form.name}
              onChange={updateField}
              required
              autoComplete="name"
            />
          </div>
          <div className="form-group">
            <label htmlFor="register-username">Username</label>
            <input
              id="register-username"
              name="username"
              value={form.username}
              onChange={updateField}
              required
              minLength="8"
              maxLength="20"
              pattern="[a-z0-9._]+"
              autoComplete="username"
            />
          </div>
          <div className="form-group">
            <label htmlFor="register-email">Email</label>
            <input
              id="register-email"
              name="email"
              type="email"
              value={form.email}
              onChange={updateField}
              required
              autoComplete="email"
            />
          </div>
          <div className="form-group">
            <label htmlFor="register-password">Password</label>
            <input
              id="register-password"
              name="password"
              type="password"
              value={form.password}
              onChange={updateField}
              required
              autoComplete="new-password"
            />
          </div>
          {error && <p className="form-error">{error}</p>}
          <div className="form-footer">
            <span className="writing-hint">
              Already have an account?{" "}
              <Link to="/login" className="text-link">
                Login
              </Link>
            </span>
            <button
              type="submit"
              className="publish-button"
              disabled={submitting}
            >
              {submitting ? "Creating..." : "Create account"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

export default Register;
