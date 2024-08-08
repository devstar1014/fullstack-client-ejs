const express = require('express');
const router = express.Router();
const checkAdmin = require('../middleware/CheckAdmin');
const getLogFileContent = require('../services/getLogFileContent');
const getMongoLogs = require('../services/Mongo/getLogs');

// Check if these imports are functions
console.log('getLogFileContent is a:', typeof getLogFileContent); // Debugging step
console.log('getMongoLogs is a:', typeof getMongoLogs); // Debugging step

router.get('/logs', checkAdmin, async (req, res) => {
  try {
    const fileLogs = await getLogFileContent();
    console.log('File Logs:', fileLogs); // Debugging step

    const mongoLogs = await getMongoLogs();
    console.log('Mongo Logs:', mongoLogs); // Debugging step

    res.render('admin/logs', {
      fileLogs,
      mongoLogs,
    });
  } catch (error) {
    console.error('Error fetching logs:', error);
    res.status(500).send('Server error');
  }
});

module.exports = router;

