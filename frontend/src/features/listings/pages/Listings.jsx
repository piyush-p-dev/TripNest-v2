import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getListings } from "../api";

const categories = [
  { name: "Trending", value: "trending", icon: "fa-solid fa-fire" },
  { name: "Rooms", value: "rooms", icon: "fa-solid fa-bed" },
  { name: "Iconic cities", value: "iconicCities", icon: "fa-solid fa-city" },
  { name: "Mountains", value: "mountains", icon: "fa-solid fa-mountain-sun" },
  { name: "Castles", value: "castles", icon: "fa-brands fa-fort-awesome" },
  {
    name: "Amazing Pools",
    value: "amazingPools",
    icon: "fa-solid fa-person-swimming",
  },
  { name: "Camping", value: "camping", icon: "fa-solid fa-campground" },
  { name: "Farms", value: "farms", icon: "fa-solid fa-cow" },
  { name: "Arctic", value: "arctic", icon: "fa-solid fa-snowflake" },
  { name: "Domes", value: "domes", icon: "fa-solid fa-igloo" },
];

function Listings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showTaxes, setShowTaxes] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "all";

  useEffect(() => {
    async function loadListings() {
      setLoading(true);
      setError("");

      try {
        const data = await getListings({ search, category });
        setListings(data.listings);
      } catch (err) {
        setError(err.message || "Failed to load listings.");
      } finally {
        setLoading(false);
      }
    }

    loadListings();
  }, [search, category]);

  function handleCategoryChange(value) {
    const params = new URLSearchParams(searchParams);

    if (value === "all") {
      params.delete("category");
    } else {
      params.set("category", value);
    }

    setSearchParams(params);
  }

  return (
    <div className="container page-listings mt-4">
      {/* Category filters */}
      <div id="filters" className="d-flex gap-4 align-items-center mb-4">
        {categories.map((item) => (
          <button
            key={item.value}
            type="button"
            className={`filter btn btn-link text-decoration-none text-reset ${
              category === item.value ? "active" : ""
            }`}
            onClick={() => handleCategoryChange(item.value)}
          >
            <div>
              <i className={item.icon}></i>
            </div>
            <p className="mb-0">{item.name}</p>
          </button>
        ))}

        {category !== "all" && (
          <button
            type="button"
            className="filter clear-filter btn btn-link text-decoration-none text-reset"
            onClick={() => handleCategoryChange("all")}
          >
            <div>
              <i className="fa-solid fa-xmark"></i>
            </div>
            <p className="mb-0">Clear</p>
          </button>
        )}

        <div className="filter tax-toggle d-flex align-items-center gap-2">
          <input
            type="checkbox"
            id="taxToggle"
            checked={showTaxes}
            onChange={(event) => setShowTaxes(event.target.checked)}
          />
          <label className="toggle-label" htmlFor="taxToggle">
            Display total after taxes
          </label>
        </div>
      </div>

      {/* Loading and error states */}
      {loading && <p>Loading listings...</p>}

      {!loading && error && <p className="text-danger">{error}</p>}

      {/* No results */}
      {!loading && !error && listings.length === 0 && (
        <div className="no-results text-center mt-5">
          <h4>No results found{search ? ` for "${search}"` : ""}.</h4>
          <p>Try adjusting your search or filters.</p>
        </div>
      )}

      {/* Listing cards */}
      {!loading && !error && listings.length > 0 && (
        <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-4 mt-1">
          {listings.map((listing) => {
            const price = Number(listing.price) || 0;
            const displayPrice = showTaxes ? Math.round(price * 1.18) : price;

            return (
              <div className="col" key={listing._id}>
                <Link
                  to={`/listings/${listing._id}`}
                  className="listing-link text-decoration-none text-reset"
                >
                  <div className="card listing-card h-100 border-0">
                    {listing.images?.[0]?.url ? (
                      <img
                        src={listing.images[0].url}
                        className="card-img-top"
                        alt={listing.title}
                        style={{
                          height: "20rem",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <div
                        className="bg-body-secondary d-flex align-items-center justify-content-center"
                        style={{ height: "20rem" }}
                      >
                        No image available
                      </div>
                    )}

                    <div className="card-body px-0">
                      <p className="card-text mb-0">
                        <b>{listing.title}</b>
                        <br />
                        <span>
                          ₹{displayPrice.toLocaleString("en-IN")} / night
                          {showTaxes && " (incl. GST)"}
                        </span>
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Listings;
