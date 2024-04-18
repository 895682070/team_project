const addQuestionColletion = async (req, res,sqlMain,moment,selectUser) => {
	res.status(200)
	// id:问题id
	//score:分数
	const {id:user_id} = await selectUser(req,res,sqlMain)
	const {id,score} = req.body
	const selectExist = await sqlMain.selectTable('id','question_collection','WHERE bank_id = '+id)
	const create_time = moment().utcOffset(8).format("YYYY-MM-DD HH:mm:ss")
	
	if(selectExist&&selectExist.length > 0){
		
		const updateData = await sqlMain.updateSql('question_collection','score = ?,create_time = ?','id',[score,create_time,selectExist[0].id])
		res.json({
			code: 200,
			message: "添加成功",
		})
		return
	}
	
	const insetData = await sqlMain.insetSql('question_collection','user_id,bank_id,score,create_time',[user_id,id,score,create_time])
	if(insetData?.insertId){
		res.json({
			code: 200,
			message: "添加成功",
		})
	}else{
		res.json({
			code: 400,
			message: "添加失败",
		})
	}
}
module.exports = addQuestionColletion
