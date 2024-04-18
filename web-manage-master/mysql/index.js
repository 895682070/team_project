
const mysql = require('mysql')

const useMysql = ()=>{
	let conn = mysql.createConnection({
		host:'xx.xx.xx.xx',
		port:'9004',
		user:'xxxx',
		password:'xxxxxx',
		database:'webTeam',
		charset:'utf8',
	})
	conn.connect(function(err){
		if(!err) return
		console.log('数据库连接错误',err)
	})
	return conn;
}
module.exports = useMysql

