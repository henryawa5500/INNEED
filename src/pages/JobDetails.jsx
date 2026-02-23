import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useJobs } from "../context/JobsContext";

function JobDetails() {
  const { id } = useParams();
  const { jobs, getJobById } = useJobs();
  const [job, setJob] = useState(() => jobs.find((item) => item.id === id) || null);
  const [status, setStatus] = useState(job ? "ready" : "loading");

  useEffect(() => {
    let active = true;

    const existing = jobs.find((item) => item.id === id);
    if (existing) {
      setJob(existing);
      setStatus("ready");
      return () => {
        active = false;
      };
    }

    const load = async () => {
      setStatus("loading");
      try {
        const fetched = await getJobById(id);
        if (!active) return;
        setJob(fetched);
        setStatus("ready");
      } catch (_err) {
        if (!active) return;
        setStatus("notfound");
      }
    };

    load();

    return () => {
      active = false;
    };
  }, [id, jobs, getJobById]);

  if (status === "loading") {
    return (
      <section className="section container">
        <h1>Loading job...</h1>
      </section>
    );
  }

  if (status === "notfound" || !job) {
    return (
      <section className="section container">
        <h1>Job not found</h1>
        <Link to="/jobs" className="link-btn">
          Back to jobs
        </Link>
      </section>
    );
  }

  const whatsappNumber = (job.contactWhatsapp || "2348000000000").replace(/\D/g, "");
  const whatsappMessage = encodeURIComponent(`Hi, I am interested in the ${job.title} role on INNEED.`);
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;
  const requirements = Array.isArray(job.requirements) ? job.requirements : [];

  return (
    <section className="section container job-details">
      <Link to="/jobs" className="link-btn">
        Back to jobs
      </Link>
      <h1>{job.title}</h1>
      <p className="muted">
        {job.category} | {job.type} | {job.location}
      </p>
      <p className="job-pay">{job.pay || job.salary || "Negotiable"}</p>
      <p>{job.description}</p>

      <h3>Requirements</h3>
      <ul>
        {requirements.length > 0 ? (
          requirements.map((requirement) => <li key={requirement}>{requirement}</li>)
        ) : (
          <li>No specific requirements listed.</li>
        )}
      </ul>

      <a href={whatsappUrl} target="_blank" rel="noreferrer" className="apply-btn">
        Apply via WhatsApp
      </a>
    </section>
  );
}

export default JobDetails;
