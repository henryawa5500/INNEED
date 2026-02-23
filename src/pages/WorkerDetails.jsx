import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useWorkers } from "../context/WorkersContext";

function WorkerDetails() {
  const { id } = useParams();
  const { workers, getWorkerById } = useWorkers();
  const [worker, setWorker] = useState(() => workers.find((item) => item.id === id) || null);
  const [status, setStatus] = useState(worker ? "ready" : "loading");

  useEffect(() => {
    let active = true;

    const existing = workers.find((item) => item.id === id);
    if (existing) {
      setWorker(existing);
      setStatus("ready");
      return () => {
        active = false;
      };
    }

    const load = async () => {
      setStatus("loading");
      try {
        const fetched = await getWorkerById(id);
        if (!active) return;
        setWorker(fetched);
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
  }, [id, workers, getWorkerById]);

  if (status === "loading") {
    return (
      <section className="section container">
        <h1>Loading worker...</h1>
      </section>
    );
  }

  if (status === "notfound" || !worker) {
    return (
      <section className="section container">
        <h1>Worker not found</h1>
        <Link to="/workers" className="link-btn">
          Back to workers
        </Link>
      </section>
    );
  }

  const contactNumber = (worker.whatsapp || worker.phone || "2348000000000").replace(/\D/g, "");
  const whatsappMessage = encodeURIComponent(
    `Hi ${worker.name}, I found your profile on INNEED and would like to hire your ${worker.service} service.`
  );
  const whatsappUrl = `https://wa.me/${contactNumber}?text=${whatsappMessage}`;

  const skills = Array.isArray(worker.skills) && worker.skills.length > 0 ? worker.skills : [worker.service];

  return (
    <section className="section container worker-details">
      <Link to="/workers" className="link-btn">
        Back to workers
      </Link>

      <article className="worker-details-card">
        <h1>{worker.name}</h1>
        <p className="muted">
          {worker.service} | {worker.location}
        </p>
        <p className="muted">
          Rating: {worker.rating} | Jobs done: {worker.jobsDone}
        </p>

        <h3>About</h3>
        <p>{worker.bio || `${worker.name} is available for ${worker.service} jobs in ${worker.location}.`}</p>

        <h3>Experience</h3>
        <p>{worker.experience || "Experience details were not provided yet."}</p>

        <h3>Skills</h3>
        <ul>
          {skills.map((skill) => (
            <li key={skill}>{skill}</li>
          ))}
        </ul>

        <p className="muted">Phone: {worker.phone || "Not provided"}</p>

        <a href={whatsappUrl} target="_blank" rel="noreferrer" className="apply-btn">
          Contact on WhatsApp
        </a>
      </article>
    </section>
  );
}

export default WorkerDetails;
