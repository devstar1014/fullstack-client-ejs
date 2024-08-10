const express = require('express');
const router = express.Router();
const { checkAuthenticated } = require("../config/passport.config.js");
const checkAdmin = require('../middleware/CheckAdmin'); // Ensure the correct path and name
const getLogFileContent = require('../services/getLogFileContent');
const getMongoLogs = require('../services/Mongo/getLogs');
const getPostgresLogs = require('../services/PG/getPostgresLogs'); // Import the PostgreSQL logs function

// Check if these imports are functions
console.log('getLogFileContent is a:', typeof getLogFileContent); // Debugging step
console.log('getMongoLogs is a:', typeof getMongoLogs); // Debugging step
console.log('getPostgresLogs is a:', typeof getPostgresLogs); // Debugging step

router.get('/logs', checkAuthenticated, checkAdmin, async (req, res) => { // Use both checkAuthenticated and checkAdmin
  try {
    const fileLogs = await getLogFileContent();
    console.log('File Logs:', fileLogs); // Debugging step

    const mongoLogs = await getMongoLogs();
    console.log('Mongo Logs:', mongoLogs); // Debugging step

    const postgresLogs = await getPostgresLogs(); // Fetch PostgreSQL logs
    console.log('PostgreSQL Logs:', postgresLogs); // Debugging step

    res.render('admin/logs', {
      fileLogs,
      mongoLogs,
      postgresLogs, // Include PostgreSQL logs
    });
  } catch (error) {
    console.error('Error fetching logs:', error);
    res.status(500).send('Server error');
  }
});

module.exports = router;


