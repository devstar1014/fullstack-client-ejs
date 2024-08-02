const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId: String,
  username: String,
  email: String,
  password: String,
  lastUpdated: Date,
});

const User = mongoose.model('User', userSchema);

module.exports = User;
