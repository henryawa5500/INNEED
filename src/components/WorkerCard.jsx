function WorkerCard({ worker }) {
  return (
    <article className="worker-card">
      <h3>{worker.service}</h3>
      <p>
        {worker.name} | {worker.location}
      </p>
      <p className="muted">
        Rating: {worker.rating} | Jobs done: {worker.jobsDone}
      </p>
      <button type="button" className="ghost-btn">
        View Profile
      </button>
    </article>
  );
}

export default WorkerCard;
