const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer");
const { getStorage } = require("../cloudConfig.js");
const uploadListing = multer({ storage: getStorage("Listings") }); // uses TripNest/Listings

router
  .route("/")
  //INDEX ROUTE
  .get(wrapAsync(listingController.index))
  // Create Route
  .post(
    isLoggedIn,
    validateListing,
    uploadListing.array("listing[images]", 5), // for 5images
    wrapAsync(listingController.createListing)
  );

//New Route
router.get("/new", isLoggedIn, listingController.renderNewForm);

router
  .route("/:id")
  //Show Route
  .get(wrapAsync(listingController.showListing))
  //Update Route
  .put(
    isLoggedIn,
    isOwner,
    validateListing,
    // upload.single("listing[image]"),
    uploadListing.array("listing[newImages]"),
    wrapAsync(listingController.updateListing)
  )
  //Delete Route
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

//Edit Route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);

module.exports = router;
