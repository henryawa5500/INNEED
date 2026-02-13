import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import JobCard from "../components/JobCard";
import { jobs } from "../data/jobs";

function Jobs() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  const initialCategory = searchParams.get("category") || "All";
  const initialLocation = searchParams.get("location") || "All";

  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);
  const [location, setLocation] = useState(initialLocation);

  // Filter options are generated from source data to stay in sync as data evolves.
  const categories = useMemo(() => ["All", ...new Set(jobs.map((job) => job.category))], []);
  const locations = useMemo(() => ["All", ...new Set(jobs.map((job) => job.location.split(", ").pop()))], []);

  // Keep URL query params aligned with local filter state for sharable links.
  useEffect(() => {
    const params = {};
    if (search) params.search = search;
    if (category !== "All") params.category = category;
    if (location !== "All") params.location = location;
    setSearchParams(params);
  }, [search, category, location, setSearchParams]);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const bySearch = `${job.title} ${job.description}`.toLowerCase().includes(search.toLowerCase());
      const byCategory = category === "All" || job.category === category;
      const byLocation = location === "All" || job.location.toLowerCase().includes(location.toLowerCase());
      return bySearch && byCategory && byLocation;
    });
  }, [search, category, location]);

  return (
    <section className="section container jobs-page">
      <h1>Find Jobs</h1>
      <p className="muted">Filter local gigs and jobs by category, keyword, and location.</p>

      <div className="filters">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title or keyword"
          aria-label="Search jobs"
        />

        <select value={category} onChange={(e) => setCategory(e.target.value)} aria-label="Filter by category">
          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <select value={location} onChange={(e) => setLocation(e.target.value)} aria-label="Filter by location">
          {locations.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      <div className="card-grid jobs-grid">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => <JobCard key={job.id} job={job} />)
        ) : (
          <p>No jobs found for the current filters.</p>
        )}
      </div>
    </section>
  );
}

export default Jobs;
