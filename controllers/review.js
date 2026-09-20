const Listing = require("../models/listing");
const Review = require("../models/review");

/**
 * Create a new review for a specific listing.
 */
module.exports.createReview = async (req, res) => {
  const listing = await Listing.findById(req.params.id); // Find the listing being reviewed

  const newReview = new Review(req.body.review); // Create a new review from form data
  newReview.author = req.user._id; // Associate the review with the logged-in user

  listing.reviews.push(newReview); // Add the review to the listing's reviews array

  await newReview.save(); // Save the review document
  await listing.save(); // Save the updated listing

  console.log("new review saved");
  req.flash("success", "New Review Created!");
  res.redirect(`/listings/${listing._id}`); // Redirect back to the listing's page
};

/**
 * Delete a specific review from a listing.
 */
module.exports.destroyReview = async (req, res) => {
  const { id, reviewId } = req.params;

  // Remove the review reference from the listing's reviews array
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });

  // Delete the actual review document from the database
  await Review.findByIdAndDelete(reviewId);

  req.flash("success", "Review Deleted!");
  res.redirect(`/listings/${id}`); // Redirect back to the listing's page
};
