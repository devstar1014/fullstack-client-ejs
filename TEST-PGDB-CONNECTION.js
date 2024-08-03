require("dotenv").config();
const pool = require("./services/p.db.js");
const {
  createUser,
  getUsers,
  getUserById,
  getUserByEmail,
} = require("./services/p.Users.dal.js");

global.DEBUG = false;

async function testConnection() {
  try {
    const client = await pool.connect();
    console.log("Connected to the database successfully!");
    client.release();
  } catch (err) {
    console.error("Error connecting to the database:", err);
  }
}

async function testUsers() {
  try {
    let USER_NAME = "testuser5";
    let EMAIL_ADDRESS = "test5@test.com";
    let PASSWORD = "password";
    let userID = await createUser(USER_NAME, EMAIL_ADDRESS, PASSWORD);
    userID
      ? console.log("User created at ID: ", userID.user_id)
      : console.log("User already exists!");
    let users = await getUsers();
    console.table(users);
    let user = await getUserById(10);
    console.table(user);
    user = await getUserByEmail("test2@test.com");
    console.table(user);
  } catch (err) {
    console.error("Error fetching users:", err);
  }
}

testConnection();
testUsers();
