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
 * Get reviews from database by account
 * ****************/
async function getReviewsByReviewId(review_id) {
  try {
    const sql = `SELECT * FROM review WHERE review_id = $1`;
    const data = await pool.query(sql, [review_id]);
    return data.rows;
  } catch (error) {
    return error.message;
  }
}

/* ****************
 * Add reviews
 * ****************/
async function addReview(review_text) {
  try {
    const sql = `INSERT INTO review 
      (review_text) 
      VALUES ($1) 
      RETURNING *`;
    return await pool.query(sql, [review_text]);
  } catch (error) {
    return error.message;
  }
}

/* ****************
 * Update reviews
 * ****************/
async function updateReview(
  review_id,
  review_text,
  review_date,
  inv_id,
  account_id
) {
  try {
    const sql = `UPDATE review 
    SET review_text = $1, review_date = $2, inv_id = $3, 
    account_id = $4 WHERE review_id = $5 RETURNING *`;
    const data = await pool.query(sql, [
      review_text,
      review_date,
      inv_id,
      account_id,
      review_id,
    ]);
    return data.rows;
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
  getReviewsByReviewId,
  addReview,
  updateReview,
  deleteReview,
};
