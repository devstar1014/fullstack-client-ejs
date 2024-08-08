const Product = require('./M.products'); 

async function searchMongoProducts(query) {
  try {
    const results = await Product.find({
      $text: { $search: query } 
    }).exec();
    return results;
  } catch (error) {
    console.error('Error executing MongoDB search query:', error);
    throw error;
  }
}

module.exports = { searchMongoProducts };
