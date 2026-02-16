import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  return (
    <header className="navbar-wrap">
      <nav className="container navbar" aria-label="Main navigation">
        <Link to="/" className="logo" onClick={closeMenu}>
          <img src="/inneed-logo.svg" alt="" className="brand-mark" aria-hidden="true" />
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
          <NavLink
            to="/jobs"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
            onClick={closeMenu}
          >
            Find Jobs
          </NavLink>
          <span className="nav-divider" aria-hidden="true" />
          <Link to="/post-job" className="post-job-btn" onClick={closeMenu}>
            Post Job
          </Link>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
