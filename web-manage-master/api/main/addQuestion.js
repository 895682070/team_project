const addQuestion = async (req, res,sqlMain,moment,selectUser) => {
	res.status(200)
	// title:标题
	//content:问题内容
	//category_id:问题类型
	const {title,content,category_id} = req.body
	const {id:user_id} = await selectUser(req,res,sqlMain)
	if (!title) {
		res.json({
			code: 400,
			message: "请输入问题名称！",
		})
	}else if(!content){
		res.json({
			code: 400,
			message: "请输入问题内容！",
		})
	}else if(!category_id){
		res.json({
			code: 400,
			message: "请选择问题类型！",
		})
	} else {
		// 查询name是否存在
		const selectTitle = await sqlMain.selectExistSql('question_bank','title',title)
		if(selectTitle && selectTitle[0]['count(*)'] > 0){
			res.send({
				code: 400,
				message: "该标题已经存在！",
			})
			return;				
		}
		
		const create_time = moment().utcOffset(8).format("YYYY-MM-DD HH:mm:ss")
		const insetData = await sqlMain.insetSql('question_bank','title,content,category_id,create_time,user_id',[title,content,category_id,create_time,user_id])
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


}
module.exports = addQuestion
