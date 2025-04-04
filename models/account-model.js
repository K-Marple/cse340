/* ****************
 * Requirments
 * ****************/
const pool = require("../database");

/* ****************
 * Register new account
 * ****************/
async function registerAccount(
  account_firstname,
  account_lastname,
  account_email,
  account_password
) {
  try {
    const sql = `INSERT INTO account (account_firstname, account_lastname, 
      account_email, account_password, account_type) 
      VALUES ($1, $2, $3, $4, 'Client') RETURNING *`;
    return await pool.query(sql, [
      account_firstname,
      account_lastname,
      account_email,
      account_password,
    ]);
  } catch (error) {
    return error.message;
  }
}

/* ***************
 * Check for existing email
 * ****************/
async function checkExistingEmail(account_email) {
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1";
    const email = await pool.query(sql, [account_email]);
    return email.rowCount;
  } catch (error) {
    return error.message;
  }
}

/* ***************
 * Check login information
 * ****************/
async function checkLoginEmail(account_email) {
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1";
    const login = await pool.query(sql, [account_email]);
    return login.rowCount;
  } catch (error) {
    return error.message;
  }
}

async function checkLoginPass(account_password) {
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1";
    const login = await pool.query(sql, [account_password]);
    return login.rowCount;
  } catch (error) {
    return error.message;
  }
}

/* ***************
 * Return account data using email
 * ****************/
async function getAccountByEmail(account_email) {
  try {
    const result = await pool.query(
      `SELECT account_id, account_firstname, account_lastname, 
      account_email, account_type, account_password 
      FROM account WHERE account_email = $1`,
      [account_email]
    );
    return result.rows[0];
  } catch (error) {
    return new Error("No matching email found.");
  }
}

/* ***************
 * Return account data using account_id
 * ****************/
async function getAccountById(account_id) {
  try {
    const result = await pool.query(
      `SELECT account_id, account_firstname, account_lastname, 
      account_email, account_type, account_password 
      FROM account WHERE account_id = $1`,
      [account_id]
    );
    return result.rows[0];
  } catch (error) {
    return new Error("No matching account found.");
  }
}

/* ***************
 * Update account data using account_id
 * ****************/
async function updateAccount(
  account_firstname,
  account_lastname,
  account_email,
  account_id
) {
  try {
    const sql = `UPDATE account 
      SET account_firstname = $1, account_lastname = $2, 
      account_email = $3 WHERE account_id = $4 RETURNING *`;
    const data = await pool.query(sql, [
      account_firstname,
      account_lastname,
      account_email,
      account_id,
    ]);
    return data;
  } catch (error) {
    console.error("Error in update model: " + error);
  }
}

/* ****************
 * Update new password
 * ****************/
async function changePassword(account_password, account_id) {
  try {
    const sql = `UPDATE account SET account_password = $1 
    WHERE account_id = $2 RETURNING *`;
    return await pool.query(sql, [account_password, account_id]);
  } catch (error) {
    return error.message;
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

module.exports = {
  registerAccount,
  checkExistingEmail,
  checkLoginEmail,
  checkLoginPass,
  getAccountByEmail,
  getAccountById,
  updateAccount,
  changePassword,
  getReviewsByAccId,
};
