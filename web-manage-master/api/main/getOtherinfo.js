const getOtherinfo = async (req,res,sqlMain,baseUrl,selectUser) => {
	res.status(200)
	// post post 获取他人信息
	const {email} = req.body
	if(req.method === 'POST'){
		const selectEmail = await sqlMain.selectTable('is_line,landlord_pulse','user','where user.account = "' +email+'"')
		if(selectEmail&&selectEmail.length === 0){
			res.send({
				code: 400,
				message: "账号不存在！",
			})
			return;
		}
		res.send({
			code: 200,
			data:selectEmail[0],
			message: "",
		})
		
	}

}
module.exports = getOtherinfo
