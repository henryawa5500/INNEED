function SocialIcon({ name }) {
  const commonProps = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.8",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    className: "social-icon",
    "aria-hidden": "true",
  };

  switch (name) {
    case "facebook":
      return (
        <svg {...commonProps}>
          <path d="M14 8h-1.5A1.5 1.5 0 0 0 11 9.5V12h3l-.5 3H11v5" />
          <path d="M8 12h3" />
        </svg>
      );
    case "instagram":
      return (
        <svg {...commonProps}>
          <rect x="4" y="4" width="16" height="16" rx="4" />
          <circle cx="12" cy="12" r="3.5" />
          <circle cx="17" cy="7" r="0.7" fill="currentColor" stroke="none" />
        </svg>
      );
    case "dribbble":
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="12" r="9" />
          <path d="M6 8c3 1 6 4 8 10" />
          <path d="M18 8.5c-3.2 0.2-6.2 1.6-8.5 4" />
          <path d="M4.5 12.5c2.5-0.6 5.8-0.3 8.4 1.1" />
        </svg>
      );
    case "linkedin":
      return (
        <svg {...commonProps}>
          <rect x="4.5" y="9" width="3" height="9" />
          <circle cx="6" cy="6" r="1.5" />
          <path d="M11 18v-5.4c0-1.9 1-3.1 2.8-3.1 1.7 0 2.7 1.1 2.7 3.1V18" />
          <path d="M11 12.2c0-1.8 1.1-2.9 2.8-2.9" />
        </svg>
      );
    case "x":
      return (
        <svg {...commonProps}>
          <path d="M5 5l14 14" />
          <path d="M19 5 5 19" />
        </svg>
      );
    default:
      return null;
  }
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand-col">
          <p className="footer-brand">
            <img src="/inneed-logo.svg" alt="" className="brand-mark" aria-hidden="true" />
            INNEED
          </p>
          <p>Great platform for the job seeker looking to find blue collar jobs and earn. Find your quick job easier.</p>
        </div>

        <div>
          <h4>About</h4>
          <ul>
            <li>
              <a href="#!">Jobs</a>
            </li>
            <li>
              <a href="#!">Communication</a>
            </li>
            <li>
              <a href="#!">Terms</a>
            </li>
            <li>
              <a href="#!">Policies</a>
            </li>
            <li>
              <a href="#!">Privacy Policy</a>
            </li>
          </ul>
        </div>

        <div>
          <h4>Resources</h4>
          <ul>
            <li>
              <a href="#!">Help Docs</a>
            </li>
            <li>
              <a href="#!">Guide</a>
            </li>
            <li>
              <a href="#!">Updates</a>
            </li>
            <li>
              <a href="#!">Contact Us</a>
            </li>
          </ul>
        </div>

        <div>
          <h4>Get job notifications</h4>
          <p className="footer-copy">The latest job news, articles, sent to your inbox weekly.</p>
          <div className="footer-form">
            <input type="email" placeholder="Email address" aria-label="Email" />
            <button type="button">Subscribe</button>
          </div>
        </div>
      </div>

      <div className="container footer-bottom">
        <p className="copyright">2026 @ Henryawa. All rights reserved.</p>
        <div className="social-row">
          <a href="#!" className="social-chip" aria-label="Facebook">
            <SocialIcon name="facebook" />
          </a>
          <a href="#!" className="social-chip" aria-label="Instagram">
            <SocialIcon name="instagram" />
          </a>
          <a href="#!" className="social-chip" aria-label="Dribbble">
            <SocialIcon name="dribbble" />
          </a>
          <a href="#!" className="social-chip" aria-label="LinkedIn">
            <SocialIcon name="linkedin" />
          </a>
          <a href="#!" className="social-chip" aria-label="X">
            <SocialIcon name="x" />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
