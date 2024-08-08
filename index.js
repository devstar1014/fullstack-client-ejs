if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

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
const logger = require("./utils/logger");

// Variables
const port = parseInt(process.env.PORT) || 3000;
global.DEBUG = process.env.DEBUG === "true" || false;


// Connect to MongoDB
connectDB();

// Log server start
logger.info('Server started successfully');

if (!process.env.SESSION_SECRET) {
  console.error("SESSION_SECRET is not defined!");
  process.exit(1); // Exit if the secret is not set
}


// Set up the app
const app = express();
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

// Route to fetch products from MongoDB
app.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Route to fetch users from MongoDB
app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.use((request, response) => {
  response.status(404).send("404 - Page not found");
});
