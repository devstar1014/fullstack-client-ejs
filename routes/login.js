const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();

const UsersDAL = require("../services/p.Users.dal.js");

router.use(express.static("public"));

router.get("/", async (request, response) => {
  if (DEBUG) console.log("Session:", request.session);
  if (DEBUG) console.log("User:", request.session.user);
  response.render("login", { status: request.session.status });
  return;
});

router.post("/", async (request, response) => {
  try {
    const user = await UsersDAL.getUserByEmail(request.body.email);
    if (user === undefined || user === null) {
      request.session.status = "Invalid email or password";
      response.redirect("/login");
      return;
    }
    if (await bcrypt.compare(request.body.password, user.password)) {
      request.session.user = user;
      request.session.status = "Logged in as " + request.session.user.user_name;
      response.redirect("/");
      return;
    } else {
      request.session.status = "Invalid email or password";
      response.redirect("/login");
      return;
    }
  } catch (error) {
    console.error("Error logging in:", error);
    request.session.status = "Error logging in";
    response.redirect("/login");
    return;
  }
});

router.get("/new", async (request, response) => {
  response.render("register", { status: request.session.status });
  return;
});

router.post("/new", async (request, response) => {
  try {
    const hashedPassword = await bcrypt.hash(request.body.password, 10);
    if (request.body.username && request.body.email && request.body.password) {
      const results = await UsersDAL.createUser(
        request.body.username,
        request.body.email,
        hashedPassword
      );
      if (results.code === "23505" || results.code === 11000) {
        let constraint;
        let setConstraint = (indexName) => {
          const constraintMap = {
            unique_username: "Username",
            unique_email: "Email Address",
          };
          return constraintMap[indexName] || indexName;
        };
        if (results.code === "23505") {
          constraint = setConstraint(results.constraint);
        } else if (results.code === 11000) {
          const match = result.errmsg.match(/index: (\w+)/);
          const indexName = match ? match[1] : "unknown";
          constraint = setConstraint(indexName);
        }
        request.session.status = `${constraint} already exists`;
        return;
      } else {
        request.session.status =
          "New user created successfully, please log in.";
        response.redirect("/login");
      }
    } else {
      request.session.status = "Missing information";
      response.redirect("/login/new");
      return;
    }
  } catch (error) {
    if (error) {
      return response.status(500).send("Error creating user");
    } else {
      response.redirect("/");
      return;
    }
  }
});

router.get("/exit", async (request, response) => {
  request.session.destroy((error) => {
    if (error) {
      console.error("Error destroying session:", error);
      return response.status(500).send("Error logging out");
    } else {
      response.redirect("/");
    }
  });
});

module.exports = router;
