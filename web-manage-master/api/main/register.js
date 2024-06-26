const register = (req, res, redisClient,sqlMain,moment,md5) => {
	res.status(200)
	// email:邮箱--账号
	// code：验证码
	// nickName：昵称
	// password：密码
	const emailReg = /^\w+@\w+\.\w+$/i;
	const passwordReg = /^[a-zA-Z0-9]{6,22}$/
	const {email,code:passCode,nickName,password} = req.body
	if (!email) {
		res.json({
			code: 400,
			message: "请输入邮箱",
		})
	} else if (!email.match(emailReg)) {
		res.json({
			code: 400,
			message: "邮箱格式不正确",
		})
	} else if (!passCode) {
		res.json({
			code: 400,
			message: "请输入验证码",
		})
	} else if (!nickName) {
		res.json({
			code: 400,
			message: "请输入昵称",
		})
	} else if (!password) {
		res.json({
			code: 400,
			message: "请输入密码",
		})
	} else if (!password.match(passwordReg)) {
		res.json({
			code: 400,
			message: "密码格式为6-22位字母+数字",
		})
	} else {
		redisClient.getValue(email, async (code) => {
			
			if (passCode === code) {
				
				const selectEmail = await sqlMain.selectExistSql('user','account',email)
				
				
				if(selectEmail && selectEmail[0]['count(*)'] > 0){
					res.send({
						code: 400,
						message: "该邮箱已经注册！",
					})
					redisClient.removeValue(email)
					return;				
				}
				const selectNickName = await sqlMain.selectExistSql('user','account',nickName)
				
				if(selectNickName && selectNickName[0]['count(*)'] > 0){
					res.send({
						code: 400,
						message: "该昵称已经注册！！",
					})
					redisClient.removeValue(email)
					return;				
				}
				const create_time = moment().utcOffset(8).format("YYYY-MM-DD HH:mm:ss")
				const insetData = await sqlMain.insetSql('user','account,nickName,password,create_time',[email, nickName, md5(password),create_time])
				if(insetData.insertId){
					res.json({
						code: 200,
						message: "注册成功",
					})
				}else{
					res.json({
						code: 400,
						message: "注册失败",
					})
				}
				res.json({
					code: 400,
					message: "注册失败",
				})
			} else {
				res.json({
					code: 400,
					message: "验证码错误/失效",
				})

			}
		})
	}


}
module.exports = register
