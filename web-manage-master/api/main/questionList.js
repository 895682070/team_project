const questionList = async (req,res,sqlMain,moment,baseUrl) => {
	res.status(200)
	// key_word:搜索内容
	// page：页数
	//category_id:类型id
	const {key_word,category_id} = req.body
	const {page} = req.params
	const limit_count = 20
	if(!page){
		page = 1
	}
	// 查询总条数
	const selectCommunityCount = await sqlMain.selectTable('COUNT(1)','question_bank','',(key_word&&category_id?'WHERE title LIKE "%'+key_word?.toString()+'%" AND question_bank.category_id = '+category_id+'AND question_bank.delete_status = 1':key_word?'WHERE title LIKE "%'+key_word?.toString()+'%" AND question_bank.delete_status = 1':category_id?'WHERE question_bank.category_id = '+category_id+' AND question_bank.delete_status = 1':'WHERE question_bank.delete_status = 1'))
	
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
		const current_page = page //当前页数
		const total_page = Math.ceil(total_count/limit_count) //总页数
		// 查询数据
		const limtTeam = ((page-1)*limit_count)+','+(limit_count)
		const selectCommunityData = await sqlMain.selectJoinSql(
		'user.nickName,user.avatar,question_bank.id,question_bank.category_id,question_type.name,title,content,delete_status,question_bank.create_time','(question_type,user)',"question_bank",
		"question_bank.category_id","question_type.id AND user.id = question_bank.user_id",
		"all",(key_word&&category_id?'WHERE title LIKE "%'+key_word?.toString()+'%" AND question_bank.category_id = '+category_id+'AND question_bank.delete_status = 1':key_word?'WHERE title LIKE "%'+key_word?.toString()+'%" AND question_bank.delete_status = 1':category_id?'WHERE question_bank.category_id = '+category_id+' AND question_bank.delete_status = 1':'WHERE question_bank.delete_status = 1'),'order by question_bank.id desc limit '+limtTeam
		)
		
		if(!selectCommunityData){
			res.send({
				code: 400,
				data:null,
				message: "",
			})
			return
		}
		selectCommunityData.map((val)=>{
			val.category_name = val.name
			val.create_time = moment(val.create_time).format("YYYY-MM-DD HH:mm:ss")
			val.avatar = val.avatar?baseUrl+'avatar/'+val.avatar:val.avatar
			delete val.name
			return val
		})
		res.send({
			code: 200,
			data:{
				current_page:Number(current_page),
				total_count:total_count,
				total_page:total_page,
				questionData:selectCommunityData
			},
			message: "",
		})
	}else{
		res.send({
			code: 200,
			data:{
				questionData:[]
			},
			message: "",
		})
	}
	
	
	

}
module.exports = questionList
