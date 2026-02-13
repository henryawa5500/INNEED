import { Link, useParams } from "react-router-dom";
import { jobs } from "../data/jobs";

function JobDetails() {
  const { id } = useParams();
  // Detail page resolves the record directly from local mock data.
  const job = jobs.find((item) => item.id === id);

  if (!job) {
    return (
      <section className="section container">
        <h1>Job not found</h1>
        <Link to="/jobs" className="link-btn">
          Back to jobs
        </Link>
      </section>
    );
  }

  const whatsappMessage = encodeURIComponent(`Hi, I am interested in the ${job.title} role on INNEED.`);
  const whatsappUrl = `https://wa.me/2348000000000?text=${whatsappMessage}`;

  return (
    <section className="section container job-details">
      <Link to="/jobs" className="link-btn">
        Back to jobs
      </Link>
      <h1>{job.title}</h1>
      <p className="muted">
        {job.category} | {job.type} | {job.location}
      </p>
      <p className="job-pay">{job.pay}</p>
      <p>{job.description}</p>

      <h3>Requirements</h3>
      <ul>
        {job.requirements.map((requirement) => (
          <li key={requirement}>{requirement}</li>
        ))}
      </ul>

      <a href={whatsappUrl} target="_blank" rel="noreferrer" className="apply-btn">
        Apply via WhatsApp
      </a>
    </section>
  );
}

export default JobDetails;
