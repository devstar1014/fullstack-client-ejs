const express = require("express");
const router = express.Router();
const { searchProducts } = require("../services/PG/p.fulltext.dal");
const { checkAuthenticated } = require("../config/passport.config.js");

router.get("/", checkAuthenticated, async (req, res) => {
  const query = req.query.q;
  if (!query) {
    return res.render("search", { products: [], query: "", user: req.user });
  }

  try {
    const products = await searchProducts(query);
    res.render("search", { products, query, user: req.user });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
