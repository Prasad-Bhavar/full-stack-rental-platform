const express = require("express");
const router = express.Router({ mergeParams: true });
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const Review = require("../models/reviews.js");
const { isLoggedIn, isReviewAuthor } = require("../middleware.js");

const reviewControllers = require("../controllers/reviews.js");

const validateReview = (req, res, next) => {
  let result = listingSchema.validate(req.body);
  console.log(result);
  if (result.error) {
    throw new ExpressError(400, result.error);
  }
};

//review
//post
router.post(
  "/:id/review",
  isLoggedIn,
  wrapAsync(reviewControllers.createReview)
);

//delete review
router.delete(
  "/:id/reviews/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewControllers.destroyReview)
);

module.exports = router;
