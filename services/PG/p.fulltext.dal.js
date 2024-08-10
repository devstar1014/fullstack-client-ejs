const dal = require("./p.db");

var getFullText = function (text) {
  if (DEBUG) console.log("postgres.dal.getFullText()");
  return new Promise(function (resolve, reject) {
    const sql = `SELECT product_id AS id, name, description, price, condition FROM Products \
    WHERE description iLIKE '%'||$1||'%' \
          OR name iLIKE '%'||$1||'%'`;

    if (DEBUG) console.log(sql);
    dal.query(sql, [text], (err, result) => {
      if (err) {
        if (DEBUG) console.log(err);
        reject(err);
      } else {
        if (DEBUG) console.log(`Row count: ${result.rowCount}`);
        resolve(result.rows);
      }
    });
  });
};

var getProductById = function (id) {
  return new Promise(function (resolve, reject) {
    const sql = `SELECT product_id AS id, name, price, description, release_date AS release_year, condition FROM Products WHERE product_id = $1`;

    dal.query(sql, [id], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result.rows[0]);
      }
    });
  });
};

var searchProducts = function (query) {
  return getFullText(query);
};

module.exports = {
  getFullText,
  searchProducts,
  getProductById,
};
