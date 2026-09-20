const Listing = require("../models/listing");
const Booking = require("../models/booking");
const { sendCancellationEmail } = require("../utils/sendEmail");

/**
 * Renders the booking form for a specific listing.
 */
module.exports.renderBookingForm = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }
  res.render("bookings/new", { listing });
};

/**
 * Shows all bookings made by the currently logged-in user.
 */
module.exports.userBookings = async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id }).populate(
    "listing"
  );
  res.render("bookings/userBookings", { bookings });
};

/**
 * Shows all bookings made on listings that belong to the currently logged-in owner.
 */
module.exports.ownerBookings = async (req, res) => {
  const listings = await Listing.find({ owner: req.user._id });
  const bookings = await Booking.find({
    listing: { $in: listings.map((l) => l._id) },
  }).populate("user listing");
  res.render("bookings/ownerBookings", { bookings });
};

/**
 * Cancels a booking. Only the guest who booked or the host of the listing can cancel.
 * Sends cancellation emails to both guest and host.
 */
module.exports.cancelBooking = async (req, res) => {
  const { bookingId } = req.params;
  const booking = await Booking.findById(bookingId)
    .populate("user") // Load guest info
    .populate({
      path: "listing",
      populate: { path: "owner" }, // Load host info inside listing
    });

  if (!booking) {
    req.flash("error", "Booking not found");
    return res.redirect("/bookings/my");
  }

  const isGuest = booking.user.equals(req.user._id);
  const isHost = booking.listing.owner.equals(req.user._id);

  // Only guest or host can cancel
  if (!isGuest && !isHost) {
    req.flash("error", "You are not authorized to cancel this booking.");
    const redirectPath = booking.listing?.owner?._id?.equals(req.user._id)
      ? "/bookings/owner"
      : "/bookings/my";
    return res.redirect(redirectPath);
  }

  // Disallow cancellation after check-in date
  const now = new Date();
  if (new Date(booking.checkIn) <= now) {
    req.flash("error", "You cannot cancel bookings after check-in date.");
    return res.redirect(isHost ? "/bookings/owner" : "/bookings/my");
  }

  // Mark booking as cancelled and track when/who cancelled it
  booking.status = "cancelled";
  booking.cancelledAt = now;
  booking.cancelledBy = req.user._id;
  await booking.save();

  const guest = booking.user;
  const host = booking.listing.owner;

  // Define who cancelled from each perspective
  const cancelledByRoleForGuest = isGuest ? "you" : "the host";
  const cancelledByRoleForHost = isGuest ? "the guest" : "you";

  // Send cancellation email to guest
  await sendCancellationEmail(
    guest.email,
    guest.username,
    booking.listing.title,
    booking.checkIn,
    cancelledByRoleForGuest,
    false // isHost
  );

  // Send cancellation email to host
  await sendCancellationEmail(
    host.email,
    host.username,
    booking.listing.title,
    booking.checkIn,
    cancelledByRoleForHost,
    true // isHost
  );

  req.flash("success", "Booking cancelled.");
  res.redirect(isHost ? "/bookings/owner" : "/bookings/my");
};
