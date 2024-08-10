const DAL = require("./p.db.js");

const getUsers = async () => {
  const SQL = `SELECT * FROM Users`;
  try {
    const results = await DAL.query(SQL);
    if (DEBUG) console.table(results.rows);
    return results.rows;
  } catch (error) {
    console.error("Error fetching users:", error);
  }
};

const getUserByEmail = async (email_address) => {
  const SQL = `SELECT * FROM Users WHERE email_address = $1`;
  try {
    const results = await DAL.query(SQL, [email_address]);
    if (DEBUG) console.table(results.rows[0]);
    return results.rows[0];
  } catch (error) {
    console.error("Error fetching user by email:", error);
  }
};

const getUserbyUsername = async (user_name) => {
  const SQL = `SELECT * FROM Users WHERE user_name = $1`;
  try {
    const results = await DAL.query(SQL, [user_name]);
    if (DEBUG) console.table(results.rows[0]);
    return results.rows[0];
  } catch (error) {
    console.error("Error fetching user by username:", error);
  }
};

const getUserById = async (user_id) => {
  const SQL = `SELECT * FROM Users WHERE user_id = $1`;
  try {
    const results = await DAL.query(SQL, [user_id]);
    if (DEBUG) console.table(results.rows[0]);
    return results.rows[0];
  } catch (error) {
    console.error("Error fetching user by id:", error);
  }
};

const createUser = async (user_name, email_address, password) => {
  const SQL = `INSERT INTO Users (user_name, email_address, password) VALUES ($1, $2, $3) RETURNING *`;
  try {
    const results = await DAL.query(SQL, [user_name, email_address, password]);
    // console.log("results ==>", results);
    if (DEBUG) console.table(results.rows[0]);
    return results.rows[0];
  } catch (error) {
    if (error.code === "23505") {
      console.error("User already exists");
      return null;
    } else {
      console.error("Error creating user:", error);
    }
  }
};

module.exports = {
  getUsers,
  getUserByEmail,
  getUserbyUsername,
  getUserById,
  createUser,
};
