function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <p className="footer-brand">INNEED</p>
          <p>Helping Nigerians connect with trusted local job opportunities.</p>
        </div>

        <div>
          <h4>About</h4>
          <ul>
            <li>Jobs</li>
            <li>Terms</li>
            <li>Privacy</li>
          </ul>
        </div>

        <div>
          <h4>Resources</h4>
          <ul>
            <li>Guides</li>
            <li>Support</li>
            <li>Contact</li>
          </ul>
        </div>

        <div>
          <h4>Get job alerts</h4>
          <div className="footer-form">
            <input type="email" placeholder="Email address" aria-label="Email" />
            <button type="button">Subscribe</button>
          </div>
        </div>
      </div>
      <p className="copyright">2026 INNEED. All rights reserved.</p>
    </footer>
  );
}

export default Footer;
