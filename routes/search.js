const express = require("express");
const router = express.Router();
const logger = require('../utils/logger'); // Imported logger
const { searchProducts } = require("../services/PG/p.fulltext.dal");

router.get("/", async (req, res) => {
  const query = req.query.q;
  logger.info(`Keyword search: ${query}`); // Logging the search query
  if (!query) {
    return res.render("search", { products: [], query: "" });
  }

  try {
    const products = await searchProducts(query);
    res.render("search", { products, query });
  } catch (error) {
    logger.error(`Error occurred during search: ${error.message}`);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;

