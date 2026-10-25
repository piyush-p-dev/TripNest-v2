function Blog() {
  return (
    <div className="container my-5">
      <h2 className="mb-4">TripNest Blog</h2>

      <div className="card mb-3">
        <div className="card-body">
          <h4 className="card-title">
            How to Choose the Perfect Vacation Spot
          </h4>
          <p className="card-text">
            Choosing the right place to stay can make or break your trip. Read
            our guide to find out what matters most.
          </p>
          <a href="#" className="btn btn-outline-primary btn-sm">
            Read More
          </a>
        </div>
      </div>

      <div className="card mb-3">
        <div className="card-body">
          <h4 className="card-title">Top 5 Hidden Gems in India</h4>
          <p className="card-text">
            From unexplored mountains to serene beaches, discover destinations
            off the beaten path.
          </p>
          <a href="#" className="btn btn-outline-primary btn-sm">
            Read More
          </a>
        </div>
      </div>
    </div>
  );
}

export default Blog;
