var mysql = require('mysql')
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'quiz_db',
  socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock'
})
