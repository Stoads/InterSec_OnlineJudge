var mysql = require('mysql');
var connection = mysql.createConnection({
  host: 'localhost',
  post: 3306,
  user: 'root',
  password: 'stoads1234',
  database: 'onlinejudge_db'
});
module.exports = connection;
