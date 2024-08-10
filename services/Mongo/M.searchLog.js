const mongoose = require('mongoose');

const searchSchema = new mongoose.Schema({
  user: String,
  searchWord: String,
  timestamp: { type: Date, default: Date.now }
});

const SearchWord = mongoose.model('searchword', searchSchema);

function SearchWordToMongo(user, searchWord) {
  const searchEntry = new SearchWord({ user, searchWord });
  searchEntry.save().catch(err => console.error('Failed to log to MongoDB', err));
}

module.exports = SearchWordToMongo;
