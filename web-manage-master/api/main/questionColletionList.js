const questionColletionList = async (req,res,sqlMain,moment,selectUser,baseUrl) => {
	res.status(200)
	const {id:user_id} = await selectUser(req,res,sqlMain)
	// 查询总条数
	const selectCommunityCount = await sqlMain.selectTable(
	'COUNT(1)','question_collection','','WHERE user_id = '+ user_id
	)
	
	if(!selectCommunityCount){
		res.send({
			code: 400,
			data:null,
			message: "",
		})
		return
	}
	const {'COUNT(1)':total_count} = selectCommunityCount[0]
	if(total_count&&total_count > 0){
		const selectCommunityData = await sqlMain.selectJoinSql(
		'user.avatar,user.nickName,question_collection.id,bank_id,question_bank.title,question_bank.content,score,question_collection.create_time','(user,question_bank)',"question_collection",
		"question_bank.id","question_collection.bank_id AND question_bank.user_id = user.id",
		"all",'WHERE question_collection.user_id = '+ user_id+' order by question_collection.id desc'
		)
		if(!selectCommunityData){
			res.send({
				code: 400,
				data:null,
				message: "",
			})
			return
		}
		selectCommunityData.forEach((val)=>{
			val.avatar = val.avatar?baseUrl+'avatar/'+val.avatar:val.avatar
			return val
		})
		res.send({
			code: 200,
			data:{
				total_count:total_count,
				questionCollectData:selectCommunityData
			},
			message: "",
		})
	}else{
		res.send({
			code: 200,
			data:{
				questionCollectData:[]
			},
			message: "",
		})
	}
	
	
	

}
module.exports = questionColletionList
