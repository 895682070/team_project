
const jwt = require("jsonwebtoken");
console.log(jwt)
const authorization = {
	// 生成token
	generateToken:(key,time="14d")=>{
		token = jwt.sign(key, 'secret',{
		  expiresIn:time // 一天
		});
		
		console.log(token)
		return token
	},
	// 验证token
	validationToken:(token)=>{
		let result = jwt.verify(token, 'secret');
		return result
	},
}

module.exports = authorization