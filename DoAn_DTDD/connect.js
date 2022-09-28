var mysql = require('mysql');

var conn = mysql.createConnection({
	host: '127.0.0.1',
	port: 3306,
	user: 'root',
	password: '',
	database: 'nodejs_dtdd',
	multipleStatements: true
});

module.exports = conn;