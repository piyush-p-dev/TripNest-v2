// import "./navbar.css";
import { useState, useEffect } from "react";
function Navbar({ name }) {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8080/current", {
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        setCurrentUser(data);
      });
  }, []);
  console.log(currentUser);
  return (
    <>
      <div className="trip-navbar-wrapper">
        <nav className="navbar navbar-expand-md bg-body-light border-bottom sticky-top">
          <div className="container-fluid">
            <a
              className="navbar-brand d-flex align-items-center gap-2"
              href="/listings"
            >
              <i className="fa-regular fa-compass"></i>
              <span className="fw-bold fs-5 text-danger">TripNest</span>
            </a>
            {/* <!-- Hamburger Toggle --> */}
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNavDropdown"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNavDropdown">
              {/* <!-- search --> */}
              <div className="navbar-nav ms-auto">
                <form
                  className="d-flex"
                  role="search"
                  action="/listings"
                  method="GET"
                >
                  <input
                    className="form-control me-2 search-inp"
                    type="search"
                    name="search"
                    placeholder="Search destinations"
                  />
                  <button className="btn search-btn" type="submit">
                    <i className="fa-solid fa-magnifying-glass"></i>Search
                  </button>
                </form>
              </div>

              {/* <!-- dropdown --> */}
              <div className="navbar-nav ms-auto align-items-center d-flex gap-2">
                <li className="nav-item">
                  <a className="nav-link" href="/listings/new">
                    Host Your Home
                  </a>
                </li>
                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle d-flex align-items-center gap-2"
                    href="#"
                    id="accountDropdown"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    {currentUser?.avatar?.url ? (
                      <img
                        src={currentUser.avatar.url}
                        alt="Profile"
                        className="rounded-circle"
                        style={{
                          width: "36px",
                          height: "36px",
                          objectFit: "cover",
                        }}
                      />
                    ) : currentUser ? (
                      <div
                        className="rounded-circle bg-danger text-white d-flex justify-content-center align-items-center"
                        style={{
                          width: "36px",
                          height: "36px",
                          fontWeight: 600,
                        }}
                      >
                        {currentUser.username[0].toUpperCase()}
                      </div>
                    ) : (
                      <i className="fa-solid fa-user-circle fa-xl"></i>
                    )}{" "}
                    {currentUser && (
                      <span className="fw-semibold">
                        {currentUser.username}
                      </span>
                    )}
                  </a>
                  <ul
                    className="dropdown-menu dropdown-menu-end"
                    aria-labelledby="accountDropdown"
                  >
                    {!currentUser ? (
                      <>
                        <li>
                          <a className="dropdown-item" href="/signup">
                            Sign up
                          </a>
                        </li>
                        <li>
                          <a className="dropdown-item" href="/login">
                            Log in
                          </a>
                        </li>
                      </>
                    ) : (
                      <>
                        <li>
                          <a className="dropdown-item" href="/profile">
                            My Profile
                          </a>
                        </li>

                        <li>
                          <a className="dropdown-item" href="/bookings/my">
                            Your Trips
                          </a>
                        </li>

                        <li>
                          <a className="dropdown-item" href="/bookings/owner">
                            Host Bookings
                          </a>
                        </li>

                        {currentUser.isAdmin && (
                          <li>
                            <a
                              className="dropdown-item text-danger fw-semibold"
                              href="/admin/dashboard"
                            >
                              Admin Dashboard
                            </a>
                          </li>
                        )}

                        <li>
                          <hr className="dropdown-divider" />
                        </li>

                        <li>
                          <a className="dropdown-item logout" href="/logout">
                            Log out
                          </a>
                        </li>
                      </>
                    )}
                  </ul>
                </li>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
}
export default Navbar;
