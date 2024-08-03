const express = require("express");
const router = express.Router();
const { searchProducts } = require("../services/p.fulltext.dal");

router.get("/", async (req, res) => {
  const query = req.query.q;
  if (!query) {
    return res.render("search", { products: [], query: "" });
  }

  try {
    const products = await searchProducts(query);
    res.render("search", { products, query });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;