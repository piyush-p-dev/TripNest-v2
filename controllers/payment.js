// Stripe setup
const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY); // Load secret key from env

// Mongoose models
const Booking = require("../models/booking");
const Listing = require("../models/listing");
const User = require("../models/user");

const { sendBookingConfirmation } = require("../utils/sendEmail");

// 🔁 Checks if a listing is already booked (paid or recently pending) for the selected dates
const isOverlapping = async (listingId, checkIn, checkOut) => {
  // ⏳ Define a threshold time to consider "recent" pending bookings (15 minutes ago)
  const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
  return await Booking.exists({
    listing: listingId, // Match the listing being booked

    // 🧠 Use $or to check for either:
    $or: [
      {
        status: "paid", // ✅ Bookings that are already paid (always block dates)
        checkIn: { $lt: new Date(checkOut) }, // Overlapping date range condition
        checkOut: { $gt: new Date(checkIn) },
      },
      {
        status: "pending", // ⏳ Only consider recent pending bookings
        createdAt: { $gt: fifteenMinutesAgo }, // Booking was created within the last 15 minutes
        checkIn: { $lt: new Date(checkOut) }, // Overlapping date range condition
        checkOut: { $gt: new Date(checkIn) },
      },
    ],
  });
};

// 🎯 Create Stripe Checkout session and save booking as 'pending'
module.exports.createCheckoutSession = async (req, res) => {
  try {
    const { listingId } = req.params;
    const listing = await Listing.findById(listingId);
    const { guests, checkIn, checkOut } = req.body.booking || {};
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const nights = (end - start) / (1000 * 60 * 60 * 24);

    // Validate date range
    if (nights <= 0) {
      req.flash("error", "Invalid check-in/check-out range.");
      return res.redirect(`/listings/${listingId}`);
    }

    const subtotal = listing.price * nights;
    const gst = subtotal * 0.18; // 18% GST
    const totalPrice = subtotal + gst;

    if (!listing) {
      req.flash("error", "Listing not found");
      return res.redirect("/listings");
    }

    // 🔍 Prevent overlapping bookings
    const alreadyBooked = await isOverlapping(listingId, checkIn, checkOut);
    if (alreadyBooked) {
      req.flash("error", "This listing is already booked for those dates.");
      return res.redirect(`/listings/${listingId}`);
    }

    // 📝 Save booking before payment to reference in webhook
    const booking = new Booking({
      listing: listingId,
      user: req.user._id,
      guests,
      checkIn,
      checkOut,
      nights,
      totalPrice,
      status: "pending", // Will be updated to 'paid' after webhook
    });

    await booking.save();

    // 💳 Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "link"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: { name: `Booking: ${listing.title}` },
            unit_amount: Math.round(totalPrice * 100), // in paise
          },
          quantity: 1,
        },
      ],
      metadata: {
        bookingId: booking._id.toString(), // ✅ Used in webhook
      },
      success_url: `${req.protocol}://${req.get(
        "host"
      )}/bookings/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.protocol}://${req.get("host")}/listings/${listingId}`,
    });

    // 🔁 Redirect user to Stripe Checkout
    res.redirect(session.url);
  } catch (err) {
    console.error("Stripe error:", err);
    req.flash("error", "Payment error. Try again.");
    res.redirect("/listings");
  }
};

// ✅ After successful payment, show confirmation and send email
module.exports.handlePaymentSuccess = async (req, res) => {
  const { session_id } = req.query;

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);
    const bookingId = session.metadata.bookingId;

    const booking = await Booking.findById(bookingId).populate("listing user");
    if (!booking) {
      req.flash("error", "Booking not found.");
      return res.redirect("/listings");
    }

    const guest = booking.user;
    const listing = await Listing.findById(booking.listing).populate("owner");

    // 📧 Send booking confirmation email
    if (guest && listing?.owner?.email) {
      await sendBookingConfirmation(
        guest.email,
        guest.username,
        listing.owner.email,
        listing.owner.username,
        listing.title,
        booking.checkIn,
        booking.checkOut
      );
    }

    req.flash("success", "Payment successful! Booking is confirmed.");
    res.redirect("/bookings/my");
  } catch (e) {
    console.error("Payment Success Error:", e);
    req.flash("error", "Something went wrong after payment.");
    res.redirect("/listings");
  }
};

// 🔔 Webhook handler called by Stripe to mark booking as 'paid'
module.exports.handleStripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    // 🛡️ Verify Stripe signature
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook Error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // 📌 Only handle payment success events
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const bookingId = session.metadata.bookingId;

    try {
      // ✅ Mark booking as paid
      await Booking.findByIdAndUpdate(bookingId, { status: "paid" });
      console.log(`Booking ${bookingId} marked as paid via webhook`);
    } catch (err) {
      console.error("Failed to update booking status:", err);
    }
  }

  // 👌 Respond to Stripe that webhook was received
  res.status(200).json({ received: "true" });
};
