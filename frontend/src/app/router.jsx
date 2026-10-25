import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "./App";

import Listings from "../features/listings/pages/Listings";
import EditListing from "../features/listings/pages/EditListing";
import NewListing from "../features/listings/pages/NewListing";
import ListingDetails from "../features/listings/pages/ListingDetails";

//footer
import About from "../features/footer/pages/About";
import Blog from "../features/footer/pages/Blog";
import Contact from "../features/footer/pages/Contact";
import Destinations from "../features/footer/pages/Destination";
import FAQ from "../features/footer/pages/FAQ";
import Payment from "../features/footer/pages/Payment";
import Privacy from "../features/footer/pages/Privacy";
import Services from "../features/footer/pages/Services";
import ThankYou from "../features/footer/pages/ThankYou";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App></App>,
    children: [
      { index: true, element: <Navigate to="/listings" replace></Navigate> },
      { path: "/listings", element: <Listings></Listings> },
      { path: "/listings/new", element: <NewListing></NewListing> },
      { path: "/listings/:id", element: <ListingDetails></ListingDetails> },
      { path: "/listings/:id/edit", element: <EditListing></EditListing> },
      //footer links
      { path: "about", element: <About /> },
      { path: "blog", element: <Blog /> },
      { path: "contact", element: <Contact /> },
      { path: "destinations", element: <Destinations /> },
      { path: "faq", element: <FAQ /> },
      { path: "payment", element: <Payment /> },
      { path: "privacy", element: <Privacy /> },
      { path: "services", element: <Services /> },
      { path: "contact/thankyou", element: <ThankYou /> },
    ],
  },
]);
export default router;
