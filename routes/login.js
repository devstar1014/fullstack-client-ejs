const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");
const router = express.Router();
const { checkNotAuthenticated } = require("../config/passport.config.js");
const UsersDAL = require("../services/PG/p.Users.dal.js");

// Import logging utilities
const logger = require("../utils/logger");
const logToMongo = require("../services/Mongo/M.log");
const logToPostgres = require("../services/PG/p.log");

router.use(express.static("public"));

router.get("/", checkNotAuthenticated, async (request, response) => {
  response.render("login", {
    status: request.session.status,
    user: request.user,
  });
  return;
});

router.post(
  "/",
  checkNotAuthenticated,
  (req, res, next) => {
    const { username } = req.body;

    // Log the login attempt
    logger.info(`Login attempt for user: ${username}`);
    logToMongo('info', `Login attempt for user: ${username}`);
    logToPostgres('info', `Login attempt for user: ${username}`);

    next();
  },
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true
  }),
  (req, res) => {
    // This function only runs on successful login
    const { username } = req.body;
    logger.info(`User logged in: ${username}`);
    logToMongo('info', `User logged in: ${username}`);
    logToPostgres('info', `User logged in: ${username}`);
  }
);

router.get("/new", checkNotAuthenticated, async (request, response) => {
  response.render("register", {
    status: request.session.status,
    user: request.user,
  });
  return;
});

router.post("/new", checkNotAuthenticated, async (request, response) => {
  try {
    const hashedPassword = await bcrypt.hash(request.body.password, 10);
    await UsersDAL.createUser(
      request.body.username,
      request.body.email,
      hashedPassword
    );

    // Log successful user registration
    logger.info(`User registered: ${request.body.username}`);
    logToMongo('info', `User registered: ${request.body.username}`);
    logToPostgres('info', `User registered: ${request.body.username}`);

    request.session.status = "User created";
    response.redirect("/login");
  } catch (error) {
    // Log error during user registration
    logger.error(`Error creating user: ${error.message}`);
    logToMongo('error', `Error creating user: ${error.message}`);
    logToPostgres('error', `Error creating user: ${error.message}`);

    console.error("Error creating user:", error);
    request.session.status = "Error creating user";
    response.redirect("/login/new");
  }
});

router.delete("/exit", async (request, response, next) => {
  request.logout((error) => {
    if (error) return next(error);

    // Log logout
    logger.info(`User logged out: ${request.user.username}`);
    logToMongo('info', `User logged out: ${request.user.username}`);
    logToPostgres('info', `User logged out: ${request.user.username}`);

    request.session.status = "Logged out";
    response.redirect("/login");
  });
});

module.exports = router;

