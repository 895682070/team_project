const gameTotalRecord = async (req, res,sqlMain,moment,selectUser,baseUrl) => {
	res.status(200)
	// 查询积分
	if(req.method === 'POST'){
		const {game_type,account} = req.body
		const selectComments = await sqlMain.selectJoinSql('gameRecord.grade,gameRecord.win','gameRecord','user','user.account','gameRecord.other_account','gameRecord.user_account = "'+account+'" AND gameRecord.game_type = "'+game_type+'" order by gameRecord.id desc')
		
		if(!selectComments){
			res.send({
				code: 400,
				data:null,
				message: "",
			})
			return
		}
		let total_grade = 0
		selectComments.forEach((res,index)=>{
			if(res.win){
				total_grade += res.grade
			}else{
				total_grade -= res.grade
			}
		})
		
		res.json({
			code: 200,
			total:total_grade,
			message: "",
		})
	}
}
module.exports = gameTotalRecord
