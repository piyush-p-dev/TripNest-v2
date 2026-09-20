const express = require("express");
const router = express.Router();
const { isAdmin } = require("../middleware");
const adminController = require("../controllers/admin.js");

// Dashboard view
router.get("/dashboard", isAdmin, adminController.adminDashboard);

// DELETE listing
router.delete("/listings/:id", isAdmin, adminController.adminDeleteListing);

// DELETE booking
router.delete("/bookings/:id", isAdmin, adminController.adminDeleteBooking);

// DELETE user
router.delete("/users/:id", isAdmin, adminController.adminDeleteUser);

// Toggle Admin Role
router.post("/users/:id/toggleAdmin", adminController.adminToggle);

// Update Booking Status
router.post(
  "/bookings/:id/status",
  isAdmin,
  adminController.adminBookingStatus
);

module.exports = router;
