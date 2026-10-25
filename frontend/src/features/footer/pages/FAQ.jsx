function FAQ() {
  return (
    <div className="container my-5">
      <h2 className="mb-4">Frequently Asked Questions</h2>

      <div className="accordion" id="faqAccordion">
        <div className="accordion-item">
          <h2 className="accordion-header" id="q1">
            <button
              className="accordion-button"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#a1"
              aria-expanded="true"
              aria-controls="a1"
            >
              How do I book a stay?
            </button>
          </h2>

          <div
            id="a1"
            className="accordion-collapse collapse show"
            data-bs-parent="#faqAccordion"
          >
            <div className="accordion-body">
              Search for a destination, select a listing, and follow the
              checkout steps to complete your booking.
            </div>
          </div>
        </div>

        <div className="accordion-item">
          <h2 className="accordion-header" id="q2">
            <button
              className="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#a2"
              aria-expanded="false"
              aria-controls="a2"
            >
              Can I cancel or modify my booking?
            </button>
          </h2>

          <div
            id="a2"
            className="accordion-collapse collapse"
            data-bs-parent="#faqAccordion"
          >
            <div className="accordion-body">
              Yes, you can cancel or modify your booking from your profile under
              “My Bookings” as per the cancellation policy.
            </div>
          </div>
        </div>

        <div className="accordion-item">
          <h2 className="accordion-header" id="q3">
            <button
              className="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#a3"
              aria-expanded="false"
              aria-controls="a3"
            >
              What payment methods are accepted?
            </button>
          </h2>

          <div
            id="a3"
            className="accordion-collapse collapse"
            data-bs-parent="#faqAccordion"
          >
            <div className="accordion-body">
              We currently accept debit/credit cards via Stripe’s secure
              checkout.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FAQ;
