if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
// Imports
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const flash = require("express-flash");
const methodOverride = require("method-override");
const {
  checkAuthenticated,
  checkNotAuthenticated,
} = require("./config/passport.config");
const connectDB = require("./services/Mongo/M.db");
const Product = require("./services/Mongo/M.products");

// Variables
const port = parseInt(process.env.PORT) || 3000;
global.DEBUG = process.env.DEBUG === "true" || false;

//passport setup
require("./config/passport.config");

// Connect to MongoDB
connectDB();

// Set up the app
const app = express();
app.set("views", "./views");
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

const searchRouter = require("./routes/search");
app.use("/search", searchRouter);

// const logRouter = require("./routes/log");
// app.use("/log", logRouter);

// Route to fetch products from MongoDB
app.get("/products", checkAuthenticated, async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

app.use((request, response) => {
  response.status(404).send("404 - Page not found");
});
