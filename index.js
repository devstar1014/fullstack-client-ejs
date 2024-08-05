if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const session = require("express-session");
const passport = require("passport");
const connectDB = require("./database/M.database");
const Product = require("./database/models/M.products");
const User = require("./database/models/M.users");

const app = express();
const port = process.env.PORT || 3000;
global.DEBUG = process.env.DEBUG || false;


// Connect to MongoDB
connectDB();

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
