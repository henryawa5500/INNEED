import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useJobs } from "../context/JobsContext";

function PostJob() {
  const navigate = useNavigate();
  const { addJob } = useJobs();

  const categories = useMemo(
    () => ["Cleaner", "Tutoring", "Delivery", "Event Staff", "Errands", "Gardener", "Tailor", "Care Taker"],
    []
  );
  const jobTypes = useMemo(() => ["Full-Time", "Part-Time", "Contract", "Gig", "Live-In"], []);

  const [form, setForm] = useState({
    title: "",
    category: "Cleaner",
    location: "",
    pay: "",
    type: "Full-Time",
    postedBy: "",
    description: "",
    requirements: "",
    contactWhatsapp: "2348000000000",
  });
  const [error, setError] = useState("");

  const onChange = (event) => {
    const { name, value } = event.target;
    if (error) setError("");
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!form.title.trim() || !form.location.trim() || !form.pay.trim() || !form.postedBy.trim() || !form.description.trim()) {
      setError("Please fill all required fields before posting.");
      return;
    }

    const requirements = form.requirements
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    const created = addJob({
      ...form,
      requirements: requirements.length > 0 ? requirements : ["No specific requirements listed."],
    });

    navigate(`/jobs/${created.id}`);
  };

  return (
    <section className="section container post-job-page">
      <h1>Post a Job</h1>
      <p className="muted">Fill this form to publish your local job on INNEED.</p>

      <form className="post-job-form" onSubmit={handleSubmit}>
        <label>
          Job Title *
          <input name="title" value={form.title} onChange={onChange} placeholder="Home Cleaner Needed" />
        </label>

        <label>
          Category *
          <select name="category" value={form.category} onChange={onChange}>
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <label>
          Location *
          <input name="location" value={form.location} onChange={onChange} placeholder="Wuse, Abuja" />
        </label>

        <label>
          Pay *
          <input name="pay" value={form.pay} onChange={onChange} placeholder="NGN 80,000/month" />
        </label>

        <label>
          Job Type *
          <select name="type" value={form.type} onChange={onChange}>
            {jobTypes.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <label>
          Posted By *
          <input name="postedBy" value={form.postedBy} onChange={onChange} placeholder="Business or full name" />
        </label>

        <label className="full-row">
          Job Description *
          <textarea
            name="description"
            value={form.description}
            onChange={onChange}
            rows={5}
            placeholder="Describe duties, schedule, and expectations..."
          />
        </label>

        <label className="full-row">
          Requirements (comma separated)
          <input
            name="requirements"
            value={form.requirements}
            onChange={onChange}
            placeholder="2+ years experience, punctual, lives nearby"
          />
        </label>

        <label className="full-row">
          WhatsApp Number (with country code)
          <input
            name="contactWhatsapp"
            value={form.contactWhatsapp}
            onChange={onChange}
            placeholder="2348012345678"
          />
        </label>

        {error ? <p className="form-error">{error}</p> : null}

        <div className="post-job-actions full-row">
          <button type="button" className="ghost-btn" onClick={() => navigate("/jobs")}>
            Cancel
          </button>
          <button type="submit" className="apply-btn">
            Publish Job
          </button>
        </div>
      </form>
    </section>
  );
}

export default PostJob;
