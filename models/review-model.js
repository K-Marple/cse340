const pool = require("../database/");

/* ****************
 * Get reviews from database by inventory
 * **************** */
async function getReviewsByInvId(inv_id) {
  try {
    const sql = `SELECT * FROM public.review WHERE inv_id = $1 ORDER BY review_date`;
    const data = await pool.query(sql, [inv_id]);
    return data;
  } catch (error) {
    new Error("Review Error");
  }
}

/* ****************
 * Get reviews from database by account
 * ****************/
async function getReviewsByAccId(account_id) {
  try {
    const sql = `SELECT * FROM review WHERE account_id = $1`;
    const data = await pool.query(sql, [account_id]);
    return data;
  } catch (error) {
    return error.message;
  }
}

/* ****************
 * Update reviews
 * ****************/
async function updateReview(review_id, review_text) {
  try {
    const sql = `UPDATE review SET review_text = $1, WHERE review_id = $1 RETURNING *`;
    const data = await pool.query(sql, [review_text, review_id]);
    return data.rows[0];
  } catch (error) {
    return error.message;
  }
}

/* ****************
 * Delete review in database
 * **************** */
async function deleteReview(review_id) {
  try {
    const sql = `DELETE FROM review WHERE review_id = $1`;
    const data = await pool.query(sql, [review_id]);
    return data;
  } catch (error) {
    new Error("Delete Error");
  }
}

module.exports = {
  getReviewsByInvId,
  getReviewsByAccId,
  updateReview,
  deleteReview,
};
