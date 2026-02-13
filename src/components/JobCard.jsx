import { Link } from "react-router-dom";

function JobCard({ job }) {
  return (
    <article className="job-card">
      <span className="pill">{job.type}</span>
      <h3>{job.title}</h3>
      <p className="muted">{job.postedBy}</p>
      <p className="muted">{job.location}</p>
      <p className="job-pay">{job.pay}</p>
      <p className="job-desc">{job.description}</p>
      <Link to={`/jobs/${job.id}`} className="ghost-btn">
        View Details
      </Link>
    </article>
  );
}

export default JobCard;
