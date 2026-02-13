import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Hero from "../components/Hero";
import CategoryCard from "../components/CategoryCard";
import JobCard from "../components/JobCard";
import WorkerCard from "../components/WorkerCard";
import { jobs } from "../data/jobs";
import { workers } from "../data/workers";

function Home() {
  const navigate = useNavigate();
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
  }, []);

  const featuredJobs = useMemo(() => {
    if (selectedCategory === "All") return jobs.slice(0, 4);
    return jobs.filter((job) => job.category === selectedCategory).slice(0, 4);
  }, [selectedCategory]);

  // Home search forwards state through query params so Jobs page can hydrate filters.
  const handleSearch = (term, location) => {
    const query = new URLSearchParams({ search: term, location }).toString();
    navigate(`/jobs?${query}`);
  };

  return (
    <>
      <Hero onSearch={handleSearch} />

      <section className="section container">
        <div className="section-head">
          <h2>Explore by category</h2>
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
          <button type="button">Post Job</button>
        </div>
      </section>

      <section className="section container">
        <div className="section-head">
          <h2>Featured Jobs</h2>
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
            <h2>Featured Workers</h2>
          </div>
          <div className="card-grid worker-grid">
            {workers.map((worker) => (
              <WorkerCard key={worker.id} worker={worker} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;
