const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  images: [{ url: String, filename: String }],
  price: Number,
  location: String,
  country: String,
  amenities: [String], // New field
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review", //  References associated reviews
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User", //  Owner of the listing
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },

  geometry: {
    type: {
      type: String, // 'Point'
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number], // [lng, lat]
      required: true,
    },
  },
  category: {
    type: String,
    enum: [
      "trending",
      "rooms",
      "iconicCities",
      "mountains",
      "castles",
      "amazingPools",
      "camping",
      "farms",
      "arctic",
      "domes",
    ],
    required: true,
  },
});

listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
