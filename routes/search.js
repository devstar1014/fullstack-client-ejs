const express = require("express");
const router = express.Router();
const logger = require('../utils/logger'); // Imported logger
const { searchProducts } = require("../services/PG/p.fulltext.dal"); // PostgreSQL search
const { searchMongoProducts } = require("../services/Mongo/mongoSearch.dal"); // MongoDB search

router.get("/", async (req, res) => {
  const query = req.query.q;
  logger.info(`Keyword search: ${query}`); // Logging the search query
  if (!query) {
    return res.render("search", { pgResults: [], mongoResults: [], query: "" });
  }

  try {
    const pgResults = await searchProducts(query); // Search PostgreSQL
    const mongoResults = await searchMongoProducts(query); // Search MongoDB
    res.render("search", { pgResults, mongoResults, query });
  } catch (error) {
    logger.error(`Error occurred during search: ${error.message}`);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;

