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
const ErrorLogoMongo = require("../services/Mongo/M.errorLog.js");

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
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureMessage: true,
    failureFlash: true,
  }),
  (request, response) => {
    if (DEBUG) console.log("Login request", request.body);
    if (DEBUG) console.log("Login user object", request.user);

    const username = request.user.user_name; // Access the authenticated user

    logger.info(`User logged in: ${username}`);
    logToMongo("info", `User logged in: ${username}`);
    logToPostgres("info", `User logged in: ${username}`);

    request.session.status = "Welcome, " + request.user.user_name + "!";
    response.render("index", {
      status: request.session.status,
      user: request.user,
    });
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
    logToMongo("info", `User registered: ${request.body.username}`);
    logToPostgres("info", `User registered: ${request.body.username}`);

    request.session.status = "Account created, please log in";
    response.redirect("/login");
  } catch (error) {
    // Log error during user registration
    logger.error(`Error creating user: ${error.message}`);
    logToMongo("error", `Error creating user: ${error.message}`);
    logToPostgres("error", `Error creating user: ${error.message}`);

    console.error("Error creating user:", error);
    request.session.status = "Error creating user";

    // Log to MongoDB with ATUH ERROR
    ErrorLogoMongo(AUTH_ERROR, `Error creating user: ${error.message}`);
    response.redirect("/login/new");
  }
});

router.delete("/exit", async (request, response, next) => {
  const username = request.user.username; // Get username before logout
  request.logout((error) => {
    if (error) return next(error);

    // Log logout
    logger.info(`User logged out: ${username}`);
    logToMongo("info", `User logged out: ${username}`);
    logToPostgres("info", `User logged out: ${username}`);

    request.session.status = "Logged out";
    response.redirect("/");
  });
});

module.exports = router;
