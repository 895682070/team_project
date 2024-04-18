const comments = async (req,res,sqlMain,moment,baseUrl,selectUser) => {
	res.status(200)
	
	// get 获取评论，post 发表评论， deleteComments 删除评论 delete_type 1顶级，2二级，3三级
	
	// get parmas： id 文章id
	// post parmas ：id 文章id content 评论内容
	// post parmas ：id 评论id
	
	const {id:user_id,user_type} = await selectUser(req,res,sqlMain)
	const {id} = req.params
	const {delete_type} = req.body
	// 删除评论
	if(req.url.indexOf('delete') > -1){
		let selectComments = ""
		function useOtherComments(comments_id){
			return new Promise(async(resolve, reject) => {
				// 查询二级评论id
				const selectSComments = await sqlMain.selectJoinSql(
				'secondary_comments.id','user',
				'secondary_comments','secondary_comments.user_id','user.id',
				'secondary_comments.comments_id = '+comments_id+''
				)
				// 查询三级评论id
				const selectTComments = await sqlMain.selectJoinSql(
				'three_comments.id,three_comments.be_user_id','user',
				'three_comments','three_comments.user_id','user.id',
				'three_comments.comments_id = '+comments_id+''
				)
				const result = selectSComments.concat(selectTComments)
				resolve(result) 
			})
		}
		if(user_type > 1){
			if(delete_type==1){
				const commentsArray = await useOtherComments(id)
				for(let val of commentsArray){
					await sqlMain.deleteSql((!val.be_user_id?'secondary_comments':'three_comments'),'id',val.id)
				}
				selectComments = await sqlMain.deleteSql('comments','id',id)
				
				
			}
			if(delete_type==2||delete_type==3){
				selectComments = await sqlMain.deleteSql((delete_type==2?'secondary_comments':'three_comments'),'id',id)
			}
		}else{
			if(delete_type==1){
				const commentsArray = await useOtherComments(id)
				for(let val of commentsArray){
					await sqlMain.deleteSql(
					(!val.be_user_id?'secondary_comments':'three_comments'),
					'id',id + ' AND '+(!val.be_user_id?'secondary_comments.user_id':'three_comments.user_id')+' = '+user_id)
				}
				selectComments = await sqlMain.deleteSql('comments','id',id)
				
				
			}
			if(delete_type==2||delete_type==3){
				selectComments = await sqlMain.deleteSql(
				(delete_type==2?'secondary_comments':'three_comments'),
				'id',id + ' AND '+(delete_type==2?'secondary_comments.user_id':'three_comments.user_id')+' = '+user_id)
			}
			
			
		}
		
		
		if(!selectComments  || !selectComments.affectedRows){
			res.send({
				code: 400,
				message: "删除失败",
			})
			return;
		}
		res.send({
			code: 200,
			message: "删除成功",
		})
		
		return;
	}
	if(req.method === 'GET'){
		
		const selectComments = await sqlMain.selectJoinSql('comments.id,nickName,avatar,comments.create_time,content','user','comments','comments.user_id','user.id','comments.community_id = '+id+'  order by comments.id desc')
		if(!selectComments){
			res.send({
				code: 400,
				message: "查询失败",
			})
			return;
		}
		// 评论全部数量
		let commentsAllCount = 0
		// 查询二级，三级评论
		function useComments(res){
			return new Promise(async(resolve, reject) => {
				// 查询二级评论
				const selectSComments = await sqlMain.selectJoinSql(
				'secondary_comments.id,secondary_comments.user_id,nickName,avatar,secondary_comments.create_time,secondary_comments.content','user',
				'secondary_comments','secondary_comments.user_id','user.id',
				'secondary_comments.comments_id = '+res.id+''
				)
				const selectSCountComments = await sqlMain.selectJoinSql(
				'COUNT(1)','user',
				'secondary_comments','secondary_comments.user_id','user.id',
				'secondary_comments.comments_id = '+res.id+''
				)
				commentsAllCount += selectSCountComments[0]['COUNT(1)']?selectSCountComments[0]['COUNT(1)']:0
				selectSComments.forEach((val)=>{
					val.avatar = val.avatar?baseUrl+'avatar/'+val.avatar:val.avatar
					val.create_time = moment(val.create_time).format("YYYY-MM-DD HH:mm:ss")
					
				})
				// 查询三级评论
				
				const selectTComments = await sqlMain.selectJoinSql(
				'three_comments.id,three_comments.user_id,three_comments.be_user_id,nickName,avatar,three_comments.create_time,three_comments.content','user',
				'three_comments','three_comments.user_id','user.id',
				'three_comments.comments_id = '+res.id+''
				)
				const selectTCountComments = await sqlMain.selectJoinSql(
				'COUNT(1)','user',
				'three_comments','three_comments.user_id','user.id',
				'three_comments.comments_id = '+res.id+''
				)
				commentsAllCount += selectTCountComments[0]['COUNT(1)']?selectTCountComments[0]['COUNT(1)']:0
				for(let val of selectTComments){
					val.avatar = val.avatar?baseUrl+'avatar/'+val.avatar:val.avatar
					val.create_time = moment(val.create_time).format("YYYY-MM-DD HH:mm:ss")
					const selectTUser = await sqlMain.selectAnySql('user','id',val.be_user_id)
					
					val.be_nickName = selectTUser.length > 0?selectTUser[0].nickName:null
				}
				// 查询三级评论的用户信息
				
				
				
				
				const result = selectSComments.concat(selectTComments)
				
				resolve(result) 
			})
		}
		// forEach，map内部不支持异步
		for(let res of selectComments){
			res.avatar = res.avatar?baseUrl+'avatar/'+res.avatar:res.avatar
			res.create_time = moment(res.create_time).format("YYYY-MM-DD HH:mm:ss")
			res.children = await useComments(res)
		}
		
		
		const selectCommentsCount = await sqlMain.selectJoinSql('COUNT(1)','user','comments','comments.user_id','user.id','comments.community_id = '+id+'  order by comments.id desc')
		commentsAllCount += selectCommentsCount[0]['COUNT(1)']?selectCommentsCount[0]['COUNT(1)']:0
		res.send({
			code: 200,
			data:{
				commentsData:selectComments,
				total:commentsAllCount
			},
			message: "成功",
		})
		
	}else{
		const {content} = req.body
		if(!content){
			res.send({
				code: 400,
				message: "请输入评论内容",
			})
			return;
		}
		const create_time = moment().utcOffset(8).format("YYYY-MM-DD HH:mm:ss")
		const insetComments = await sqlMain.insetSql('comments','community_id,user_id,create_time,content',[id,user_id,create_time,content])
		if(!insetComments || !insetComments.insertId){
			res.send({
				code: 400,
				message: "评论失败",
			})
			return;
		}
		res.send({
			code: 200,
			message: "评论成功",
		})
		
	}
	
	
	
}
module.exports = comments
