if (process.env.NODE_env !== "production") {
  require("dotenv").config();
}

const express = require("express");
const session = require("express-session");
const methodOverride = require("method-override");

const app = express();
const port = parseInt(process.env.PORT) || 3000;
global.DEBUG = process.env.DEBUG === "true" || false;
console.log("DEBUG:", DEBUG);

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

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.get("/", async (request, response) => {
  response.render("index", { status: request.session.status });
  return;
});

const loginRouter = require("./routes/login");
app.use("/login", loginRouter);

const sessionRouter = require("./routes/session");
app.use("/test", sessionRouter);

app.use((request, response) => {
  response.status(404).send("404 - Page not found");
});
