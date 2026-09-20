const Listing = require("./models/listing");
const Review = require("./models/review");

const ExpressError = require("./utils/ExpressError.js");
const {
  listingSchema,
  reviewSchema,
  signupSchema,
  resetPasswordSchema,
  changePasswordSchema,
} = require("./schema.js");

//making JOI VALIDATE Listing a function
module.exports.validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

//making JOI VALIDATE review a function
module.exports.validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

//for checking if user is logged in
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must be logged in ");
    return res.redirect("/login");
  }
  next();
};

//post-login page
module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

// authorization of owner
module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing not found.");
    return res.redirect("/listings");
  }

  //  Allow if current user is owner OR admin
  if (
    !listing.owner._id.equals(res.locals.currUser._id) &&
    !res.locals.currUser.isAdmin
  ) {
    req.flash("error", "You are not the owner of this listing");
    return res.redirect(`/listings/${id}`);
  }

  next();
};

//authorization of reviews
module.exports.isReviewAuthor = async (req, res, next) => {
  let { id, reviewId } = req.params;
  let review = await Review.findById(reviewId);
  if (!review) {
    req.flash("error", "Review not found!");
    return res.redirect(`/listings/${id}`);
  }
  if (
    !review.author.equals(res.locals.currUser._id) &&
    !res.locals.currUser.isAdmin
  ) {
    req.flash("error", "You are not the author of this review");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

module.exports.isAdmin = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    req.flash("error", "You do not have permission to access this page.");
    return res.redirect("/");
  }
  next();
};

module.exports.validateSignup = (req, res, next) => {
  const { error } = signupSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(", ");
    req.flash("error", msg);
    return res.redirect("/signup");
  }
  next();
};

module.exports.validateResetPassword = (req, res, next) => {
  const { error } = resetPasswordSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(", ");
    req.flash("error", msg);
    const token = req.params.token;
    return res.redirect(`/reset-password/${token}`);
  }
  next();
};

module.exports.validateChangePassword = (req, res, next) => {
  const { error } = changePasswordSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(", ");
    req.flash("error", msg);
    return res.redirect("/profile/change-password");
  }
  next();
};
