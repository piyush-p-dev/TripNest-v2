function ThankYou() {
  return (
    <div
      style={{
        minHeight: "70vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <h1 style={{ color: "#fe424d" }}>Thank you for reaching out!</h1>

        <p>We’ll get back to you shortly.</p>

        <a
          href="/listings"
          style={{ color: "#fe424d", textDecoration: "underline" }}
        >
          Go back to homepage
        </a>
      </div>
    </div>
  );
}

export default ThankYou;
