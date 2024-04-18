const alterQuestion = async (req, res,sqlMain,moment) => {
	res.status(200)
	// name:类型名字
	const {id,title,content,category_id} = req.body
	if (!id) {
		res.json({
			code: 400,
			message: "请选择一个需要修改的问题！",
		})
	}else if (!title) {
		res.json({
			code: 400,
			message: "请输入问题名称！",
		})
	}else if(!content){
		res.json({
			code: 400,
			message: "请输入问题内容！",
		})
	}else if(!content){
		res.json({
			code: 400,
			message: "请选择问题类型！",
		})
	}else {
		const updateQuestResult = await sqlMain.updateSql('question_bank','title = ?,content = ?,category_id = ?','Id',[title,content,category_id,id])
		if(updateQuestResult.changedRows){
			res.send({
				code: 200,
				message: "修改成功！",
			})
		}else{
			res.send({
				code: 400,
				message: "修改失败！",
			})
		}
	}


}
module.exports = alterQuestion
