const dal = require("./p.db");

var getFullText = function(text) {
  if(DEBUG) console.log("postgres.dal.getFullText()");
  return new Promise(function(resolve, reject) {

    const sql = `SELECT name, description, price FROM Products \
    WHERE description iLIKE '%'||$1||'%' \
          OR name iLIKE '%'||$1||'%'`;

    if(DEBUG) console.log(sql);
    dal.query(sql, [text], (err, result) => {
      if (err) {
        
        if(DEBUG) console.log(err);
        reject(err);
      } else {
        if(DEBUG) console.log(`Row count: ${result.rowCount}`);
        resolve(result.rows);
      }
    }); 
  }); 
};

var searchProducts = function(query) {
    return getFullText(query);
  };

module.exports = {
    getFullText,
    searchProducts
}