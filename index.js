if (process.env.NODE_env !== "production") {
  require("dotenv").config();
}
// Imports
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const flash = require("express-flash");
const methodOverride = require("method-override");
const {
  checkAuthenticated,
  checkNotAuthenticated,
} = require("./config/passport.config");

// Variables
const port = parseInt(process.env.PORT) || 3000;
global.DEBUG = process.env.DEBUG === "true" || false;

//passport setup
require("./config/passport.config");

// Set up the app
const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.get("/", async (request, response) => {
  response.render("index", {
    status: request.session.status,
    user: request.user,
  });
  return;
});

const loginRouter = require("./routes/login");
app.use("/login", loginRouter);

const sessionRouter = require("./routes/session");
app.use("/test", sessionRouter);

app.use((request, response) => {
  response.status(404).send("404 - Page not found");
});
