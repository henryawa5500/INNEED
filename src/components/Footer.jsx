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
            f
          </a>
          <a href="#!" className="social-chip" aria-label="Instagram">
            ig
          </a>
          <a href="#!" className="social-chip" aria-label="Dribbble">
            db
          </a>
          <a href="#!" className="social-chip" aria-label="LinkedIn">
            in
          </a>
          <a href="#!" className="social-chip" aria-label="Twitter">
            tw
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
