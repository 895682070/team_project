const gameRecord = async (req, res,sqlMain,moment,selectUser,baseUrl) => {
	res.status(200)
	// user_account:本人
	// record:棋盘记录
	// other_account:对方
	// win：输赢 1：赢，0：输
	// game_type：游戏类型：1：五子棋
	// grade：分数，赢了：加5分，输了减5分
	
	if(req.method === 'GET'){
		const {account} = await selectUser(req,res,sqlMain)
		const selectComments = await sqlMain.selectJoinSql('gameRecord.grade,gameRecord.id,gameRecord.record,gameRecord.user_account,gameRecord.other_account,gameRecord.win,gameRecord.game_type,gameRecord.create_time,nickName,avatar','gameRecord','user','user.account','gameRecord.other_account','gameRecord.user_account = "'+account+'"  order by gameRecord.id desc')
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
			res.create_time = moment(res.create_time).format("YYYY-MM-DD HH:mm:ss")
			res.avatar = res.avatar?baseUrl+'avatar/'+res.avatar:res.avatar
			if(res.win){
				total_grade += res.grade
			}else{
				total_grade -= res.grade
			}
		})
		
		res.json({
			code: 200,
			data:selectComments,
			total:total_grade,
			message: "",
		})
	}else if(req.method === 'POST'){
		const {user_account,record,other_account,win,game_type,grade} = req.body
		const create_time = moment().utcOffset(8).format("YYYY-MM-DD HH:mm:ss")
		const insetData = await sqlMain.insetSql('gameRecord','user_account,record,other_account,win,game_type,grade,create_time',[user_account,record,other_account,win,game_type,grade,create_time])
		if(insetData.insertId){
			res.json({
				code: 200,
				message: "记录成功",
			})
		}else{
			res.json({
				code: 400,
				message: "记录失败",
			})
		}
	}
}
module.exports = gameRecord
