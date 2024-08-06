const express = require("express");
const router = express.Router();
const { searchProducts: searchPGProducts } = require("../services/PG/p.fulltext.dal");
const Product = require("../services/Mongo/M.products");

// Function to search MongoDB products
const searchMongoProducts = async (query) => {
  const regex = new RegExp(query, 'i');
  const products = await Product.find({
    $or: [
      { name: { $regex: regex } },
      { description: { $regex: regex } }
    ]
  });
  return products.map(product => ({
    ...product.toObject(),
    name: `${product.name} (MongoDB)`,
    source: 'mongo'
  }));
};

// Function to search PostgreSQL products
const searchPGProductsWithSource = async (query) => {
  const products = await searchPGProducts(query);
  return products.map(product => ({
    ...product,
    name: `${product.name} (PostgreSQL)`,
    source: 'PG'
  }));
};

router.get("/", async (req, res) => {
  const query = req.query.q;
  if (!query) {
    return res.render("search", { products: [], query: "" });
  }

  try {
    const [pgProducts, mongoProducts] = await Promise.all([
      searchPGProductsWithSource(query),
      searchMongoProducts(query)
    ]);

    // Combines the results from both databases
    let products = [...pgProducts, ...mongoProducts];

    // Sort products alphabetically by name
    products.sort((a, b) => a.name.localeCompare(b.name));

    res.render("search", { products, query });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;