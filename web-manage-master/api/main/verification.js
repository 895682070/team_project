
var sendMessage = require('../common/sendMessage.js')
const verification = async (req,res,redisClient,sqlMain)=>{
	res.status(200)
	//email 邮箱
	const reg = /^\w+@\w+\.\w+$/i;
	if (!req.body.email) {
		res.json({
			code: 400,
			message: "请输入邮箱",
		})
	} else if (!req.body.email.match(reg)) {
		res.json({
			code: 400,
			message: "邮箱格式不正确",
		})
	} else {
		if(req.body.tip == '1'){
			const selectEmail = await sqlMain.selectExistSql('user','account',req.body.email)
			if(selectEmail && selectEmail[0]['count(*)'] > 0){
				res.send({
					code: 403,
					message: "该邮箱已经注册！",
				})
				return;				
			}
		}
		code = ""
		for (let i = 0; i < 5; i++) {
			code += Math.ceil(Math.random() * 9);
		}
		redisClient.setValue(req.body.email, code)
		const content = `<div style="color:#333;font-size:15px">【WEB技术研讨群】感谢您的注册，您的验证码为<strong style="color:blue;font-size:25px"> ${code} </strong>请勿泄露于他人<div>`
		sendMessage(req.body.email,content,'验证码发送成功',res)
		res.json({
			code: 200,
			message: '',
		})
	}
}
module.exports = verification

