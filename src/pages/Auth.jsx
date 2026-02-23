import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Auth() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated, user, login, register, logout } = useAuth();

  const nextPath = useMemo(() => searchParams.get("next") || "/", [searchParams]);

  const [mode, setMode] = useState("login");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "employer",
    location: "",
    phone: "",
  });

  const onChange = (event) => {
    const { name, value } = event.target;
    if (error) setError("");
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!form.email.trim() || !form.password.trim()) {
      setError("Email and password are required.");
      return;
    }

    if (mode === "register" && (!form.name.trim() || !form.role)) {
      setError("Name and role are required for registration.");
      return;
    }

    setSubmitting(true);

    try {
      if (mode === "login") {
        await login({ email: form.email, password: form.password });
      } else {
        await register(form);
      }
      navigate(nextPath, { replace: true });
    } catch (err) {
      setError(err.message || "Authentication failed.");
    } finally {
      setSubmitting(false);
    }
  };

  if (isAuthenticated) {
    return (
      <section className="section container auth-page">
        <h1>Account</h1>
        <p className="muted">
          Signed in as {user?.name} ({user?.role})
        </p>
        <div className="post-job-actions">
          <button type="button" className="ghost-btn" onClick={() => navigate(nextPath)}>
            Continue
          </button>
          <button type="button" className="apply-btn" onClick={logout}>
            Logout
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="section container auth-page">
      <h1>{mode === "login" ? "Sign In" : "Create Account"}</h1>
      <p className="muted">Use your INNEED account to post jobs or create worker profiles.</p>

      <div className="auth-switch">
        <button type="button" className={`ghost-btn ${mode === "login" ? "auth-active" : ""}`} onClick={() => setMode("login")}>
          Login
        </button>
        <button type="button" className={`ghost-btn ${mode === "register" ? "auth-active" : ""}`} onClick={() => setMode("register")}>
          Register
        </button>
      </div>

      <form className="post-job-form" onSubmit={onSubmit}>
        {mode === "register" ? (
          <label>
            Full Name *
            <input name="name" value={form.name} onChange={onChange} placeholder="Henry A." />
          </label>
        ) : null}

        <label>
          Email *
          <input name="email" type="email" value={form.email} onChange={onChange} placeholder="you@example.com" />
        </label>

        <label>
          Password *
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={onChange}
            placeholder="Enter your password"
          />
        </label>

        {mode === "register" ? (
          <>
            <label>
              Role *
              <select name="role" value={form.role} onChange={onChange}>
                <option value="employer">Employer</option>
                <option value="worker">Worker</option>
              </select>
            </label>

            <label>
              Location
              <input name="location" value={form.location} onChange={onChange} placeholder="Abuja" />
            </label>

            <label className="full-row">
              Phone
              <input name="phone" value={form.phone} onChange={onChange} placeholder="2348012345678" />
            </label>
          </>
        ) : null}

        {error ? <p className="form-error">{error}</p> : null}

        <div className="post-job-actions full-row">
          <button type="submit" className="apply-btn" disabled={submitting}>
            {submitting ? "Please wait..." : mode === "login" ? "Sign In" : "Create Account"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default Auth;
