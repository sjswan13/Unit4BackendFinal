require('dotenv').config();

async function query(sql, params, callback) {
  return db.query(sql, params, callback);
}

module.exports = { query };  
