const deleteQuestionColletion = async (req, res,sqlMain,moment) => {
	res.status(200)
	// id:删除id
	const {id} = req.body
	if (!id) {
		res.json({
			code: 400,
			message: "请选择一个需要删除的问题！",
		})
	}else{
		const deleteQuestResult = await sqlMain.deleteSql('question_collection','id',id)
		
		if(deleteQuestResult?.affectedRows){
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
module.exports = deleteQuestionColletion
