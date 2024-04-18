
const useApp = require('./api/index.js')
const redisClient = require("./redis/index.js")();
const app = useApp()
var server = app.listen(9001,function(err){
	if (err) console.log(err); 
	var host = server.address().address;
	var port = server.address().port;
	redisClient.clearValue()
	console.log('地址:',host)
	console.log('端口:',port)
	console.log("服务开启成功")
})

