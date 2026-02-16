import { useState } from "react";

function SearchIcon() {
  return (
    <svg className="field-icon" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
      <line x1="16.6" y1="16.6" x2="21" y2="21" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg className="field-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 21s-6-5.2-6-10a6 6 0 1 1 12 0c0 4.8-6 10-6 10z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <circle cx="12" cy="11" r="2.2" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function Hero({ onSearch }) {
  const [term, setTerm] = useState("");
  const [location, setLocation] = useState("Abuja");

  const submitSearch = (event) => {
    event.preventDefault();
    onSearch(term, location);
  };

  return (
    <section className="hero-section">
      <div className="container hero-grid">
        <div className="hero-content">
          <h1 className="hero-title">
            Discover
            <br />
            Local Jobs
            <br />
            <span>Near You</span>
          </h1>
          <div className="hero-scribble" aria-hidden="true">
            <span />
            <span />
          </div>
          <p className="hero-copy">
            Great platform for the job seeker that are searching for blue collar jobs in there area.
          </p>

          <form className="search-box" onSubmit={submitSearch}>
            <label className="field-group" htmlFor="hero-search">
              <SearchIcon />
              <input
                id="hero-search"
                type="text"
                placeholder="Job title or keyword"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                aria-label="Search by job title"
              />
            </label>

            <label className="field-group" htmlFor="hero-location">
              <PinIcon />
              <select
                id="hero-location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                aria-label="Select location"
              >
                <option value="Abuja">Kubwa, Abuja</option>
                <option value="Lagos">Ikeja, Lagos</option>
                <option value="Port Harcourt">GRA, Port Harcourt</option>
                <option value="Kano">Nassarawa, Kano</option>
              </select>
            </label>

            <button type="submit" className="hero-search-btn">
              Search my job
            </button>
          </form>
        </div>

        <div className="hero-visual" aria-hidden="true">
          <div className="hero-photo" />
          <div className="hero-glow" />
        </div>
      </div>
    </section>
  );
}

export default Hero;
