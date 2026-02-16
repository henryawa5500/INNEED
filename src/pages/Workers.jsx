import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import WorkerCard from "../components/WorkerCard";
import { useWorkers } from "../context/WorkersContext";

function Workers() {
  const navigate = useNavigate();
  const { workers } = useWorkers();
  const [search, setSearch] = useState("");
  const [service, setService] = useState("All");

  const services = useMemo(() => ["All", ...new Set(workers.map((worker) => worker.service))], [workers]);

  const filteredWorkers = useMemo(() => {
    return workers.filter((worker) => {
      const bySearch = `${worker.name} ${worker.service} ${worker.location}`
        .toLowerCase()
        .includes(search.toLowerCase());
      const byService = service === "All" || worker.service === service;
      return bySearch && byService;
    });
  }, [workers, search, service]);

  return (
    <section className="section container workers-page">
      <div className="section-head">
        <h1>Find Workers</h1>
        <button type="button" className="post-job-btn" onClick={() => navigate("/create-profile")}>
          Create Profile
        </button>
      </div>
      <p className="muted">Browse worker profiles by service, location, and name.</p>

      <div className="filters">
        <input
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by worker name, service, or location"
          aria-label="Search workers"
        />
        <select value={service} onChange={(event) => setService(event.target.value)} aria-label="Filter by service">
          {services.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      <div className="card-grid worker-grid">
        {filteredWorkers.length > 0 ? (
          filteredWorkers.map((worker) => <WorkerCard key={worker.id} worker={worker} />)
        ) : (
          <p>No worker profile matches the current filters.</p>
        )}
      </div>
    </section>
  );
}

export default Workers;
