const mongoose = require("mongoose");
const ErrorLogoMongo = require("./M.errorLog").ErrorLogoMongo;

const searchSchema = new mongoose.Schema({
  user: String,
  searchWord: String,
  timestamp: { type: Date, default: Date.now },
});

const SearchWord = mongoose.model("searchword", searchSchema);

function SearchWordToMongo(user, searchWord) {
  const searchEntry = new SearchWord({ user, searchWord });
  searchEntry.save().catch((err) => {
    ErrorLogoMongo(SEARCH_ERROR, "'Failed to log to MongoDB'");
    console.error("Failed to log to MongoDB", err);
  });
}

async function getSearchLogs() {
  return await SearchWord.find().sort({ timestamp: -1 }).limit(100);
}
module.exports = { SearchWordToMongo, getSearchLogs };
