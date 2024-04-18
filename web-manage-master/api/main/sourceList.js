const sourceList = async (req,res,sqlMain,moment,baseUrl) => {
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
	const selectCommunityCount = await sqlMain.selectTable('COUNT(1)','page_arrange','',(key_word?`WHERE CONCAT(file_title) LIKE "%${key_word.toString()}%" AND page_arrange.file_source = 1`:'WHERE page_arrange.file_source = 1'))
	
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
		const limtTeam = ((page-1)*limit_count)+','+((page-1)*limit_count+limit_count)
		const selectCommunityData = await sqlMain.selectJoinSql(
		'page_arrange.id,page_arrange.file_zip,page_arrange.dir,nickName,avatar,page_arrange.file_title,page_arrange.file_describe,page_arrange.create_time','user',"page_arrange",
		"page_arrange.user_id","user.id",
		"all",(key_word?`WHERE CONCAT(file_title) LIKE "%${key_word.toString()}%" AND page_arrange.file_source = 1`:'WHERE page_arrange.file_source = 1'),'order by page_arrange.id desc limit '+limtTeam
		)
		
		if(!selectCommunityData){
			res.send({
				code: 400,
				data:null,
				message: "",
			})
			return
		}
		selectCommunityData.forEach((res)=>{
			res.create_time = moment(res.create_time).format("YYYY-MM-DD HH:mm:ss")
			res.avatar = res.avatar?baseUrl+'avatar/'+res.avatar:res.avatar
			res.file_zip_url = baseUrl+'public/'+res.file_zip
			res.page_url = baseUrl+'public/'+res.dir
		})
		
		res.send({
			code: 200,
			data:{
				current_page:Number(current_page),
				total_count:total_count,
				total_page:total_page,
				acticleData:selectCommunityData
			},
			message: "",
		})
	}else{
		res.send({
			code: 200,
			data:{
				acticleData:[]
			},
			message: "",
		})
	}
	
	
	

}
module.exports = sourceList
