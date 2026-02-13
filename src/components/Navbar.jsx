import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  return (
    <header className="navbar-wrap">
      <nav className="container navbar" aria-label="Main navigation">
        <Link to="/" className="logo" onClick={closeMenu}>
          <span className="logo-dot" aria-hidden="true" />
          INNEED
        </Link>

        <button
          className="menu-toggle"
          aria-label="Toggle menu"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <span />
          <span />
          <span />
        </button>

        <div className={`nav-links ${isOpen ? "open" : ""}`}>
          <NavLink to="/jobs" className="nav-link" onClick={closeMenu}>
            Find Jobs
          </NavLink>
          <button type="button" className="post-job-btn" onClick={closeMenu}>
            Post Job
          </button>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
