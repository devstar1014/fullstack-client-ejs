if (process.env.NODE_env !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const session = require("express-session");
const passport = require("passport");
const port = process.env.PORT || 3000;
global.DEBUG = process.env.DEBUG || false;

const searchRouter = require("./routes/search");

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use("/search", searchRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.get("/", async (request, response) => {
  response.render("index");
  return;
});

app.use((request, response) => {
  response.status(404).send("404 - Page not found");
});
