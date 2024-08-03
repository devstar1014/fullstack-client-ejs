const express = require("express");
const router = express.Router();

router.use(express.static("public"));

router.get("/", async (request, response) => {
  if (request.session.user) {
    response.render("session", {
      status: "Logged in as " + request.session.user.user_name,
    });
    return;
  } else {
    request.session.status = "You must be logged in to view this page";
    response.redirect("/");
    return;
  }
});

module.exports = router;
