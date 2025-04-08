const Listing = require("./models/listing");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const reviews = require("./models/reviews.js");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "you must loggedIn first!");
    res.redirect("/login");
  }
  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
  const { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing.owner.equals(res.locals.currUser._id)) {
    req.flash("error", "You are not owner of this listing");
    return res.redirect(`/listing/${id}`);
  }
  next();
};

module.exports.validateListing = (req, res, next) => {
  let result = listingSchema.validate(req.body);
  // console.log(result);
  if (result.error) {
    throw new ExpressError(400, result.error);
  } else {
    next();
  }
};

module.exports.validateReview = (req, res, next) => {
  let result = reviewSchema.validate(req.body);
  // console.log(result);
  if (result.error) {
    throw new ExpressError(400, result.error);
  } else {
    next();
  }
};

module.exports.isReviewAuthor = async (req, res, next) => {
  const { reviewId, id } = req.params;
  let review = await reviews.findById(reviewId);
  console.log(review);
  if (!review.author._id.equals(res.locals.currUser?._id)) {
    req.flash("error", "You are not author of this review");
    return res.redirect(`/listing/${id}`);
  }
  next();
};
