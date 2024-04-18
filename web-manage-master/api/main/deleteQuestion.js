const deleteQuestion = async (req, res,sqlMain,moment) => {
	res.status(200)
	// id:删除id
	const {id} = req.body
	if (!id) {
		res.json({
			code: 400,
			message: "请选择一个需要删除的问题！",
		})
	}else{
		const updateQuestResult = await sqlMain.updateSql('question_bank','delete_status = ?','Id',[0,id])
		if(updateQuestResult?.changedRows){
			res.send({
				code: 200,
				message: "删除成功！",
			})
		}else{
			res.send({
				code: 400,
				message: "删除失败！",
			})
		}
	}


}
module.exports = deleteQuestion
