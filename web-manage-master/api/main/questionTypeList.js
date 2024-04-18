const questionTypeList = async (req,res,sqlMain,moment) => {
	res.status(200)
	
	
	
	
	// 根据id查询
	const selectQuestionData = await sqlMain.selectTable('*','question_type','')
	if(!selectQuestionData){
		res.send({
			code: 400,
			data:null,
			message: "",
		})
		return
	}
	res.send({
		code: 200,
		data:{
			questionTypeDetail:selectQuestionData
		},
		message: "",
	})
}
module.exports = questionTypeList
