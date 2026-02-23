import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWorkers } from "../context/WorkersContext";
import { useAuth } from "../context/AuthContext";

function CreateProfile() {
  const navigate = useNavigate();
  const { addWorker } = useWorkers();
  const { user, token, isAuthenticated } = useAuth();

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    service: "",
    location: "",
    bio: "",
    experience: "",
    skills: "",
    phone: "",
    whatsapp: "",
  });

  useEffect(() => {
    if (!user) return;
    setForm((prev) => ({
      ...prev,
      name: prev.name || user.name || "",
      location: prev.location || user.location || "",
      phone: prev.phone || user.phone || "",
      whatsapp: prev.whatsapp || user.phone || "",
    }));
  }, [user]);

  const onChange = (event) => {
    const { name, value } = event.target;
    if (error) setError("");
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.name.trim() || !form.service.trim() || !form.location.trim()) {
      setError("Please fill name, service, and location to create your profile.");
      return;
    }

    const skills = form.skills
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    setSubmitting(true);

    try {
      const created = await addWorker(
        {
          ...form,
          skills,
        },
        token
      );

      navigate(`/workers/${created.id}`);
    } catch (err) {
      setError(err.message || "Failed to create worker profile.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isAuthenticated || user?.role !== "worker") {
    return (
      <section className="section container create-profile-page">
        <h1>Create Worker Profile</h1>
        <p className="muted">You need to sign in with a worker account before creating a profile.</p>
        <button
          type="button"
          className="apply-btn"
          onClick={() => navigate(`/auth?next=${encodeURIComponent("/create-profile")}`)}
        >
          Sign In as Worker
        </button>
      </section>
    );
  }

  return (
    <section className="section container create-profile-page">
      <h1>Create Worker Profile</h1>
      <p className="muted">Set up your profile so clients can view and contact you.</p>

      <form className="post-job-form" onSubmit={handleSubmit}>
        <label>
          Full Name *
          <input name="name" value={form.name} onChange={onChange} placeholder="John Okeke" />
        </label>

        <label>
          Service *
          <input name="service" value={form.service} onChange={onChange} placeholder="Home Cleaner" />
        </label>

        <label>
          Location *
          <input name="location" value={form.location} onChange={onChange} placeholder="Kubwa, Abuja" />
        </label>

        <label>
          Phone Number
          <input name="phone" value={form.phone} onChange={onChange} placeholder="2348012345678" />
        </label>

        <label className="full-row">
          WhatsApp Number (with country code)
          <input name="whatsapp" value={form.whatsapp} onChange={onChange} placeholder="2348012345678" />
        </label>

        <label className="full-row">
          Bio
          <textarea
            name="bio"
            value={form.bio}
            onChange={onChange}
            rows={4}
            placeholder="Short intro about your service and reliability."
          />
        </label>

        <label className="full-row">
          Experience
          <textarea
            name="experience"
            value={form.experience}
            onChange={onChange}
            rows={4}
            placeholder="How long you have worked and the types of jobs you handle."
          />
        </label>

        <label className="full-row">
          Skills (comma separated)
          <input name="skills" value={form.skills} onChange={onChange} placeholder="Laundry, Deep cleaning, Ironing" />
        </label>

        {error ? <p className="form-error">{error}</p> : null}

        <div className="post-job-actions full-row">
          <button type="button" className="ghost-btn" onClick={() => navigate("/workers")}>Cancel</button>
          <button type="submit" className="apply-btn" disabled={submitting}>
            {submitting ? "Creating..." : "Create Profile"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default CreateProfile;
