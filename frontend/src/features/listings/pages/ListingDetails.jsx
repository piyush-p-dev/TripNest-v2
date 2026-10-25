import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getListing } from "../api";

function ListingDetails() {
  const { id } = useParams();

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadListing() {
      try {
        setLoading(true);
        setError("");

        const data = await getListing(id);
        setListing(data.listing);
      } catch (err) {
        setError(err.message || "Failed to load listing.");
      } finally {
        setLoading(false);
      }
    }

    loadListing();
  }, [id]);

  if (loading) {
    return <div className="container mt-4">Loading listing...</div>;
  }

  if (error) {
    return <div className="container mt-4 text-danger">{error}</div>;
  }

  if (!listing) {
    return <div className="container mt-4">Listing not found.</div>;
  }

  const owner = listing.owner;
  const amenities = listing.amenities || [];

  const amenityIcons = {
    "Wi-Fi": "fas fa-wifi",
    "Air Conditioning": "fas fa-wind",
    Kitchen: "fas fa-utensils",
    "Free Parking": "fas fa-parking",
  };

  return (
    <div className="container mt-4 listing-page">
      <div className="mb-4">
        <h2>{listing.title}</h2>
        <p className="text-muted">
          {listing.location}, {listing.country}
        </p>
      </div>

      <div className="row mb-4">
        {listing.images?.map((img, index) => (
          <div className="col-md-4 mb-3" key={img._id || img.url || index}>
            <img
              src={img.url}
              className="listing-gallery-img"
              alt={`${listing.title} - ${index + 1}`}
            />
          </div>
        ))}
      </div>

      <div className="row">
        <div className="col-md-7">
          <div className="mb-3">
            <div className="d-flex align-items-center mb-3">
              {owner?.avatar?.url ? (
                <img
                  src={owner.avatar.url}
                  className="host-avatar me-2"
                  alt="Host profile"
                />
              ) : (
                <div className="letter-avatar me-2">
                  {owner?.username?.charAt(0).toUpperCase() || "H"}
                </div>
              )}

              <h5 className="mb-0">
                Hosted by {owner?.username || "Unknown host"}
              </h5>
            </div>

            <p>{listing.description}</p>
          </div>

          {listing.category && (
            <div className="mb-3">
              <span className="badge bg-category">{listing.category}</span>
            </div>
          )}

          <hr />

          <h4 className="section-title">What’s included</h4>

          <div className="listing-amenities-grid">
            {amenities.length > 0 ? (
              amenities.map((amenity) => (
                <div className="amenity-item" key={amenity}>
                  <i
                    className={`${
                      amenityIcons[amenity] || "fas fa-check-circle"
                    } icon`}
                  />
                  <span>{amenity}</span>
                </div>
              ))
            ) : (
              <p className="text-muted">
                No amenities have been added for this listing yet.
              </p>
            )}
          </div>
        </div>

        <div className="col-md-5">
          <div className="card p-3 shadow-sm">
            <h4>₹{Number(listing.price).toLocaleString("en-IN")} / night</h4>

            <Link
              to={`/listings/${listing._id}/edit`}
              className="btn btn-outline-dark mt-2"
            >
              Edit listing
            </Link>

            <button
              type="button"
              className="btn btn-danger w-100 mt-2"
              disabled
              title="Booking functionality will be migrated next"
            >
              Reserve
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ListingDetails;
