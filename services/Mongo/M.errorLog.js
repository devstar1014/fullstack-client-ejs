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

async function getErrorLogs() {
  return await ErrorLog.find().sort({ timestamp: -1 }).limit(100);
}
module.exports = { ErrorLogoMongo, getErrorLogs };
