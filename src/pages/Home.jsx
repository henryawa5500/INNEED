import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Hero from "../components/Hero";
import CategoryCard from "../components/CategoryCard";
import JobCard from "../components/JobCard";
import WorkerCard from "../components/WorkerCard";
import { useJobs } from "../context/JobsContext";
import { useWorkers } from "../context/WorkersContext";

function Home() {
  const navigate = useNavigate();
  const { jobs } = useJobs();
  const { workers } = useWorkers();
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Category data is derived from mock jobs to avoid duplicated state.
  const categories = useMemo(() => {
    const fixedOrder = [
      "Tutoring",
      "Delivery",
      "Event Staff",
      "Errands",
      "Cleaner",
      "Gardener",
      "Tailor",
      "Care Taker",
    ];

    return fixedOrder.map((name) => ({
      title: name,
      count: jobs.filter((job) => job.category === name).length,
    }));
  }, [jobs]);

  const featuredJobs = useMemo(() => {
    if (selectedCategory === "All") return jobs.slice(0, 4);
    return jobs.filter((job) => job.category === selectedCategory).slice(0, 4);
  }, [jobs, selectedCategory]);

  // Home search forwards state through query params so Jobs page can hydrate filters.
  const handleSearch = (term, location) => {
    const query = new URLSearchParams({ search: term, location }).toString();
    navigate(`/jobs?${query}`);
  };

  return (
    <>
      <Hero onSearch={handleSearch} />

      <section className="section container categories-section">
        <div className="section-head">
          <h2>
            Explore by <span>category</span>
          </h2>
          <button type="button" className="link-btn" onClick={() => navigate("/jobs")}>
            Show all jobs
          </button>
        </div>

        <div className="category-grid">
          {categories.map((category) => (
            <CategoryCard
              key={category.title}
              title={category.title}
              count={category.count}
              active={selectedCategory === category.title}
              onClick={(title) => {
                setSelectedCategory(title);
                navigate(`/jobs?category=${encodeURIComponent(title)}`);
              }}
            />
          ))}
        </div>
      </section>

      <section className="cta-wrap">
        <div className="container cta-banner">
          <h2>Start posting jobs today</h2>
          <p>Post trusted local jobs and connect with skilled workers in minutes.</p>
          <button type="button" onClick={() => navigate("/post-job")}>
            Post Job
          </button>
        </div>
      </section>

      <section className="section container featured-jobs-section">
        <div className="section-head">
          <h2>
            Featured <span>Jobs</span>
          </h2>
          <button type="button" className="link-btn" onClick={() => navigate("/jobs")}>
            Show all jobs
          </button>
        </div>

        <div className="card-grid jobs-grid">
          {featuredJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </section>

      <section className="section workers-section">
        <div className="container">
          <div className="section-head">
            <h2>
              Featured <span>Workers</span>
            </h2>
            <div className="section-actions">
              <button type="button" className="link-btn" onClick={() => navigate("/workers")}>
                Show all workers
              </button>
              <button type="button" className="link-btn" onClick={() => navigate("/create-profile")}>
                Create profile
              </button>
            </div>
          </div>
          <div className="card-grid worker-grid">
            {workers.slice(0, 6).map((worker) => (
              <WorkerCard key={worker.id} worker={worker} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;
