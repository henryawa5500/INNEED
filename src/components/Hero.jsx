import { useState } from "react";

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
        <div>
          <p className="eyebrow">Trusted by local communities across Nigeria</p>
          <h1>Discover Local Jobs Near You</h1>
          <p className="hero-copy">
            Connect with verified people hiring for trusted services in your area.
          </p>

          <form className="search-box" onSubmit={submitSearch}>
            <input
              type="text"
              placeholder="Job title"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              aria-label="Search by job title"
            />
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              aria-label="Select location"
            >
              <option value="Abuja">Abuja</option>
              <option value="Lagos">Lagos</option>
              <option value="Port Harcourt">Port Harcourt</option>
              <option value="Kano">Kano</option>
            </select>
            <button type="submit">Search</button>
          </form>
        </div>

        <div className="hero-card" aria-hidden="true">
          <div className="hero-badge">500+ new gigs this week</div>
          <p>From cleaners to tutors, find quality opportunities fast.</p>
        </div>
      </div>
    </section>
  );
}

export default Hero;
