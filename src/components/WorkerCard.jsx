import { Link } from "react-router-dom";

function WorkerCard({ worker }) {
  return (
    <article className="worker-card">
      <h3>{worker.service}</h3>
      <p>{worker.name}</p>
      <p className="muted">{worker.location}</p>
      <p className="muted">
        Rating: {worker.rating} | Jobs done: {worker.jobsDone}
      </p>
      <Link to={`/workers/${worker.id}`} className="ghost-btn">
        View Profile
      </Link>
    </article>
  );
}

export default WorkerCard;
