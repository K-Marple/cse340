const revModel = require("../models/review-model");
const utilities = require("../utilities");

/* ********************
 * Build edit review view
 ***********************/
async function buildEdit(req, res, next) {
  let nav = await utilities.getNav();
  const review_id = parseInt(req.params.review_id);
  const review = await revModel.getReviewsByReviewId(review_id);
  res.render("review/edit", {
    title: "Edit Review",
    nav,
    errors: null,
    review_text: review[0].review_text,
  });
}

/* ********************
 * Build delete review view
 ***********************/
async function buildDelete(req, res, next) {
  let nav = await utilities.getNav();
  const review_id = parseInt(req.body.review_id);
  const review = await revModel.getReviewsByReviewId(review_id);
  res.render("review/delete", {
    title: "Delete Review",
    nav,
    errors: null,
    review_text: review.review_text,
  });
}

/* ********************
 * Process editing review
 ***********************/
async function updateReview(req, res, next) {
  let nav = await utilities.getNav();
  const { review_id, review_text, review_date, inv_id, account_id } = req.body;
  const updateReview = await revModel.updateReview(
    review_id,
    review_text,
    review_date,
    inv_id,
    account_id
  );
  if (updateReview) {
    req.flash("notice", "The review has been updated.");
    res.redirect("/account/");
  } else {
    req.flash("notice", "Sorry, unable to edit the review.");
    res.status(501).render("review/edit", {
      title: "Edit Review",
      nav,
      errors,
      review_id,
      review_text,
      review_date,
      inv_id,
      account_id,
    });
  }
}

/* ********************
 * Process deleting review
 ***********************/
async function deleteReview(req, res, next) {
  let nav = await utilities.getNav();
  const review_id = parseInt(req.body.review_id);
  const deleteResult = await revModel.deleteReview(review_id);
  if (deleteResult) {
    req.flash("notice", "The review was successfully deleted.");
    res.redirect("/account/");
  } else {
    req.flash(
      "notice",
      "Sorry, we were unable to process the deletion of the review."
    );
    res.status(501).render("review/delete", {
      title: "Delete Review",
      nav,
      errors: null,
      review_id,
    });
  }
}

module.exports = {
  buildEdit,
  buildDelete,
  updateReview,
  deleteReview,
};
