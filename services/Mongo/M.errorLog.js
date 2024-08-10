const mongoose = require("mongoose");

const errorSchema = new mongoose.Schema({
  errorType: String,
  errorMessage: String,
  timestamp: { type: Date, default: Date.now },
});

const ErrorLog = mongoose.model("errorlogs", errorSchema);

function ErrorLogoMongo(errorType, errorMessage) {
  const errorLog = new ErrorLog({ errorType, errorMessage });
  errorLog
    .save()
    .catch((err) => console.error("Failed to log to MongoDB", err));
}

module.exports = ErrorLogoMongo;
