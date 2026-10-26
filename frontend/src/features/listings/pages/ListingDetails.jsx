import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getListing } from "../api";
import { getCurrentUser } from "../../../lib/apiClient";
import React from "react";
import ListingMap from "../components/ListingMap";
import "./rating.css";
function ListingDetails() {
  const { id } = useParams();

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    getCurrentUser()
      .then((user) => setCurrentUser(user))
      .catch((err) => console.error("Failed to load current user:", err));
  }, []);

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

  const isOwnerOrAdmin =
    currentUser &&
    (listing.owner?._id === currentUser._id || currentUser.isAdmin);

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

            {isOwnerOrAdmin ? (
              <>
                <Link
                  to={`/listings/${listing._id}/edit`}
                  className="btn btn-outline-dark mt-2"
                >
                  Edit listing
                </Link>

                <button
                  type="button"
                  className="btn btn-outline-danger w-100 mt-2"
                  disabled
                  title="Delete functionality will be migrated later"
                >
                  Delete listing
                </button>
              </>
            ) : (
              <Link
                to={`/listings/${listing._id}/bookings/new`}
                className="btn btn-dark w-100 mt-2"
              >
                Reserve
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Reviews */}
      <hr />

      <div className="mt-4">
        <h4>Reviews ({listing.reviews?.length || 0})</h4>

        {(!listing.reviews || listing.reviews.length === 0) && (
          <p>No reviews yet.</p>
        )}

        <div className="row">
          {listing.reviews?.map((review) => (
            <div className="col-md-6 mb-3" key={review._id}>
              <div className="card">
                <div className="card-body">
                  <div className="d-flex align-items-center mb-2">
                    {review.author?.avatar?.url ? (
                      <img
                        src={review.author.avatar.url}
                        className="rounded-circle me-2 user-avatar"
                        alt={`${review.author.username}'s avatar`}
                      />
                    ) : (
                      <div className="letter-avatar me-2">
                        {review.author?.username?.charAt(0).toUpperCase() ||
                          "U"}
                      </div>
                    )}

                    <h6 className="mb-0">
                      {review.author?.username || "Unknown user"}
                    </h6>
                  </div>

                  <p
                    className="starability-result card-text"
                    data-rating={review.rating}
                  />

                  <p>{review.comment}</p>

                  {currentUser &&
                    (review.author?._id === currentUser._id ||
                      currentUser.isAdmin) && (
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        onClick={async () => {
                          if (!window.confirm("Delete this review?")) return;

                          try {
                            const response = await fetch(
                              `http://localhost:8080/listings/${listing._id}/reviews/${review._id}`,
                              {
                                method: "DELETE",
                                credentials: "include",
                              },
                            );

                            if (!response.ok) {
                              throw new Error("Failed to delete review.");
                            }

                            window.location.reload();
                          } catch (error) {
                            alert(error.message || "Failed to delete review.");
                          }
                        }}
                      >
                        Delete
                      </button>
                    )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {currentUser && (
          <>
            <hr />
            <h5>Leave a Review</h5>

            <form
              className="needs-validation"
              onSubmit={async (event) => {
                event.preventDefault();

                const form = event.currentTarget;
                const formData = new FormData(form);
                const rating = formData.get("review[rating]");
                const comment = formData.get("review[comment]");

                if (!rating || !comment.trim()) {
                  alert("Please select a rating and enter a comment.");
                  return;
                }

                try {
                  const response = await fetch(
                    `http://localhost:8080/listings/${listing._id}/reviews`,
                    {
                      method: "POST",
                      credentials: "include",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        review: {
                          rating: Number(rating),
                          comment: comment.trim(),
                        },
                      }),
                    },
                  );

                  if (!response.ok) {
                    const responseText = await response.text();
                    console.error(
                      "Review submission failed:",
                      response.status,
                      responseText,
                    );

                    throw new Error(
                      `Review failed (${response.status}). Check the browser console.`,
                    );
                  }

                  window.location.reload();
                } catch (error) {
                  alert(error.message || "Failed to submit review.");
                }
              }}
            >
              <div className="mb-3">
                <label htmlFor="rating">Rating</label>

                <fieldset className="starability-slot">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <React.Fragment key={rating}>
                      <input
                        type="radio"
                        id={`rate-${rating}`}
                        name="review[rating]"
                        value={rating}
                        required
                      />
                      <label
                        htmlFor={`rate-${rating}`}
                        title={
                          [
                            "Terrible",
                            "Not good",
                            "Average",
                            "Very good",
                            "Amazing",
                          ][rating - 1]
                        }
                      >
                        {rating} star{rating > 1 ? "s" : ""}
                      </label>
                    </React.Fragment>
                  ))}
                </fieldset>
              </div>

              <div className="mb-3">
                <label htmlFor="comment">Comment</label>
                <textarea
                  id="comment"
                  name="review[comment]"
                  className="form-control"
                  rows="3"
                  required
                />
              </div>

              <button type="submit" className="btn btn-outline-dark">
                Submit
              </button>
            </form>
          </>
        )}
      </div>

      {/* Map */}
      <hr />

      <div className="mt-4">
        <h4>Where you’ll be</h4>
        <ListingMap coordinates={listing.geometry?.coordinates} />
      </div>
    </div>
  );
}

export default ListingDetails;
