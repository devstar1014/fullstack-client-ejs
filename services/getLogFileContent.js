const fs = require('fs');
const path = require('path');

// Ensure you define the correct path to your log file
const logFilePath = path.join(__dirname, '../../logs/error.log');

function getLogFileContent() {
  return new Promise((resolve, reject) => {
    fs.readFile(logFilePath, 'utf8', (err, data) => {
      if (err) {
        return reject(err);
      }
      resolve(data);
    });
  });
}

module.exports = getLogFileContent;

