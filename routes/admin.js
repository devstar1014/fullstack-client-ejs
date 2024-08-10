const express = require("express");
const router = express.Router();
const { checkAuthenticated } = require("../config/passport.config.js");
const checkAdmin = require("../middleware/CheckAdmin"); // Ensure the correct path and name
const getLogFileContent = require("../services/getLogFileContent");
const getMongoLogs = require("../services/Mongo/getLogs").getMongoLogs;
const getPostgresLogs = require("../services/PG/getPostgresLogs"); // Import the PostgreSQL logs function
const { getErrorLog, getSearchLog } = require("../services/Mongo/getLogs");
const { getUserById } = require("../services/PG/p.Users.dal.js");

// Check if these imports are functions
console.log("getLogFileContent is a:", typeof getLogFileContent); // Debugging step
console.log("getMongoLogs is a:", typeof getMongoLogs); // Debugging step
console.log("getPostgresLogs is a:", typeof getPostgresLogs); // Debugging step

router.get("/logs", checkAuthenticated, checkAdmin, async (req, res) => {
  // Use both checkAuthenticated and checkAdmin
  try {
    const fileLogs = await getLogFileContent();
    console.log("File Logs:", fileLogs); // Debugging step

    const mongoLogs = await getMongoLogs();
    console.log("Mongo Logs:", mongoLogs); // Debugging step

    const postgresLogs = await getPostgresLogs(); // Fetch PostgreSQL logs
    console.log("PostgreSQL Logs:", postgresLogs); // Debugging step

    res.render("admin/logs", {
      fileLogs,
      mongoLogs,
      postgresLogs, // Include PostgreSQL logs
    });
  } catch (error) {
    console.error("Error fetching logs:", error);
    res.status(500).send("Server error");
  }
});

router.get("/view-logs", checkAuthenticated, checkAdmin, async (req, res) => {
  // Use both checkAuthenticated and checkAdmin
  try {

    const errorLogs = await getErrorLog();
    console.log("Error Logs:", errorLogs); // Debugging step

    const searchLogs = await getSearchLog(); // Fetch from MongoDB logs
    console.log("Search Logs:", searchLogs); // Debugging step

    let sendsearchLogs = [];

    // for (const log of searchLogs) {
    //   let searchlog = new Promise((reslove, reject) => {
    //     let user = getUserById(log.user);
    //     if (user) {
    //       reslove(
    //         sendsearchLogs.push({
    //           user: user.user_name,
    //           searchword: log.searchWord,
    //           timestamp: log.timestamp,
    //         })
    //       );
    //     }
    //   });
    // }

    for (const log of searchLogs) {
      const data = await getUserById(log.user);
      sendsearchLogs.push({
        user: data.user_name,
        searchWord: log.searchWord,
        timestamp: log.timestamp,
      });
    }


    res.render("admin/viewlogs", {
      errorLogs,
      sendsearchLogs,
    });
  } catch (error) {
    console.error("Error fetching logs:", error);
    res.status(500).send("Server error");
  }
});

module.exports = router;
