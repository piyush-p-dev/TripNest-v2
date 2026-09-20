const Listing = require("../models/listing");
const Booking = require("../models/booking");
const User = require("../models/user");

// Dashboard view
module.exports.adminDashboard = async (req, res) => {
  const users = await User.find({});
  const listings = await Listing.find({});
  const bookings = await Booking.find({}).populate("user").populate("listing");
  res.render("admin/dashboard", { listings, bookings, users });
};

// DELETE listing
module.exports.adminDeleteListing = async (req, res) => {
  await Listing.findByIdAndDelete(req.params.id);
  req.flash("success", "Listing deleted");
  res.redirect("/admin/dashboard");
};

// DELETE booking
module.exports.adminDeleteBooking = async (req, res) => {
  await Booking.findByIdAndDelete(req.params.id);
  req.flash("success", "Booking deleted");
  res.redirect("/admin/dashboard");
};

// DELETE user
module.exports.adminDeleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  req.flash("success", "User deleted");
  res.redirect("/admin/dashboard");
};

// Toggle Admin Role
module.exports.adminToggle = async (req, res) => {
  const user = await User.findById(req.params.id);
  user.isAdmin = !user.isAdmin;
  await user.save();
  req.flash("success", "User role updated");
  res.redirect("/admin/dashboard");
};

// Update Booking Status
module.exports.adminBookingStatus = async (req, res) => {
  const { status } = req.body;
  await Booking.findByIdAndUpdate(req.params.id, { status });
  req.flash("success", "Booking status updated");
  res.redirect("/admin/dashboard");
};
