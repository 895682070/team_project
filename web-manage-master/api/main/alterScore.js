const alterScore = async (req,res,sqlMain,baseUrl,selectUser) => {
	res.status(200)
	// account 用户账号
	// score 分数
	const {account,score} = req.body
	const selectEmail = await sqlMain.selectTable('id','user','where user.account = "' +account+'"')
	
	const updateNickName = await sqlMain.updateSql('user','gomoku_score = ?','Id',[score,selectEmail[0].id])
	
	if(!updateNickName || !updateNickName.changedRows){
		res.send({
			code: 400,
			message: "修改失败",
		})
		return
	}
	res.send({
		code: 200,
		message: "修改成功",
	})

}
module.exports = alterScore
