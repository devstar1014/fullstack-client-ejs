const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  level: String,
  message: String,
  timestamp: { type: Date, default: Date.now }
});

const Log = mongoose.model('Log', logSchema);

function logToMongo(level, message) {
  const logEntry = new Log({ level, message });
  logEntry.save().catch(err => console.error('Failed to log to MongoDB', err));
}

module.exports = logToMongo;
