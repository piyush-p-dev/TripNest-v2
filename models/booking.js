const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookingSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    listing: {
      type: Schema.Types.ObjectId,
      ref: "Listing",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "paid", "cancelled", "refunded"],
      default: "pending", // Initially pending until payment succeeds
    },
    checkIn: {
      type: Date,
      required: true,
    },
    checkOut: {
      type: Date,
      required: true,
    },
    guests: {
      type: Number,
      required: true,
      min: 1,
    },
    nights: {
      type: Number,
      required: true, // Calculated duration of stay
    },
    totalPrice: {
      type: Number,
      required: true, // Includes base price + tax
    },
    cancelledAt: {
      type: Date,
      default: null, // If cancelled, this tracks when
    },
    cancelledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Tracks which user cancelled
    },
  },
  {
    timestamps: true, // ✅ Automatically adds createdAt and updatedAt fields
  }
);

// createdAt will be used to track when the booking was created,
// useful for expiring pending bookings that are not paid.

module.exports = mongoose.model("Booking", bookingSchema);
