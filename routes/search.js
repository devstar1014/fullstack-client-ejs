const express = require("express");
const router = express.Router();

const {
  searchProducts,
  getProductById,
} = require("../services/PG/p.fulltext.dal");
const { checkAuthenticated } = require("../config/passport.config.js");
const {
  searchProducts: searchPGProducts,
} = require("../services/PG/p.fulltext.dal");
const Product = require("../services/Mongo/M.products");

router.get("/", checkAuthenticated, async (req, res) => {
  if (DEBUG) console.log("User is authenticated : ", req.user);
  const query = req.query.q;
  if (!query) {
    return res.render("search", { products: [], query: "", user: req.user });
  }

  try {
    // Search in PostgreSQL
    const pgProducts = await searchPGProducts(query);
    pgProducts.forEach((product) => (product.source = "PostgreSQL"));

    // Search in MongoDB
    const mongoProducts = await Product.find({
      $or: [
        { name: new RegExp(query, "i") },
        { description: new RegExp(query, "i") },
      ],
    }).lean();
    mongoProducts.forEach((product) => (product.source = "Mongo"));

    // Combine results
    let products = [...pgProducts, ...mongoProducts];

    // Sort products alphabetically by name
    products.sort((a, b) => a.name.localeCompare(b.name));

    res.render("search", { products, query, user: req.user });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// New route to handle individual product pages
router.get("/product/:source/:id", checkAuthenticated, async (req, res) => {
  const productId = req.params.id;
  const source = req.params.source;
  const query = req.query.q || "";
  if (DEBUG) console.log(source);
  try {
    let product;
    if (source === "Mongo") {
      product = await Product.findOne({ id: productId });
    } else if (source === "PostgreSQL") {
      product = await getProductById(productId);
    }
    if (DEBUG) console.log(product);
    if (!product) {
      return res.status(404).send("Product not found");
    }

    res.render("product", { product: product, query: query, user: req.user });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
