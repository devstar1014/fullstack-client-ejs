const express = require("express");
const passport = require("passport");
const router = express.Router();
const { checkAuthenticated } = require("../config/passport.config.js");

router.use(express.static("public"));

router.get("/", checkAuthenticated, async (request, response) => {
  request.session.status = "You are logged in as " + request.user.user_name;
  response.render("session", {
    status: request.session.status,
    user: request.user,
  });
  return;
});

module.exports = router;
