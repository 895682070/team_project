const personalList = async (req,res,sqlMain,moment,baseUrl) => {
	res.status(200)
	// key_word:搜索内容
	// page：页数
	
	const {key_word} = req.body
	const {page} = req.params
	const limit_count = 20
	if(!page){
		page = 1
	}
	// 查询总条数
	const selectUserCount = await sqlMain.selectTable('COUNT(1)','user','',(key_word?`WHERE nickName LIKE "${key_word.toString()}%" OR account LIKE "${key_word.toString()}%"`:''))
	
	
	if(!selectUserCount){
		res.send({
			code: 400,
			data:null,
			message: "",
		})
		return
	}
	const {'COUNT(1)':total_count} = selectUserCount[0]
	
	if(total_count&&total_count > 0){
		if(page == 'all'){
			const selectUserData = await sqlMain.selectTable(
			'id,nickName,avatar,gomoku_score,is_line,account,user_type,user.create_time','user',(key_word?`WHERE nickName LIKE "${key_word.toString()}%" OR account LIKE "${key_word.toString()}%"`:'')
			)
			if(!selectUserData){
				res.send({
					code: 400,
					data:null,
					message: "",
				})
				return
			}
			selectUserData.forEach((res)=>{
				res.create_time = moment(res.create_time).format("YYYY-MM-DD HH:mm:ss")
				res.avatar = res.avatar?baseUrl+'avatar/'+res.avatar:res.avatar
			})
			res.send({
				code: 200,
				data:{
					userData:selectUserData,
					total_count:total_count,
				},
				message: "",
			})
		}else{
			const current_page = page //当前页数
			const total_page = Math.ceil(total_count/limit_count) //总页数
			// 查询数据
			const limtTeam = ((page-1)*limit_count)+','+(limit_count)
			const selectUserData = await sqlMain.selectTable(
			'id,nickName,last_time,landlord_pulse,avatar,is_line,account,user_type,user.create_time','user',(key_word?`WHERE nickName LIKE "${key_word.toString()}%" OR account LIKE "${key_word.toString()}%"`:''),'order by user.is_line desc limit '+limtTeam
			)
			
			if(!selectUserData){
				res.send({
					code: 400,
					data:null,
					message: "",
				})
				return
			}
			selectUserData.forEach((res)=>{
				res.create_time = moment(res.create_time).format("YYYY-MM-DD HH:mm:ss")
				res.last_time = res.last_time?moment(res.last_time).format("YYYY-MM-DD HH:mm:ss"):''
				res.avatar = res.avatar?baseUrl+'avatar/'+res.avatar:res.avatar
			})
			res.send({
				code: 200,
				data:{
					current_page:Number(current_page),
					total_count:total_count,
					total_page:total_page,
					userData:selectUserData
				},
				message: "",
			})
		}
	}else{
		res.send({
			code: 200,
			data:{
				userData:[]
			},
			message: "",
		})
	}
	
	
	

}
module.exports = personalList
