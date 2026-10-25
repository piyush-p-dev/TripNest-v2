import { useNavigate } from "react-router-dom";
function Contact() {
  const navigate = useNavigate();
  return (
    <div className="contact-wrapper">
      <div className="contact-card">
        <div className="contact-info">
          <h2>Contact TripNest</h2>
          <p>
            Have questions about a booking or listing your property?
            <br />
            We’re always happy to help you out.
          </p>
        </div>

        <div className="contact-form">
          <h3>Send Us a Message</h3>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              navigate("/contact/thankyou");
            }}
          >
            <input type="text" name="name" placeholder="Your Name" required />

            <input
              type="email"
              name="email"
              placeholder="Your Email"
              required
            />

            <input type="text" name="subject" placeholder="Subject" required />

            <textarea
              name="message"
              placeholder="Your Message"
              required
            ></textarea>

            <button type="submit">Send Message</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Contact;
