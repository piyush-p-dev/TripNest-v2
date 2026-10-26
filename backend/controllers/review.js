const Listing = require("../models/listing");
const Review = require("../models/review");

/**
 * Create a new review for a specific listing.
 */
module.exports.createReview = async (req, res) => {
  // Find the listing being reviewed
  const listing = await Listing.findById(req.params.id);

  // Return an error if the listing doesn't exist
  if (!listing) {
    return res.status(404).json({
      message: "Listing not found.",
    });
  }

  // Create a new review from the submitted form data
  const newReview = new Review(req.body.review);

  // Associate the review with the logged-in user
  newReview.author = req.user._id;

  // Add the review reference to the listing
  listing.reviews.push(newReview);

  // Save the review document
  await newReview.save();

  // Save the updated listing
  await listing.save();

  console.log("new review saved");

  // Return a JSON response for the React frontend
  res.status(201).json({
    message: "Review created successfully.",
    review: newReview,
  });
};

/**
 * Delete a specific review from a listing.
 */
module.exports.destroyReview = async (req, res) => {
  const { id, reviewId } = req.params;

  // Remove the review reference from the listing's reviews array
  await Listing.findByIdAndUpdate(id, {
    $pull: { reviews: reviewId },
  });

  // Delete the actual review document from the database
  await Review.findByIdAndDelete(reviewId);

  // Return a JSON response for the React frontend
  res.json({
    message: "Review deleted successfully.",
  });
};
