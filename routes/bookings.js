const express = require("express");
const router = express.Router({ mergeParams: true }); // mergeParams allows access to listingId
const bookingController = require("../controllers/bookings");
const paymentController = require("../controllers/payment");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js"); // if you have auth middleware

router.get("/new", isLoggedIn, bookingController.renderBookingForm); // Show booking form

router.get("/my", isLoggedIn, bookingController.userBookings); //userBooking
router.get("/owner", isLoggedIn, bookingController.ownerBookings); //ownerBooking

router.post(
  "/:listingId/pay",
  isLoggedIn,
  paymentController.createCheckoutSession
);
router.post("/:bookingId/cancel", isLoggedIn, bookingController.cancelBooking);

//to check payment success
router.get("/success", isLoggedIn, paymentController.handlePaymentSuccess);

module.exports = router;
