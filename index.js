if (process.env.NODE_ENV !== "production") {
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
//const connectDB = require("./database/M.database");
//const Product = require("./database/models/M.products");
//const User = require("./database/models/M.users");

const app = express();
const port = process.env.PORT || 3000;
global.DEBUG = process.env.DEBUG || false;


// Connect to MongoDB
//connectDB();

const searchRouter = require("./routes/search");

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
app.use("/search", searchRouter);


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
