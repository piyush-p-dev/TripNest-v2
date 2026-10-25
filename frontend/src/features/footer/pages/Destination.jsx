function Destinations() {
  return (
    <div className="container my-5">
      <h2 className="mb-4">Popular Destinations</h2>

      <div className="row g-4">
        <div className="col-md-4">
          <div className="card shadow">
            <img
              src="https://res.cloudinary.com/drmyf5ync/image/upload/v1749025199/paris_xjmez1.avif"
              className="card-img-top"
              alt="Paris"
            />
            <div className="card-body">
              <h5 className="card-title">Paris</h5>
              <p className="card-text">
                The city of lights and romance, filled with art, culture, and
                fine dining.
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow">
            <img
              src="https://res.cloudinary.com/drmyf5ync/image/upload/v1749025410/goa_m6orcx.avif"
              className="card-img-top"
              alt="Goa"
            />
            <div className="card-body">
              <h5 className="card-title">Goa</h5>
              <p className="card-text">
                Sun, sand, and sea. Goa is India’s most loved beach destination.
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow">
            <img
              src="https://res.cloudinary.com/drmyf5ync/image/upload/v1749025199/bali_g2jqhe.jpg"
              className="card-img-top"
              alt="Bali"
            />
            <div className="card-body">
              <h5 className="card-title">Bali</h5>
              <p className="card-text">
                Experience tropical paradise, serene beaches, and vibrant
                culture in Bali.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Destinations;
