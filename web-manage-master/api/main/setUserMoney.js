const setUserMoney = async (req,res,sqlMain,baseUrl,selectUser) => {
	res.status(200)
	// post post 获取他人信息
	const {email,name,score} = req.body
	if(req.method === 'POST'){
		let selectEmail = null
		let landlord_pulse = 0
		if(name === '斗地主'){
			selectEmail = await sqlMain.selectTable('landlord_pulse','user','where user.account = "' +email+'"')
			console.log(selectEmail,email,name,score)
			landlord_pulse = Number(selectEmail[0]?.landlord_pulse) + Number(score)
			await sqlMain.updateSql('user','landlord_pulse = ?','account',[landlord_pulse,email])
		}
		res.send({
			code: 200,
			data:{
				userInfo:selectEmail,
				name:name,
				addScore:landlord_pulse
			},
			message: "",
		})
		
	}

}
module.exports = setUserMoney
