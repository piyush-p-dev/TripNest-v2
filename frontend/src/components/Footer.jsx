function Footer() {
  return (
    <footer className="footer ">
      <div className="footer-container">
        <div className="footer-col">
          <h3>Company</h3>
          <a href="/about">About Us</a>
          <a href="/services">Our Services</a>
          <a href="/privacy">Privacy Policy</a>
        </div>

        <div className="footer-col">
          <h3>Get Help</h3>
          <a href="/faq">FAQ</a>
          <a href="/contact">Contact</a>
          <a href="/payment">Payment Options</a>
        </div>

        <div className="footer-col">
          <h3>Explore</h3>
          <a href="/destinations">Destinations</a>
          <a href="/blog">Blog</a>
        </div>

        <div className="footer-col social">
          <h3>Follow Us</h3>
          <div className="footer-socials">
            <a
              href="https://www.facebook.com/login"
              target="_blank"
              rel="noopener noreferrer"
              title="Login to Facebook"
            >
              <i className="fa-brands fa-facebook-f"></i>
            </a>

            <a
              href="https://twitter.com/login"
              target="_blank"
              rel="noopener noreferrer"
              title="Login to Twitter"
            >
              <i className="fa-brands fa-twitter"></i>
            </a>

            <a
              href="https://www.instagram.com/accounts/login/"
              target="_blank"
              rel="noopener noreferrer"
              title="Login to Instagram"
            >
              <i className="fa-brands fa-instagram"></i>
            </a>

            <a
              href="https://www.linkedin.com/login"
              target="_blank"
              rel="noopener noreferrer"
              title="Login to LinkedIn"
            >
              <i className="fa-brands fa-linkedin-in"></i>
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        &copy; 2025 TripNest Private Limited. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
