const addQuestionType = async (req, res,sqlMain,moment) => {
	res.status(200)
	// name:类型名字
	const {name} = req.body
	if (!name) {
		res.json({
			code: 400,
			message: "请输入问题类型名称！",
		})
	} else {
		// 查询name是否存在
		const selectName = await sqlMain.selectExistSql('question_type','name',name)
		if(selectName && selectName[0]['count(*)'] > 0){
			res.send({
				code: 400,
				message: "该名字已经存在！",
			})
			return;				
		}
		const create_time = moment().utcOffset(8).format("YYYY-MM-DD HH:mm:ss")
		const insetData = await sqlMain.insetSql('question_type','name,create_time',[name,create_time])
		if(insetData.insertId){
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


}
module.exports = addQuestionType
