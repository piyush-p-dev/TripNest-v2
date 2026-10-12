import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "./App";

import Listings from "../features/listings/pages/Listings";
import EditListing from "../features/listings/pages/EditListing";
import NewListing from "../features/listings/pages/NewListing";
import ListingDetails from "../features/listings/pages/ListingDetails";

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
    ],
  },
]);
export default router;
