var nodemailer = require("nodemailer")
const sendMessage = async (email,content,message,res)=>{
	
	const transport = nodemailer.createTransport({
		host: "smtp.qq.com",
		secureConnection: true,
		port: 465,
		auth: {
			user: "1922771515@qq.com",
			pass: "daqorawcehuodaae"
		}
	})
	
	
	const mailOptions = {
		from: "WEB技术研讨群 <1922771515@qq.com>",
		to: email,
		subject: "来自WEB技术研讨群",
		html: content,
	}
		
	transport.sendMail(mailOptions, function(err, response) {
		
		if(res){
			if (err) {
				
				res.json({
					code: 400,
					message: "信息发送失败",
					err: err
				})
			} else {
				
				res.json({
					code: 200,
					message: message,
				})
			}
		}
	})
	
}
module.exports = sendMessage