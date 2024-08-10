const Log = require("./M.log");
const getLogs = require("./M.log").getLogs;
const getErrorLogs = require("./M.errorLog").getErrorLogs;
const getSearchLogs = require("./M.searchLog").getSearchLogs;
async function getMongoLogs() {
  return await getLogs();
}

async function getSearchLog() {
  return await getSearchLogs();
}

async function getErrorLog() {
  return await getErrorLogs();
}

module.exports = { getMongoLogs, getSearchLog, getErrorLog };
