const Log = require('./M.log'); 

async function getMongoLogs() {
  return await Log.find().sort({ timestamp: -1 }).limit(100); // Fetch the latest 100 logs
}

module.exports = getMongoLogs;
