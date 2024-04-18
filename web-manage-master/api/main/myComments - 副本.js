const myComments = async (req,res,sqlMain,moment,baseUrl,selectUser) => {
	res.status(200)
	
	
	const {id} = await selectUser(req,res,sqlMain)
	
	const selectMyComments = await sqlMain.selectJoinSql('comments.id,comments.community_id,nickName,avatar,comments.create_time,comments.content,community.title','(community,user)','comments','comments.community_id','community.id  AND comments.user_id = user.id','community.user_id = '+ id+' order by comments.id desc')
	if(!selectMyComments){
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
			// const selectSCountComments = await sqlMain.selectJoinSql(
			// 'COUNT(1)','user',
			// 'secondary_comments','secondary_comments.user_id','user.id',
			// 'secondary_comments.comments_id = '+res.id+''
			// )
			// commentsAllCount += selectSCountComments[0]['COUNT(1)']?selectSCountComments[0]['COUNT(1)']:0
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
			// const selectTCountComments = await sqlMain.selectJoinSql(
			// 'COUNT(1)','user',
			// 'three_comments','three_comments.user_id','user.id',
			// 'three_comments.comments_id = '+res.id+''
			// )
			// commentsAllCount += selectTCountComments[0]['COUNT(1)']?selectTCountComments[0]['COUNT(1)']:0
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
	for(let res of selectMyComments){
		res.avatar = res.avatar?baseUrl+'avatar/'+res.avatar:res.avatar
		res.create_time = moment(res.create_time).format("YYYY-MM-DD HH:mm:ss")
		res.children = await useComments(res)
	}
	
	
	const selectCommentsCount = await sqlMain.selectJoinSql('COUNT(1)','user','comments','comments.user_id','user.id','comments.community_id = '+id+'  order by comments.id desc')
	commentsAllCount += selectCommentsCount[0]['COUNT(1)']?selectCommentsCount[0]['COUNT(1)']:0
	res.send({
		code: 200,
		data:{
			myCommentsData:selectMyComments
		},
		message: "成功",
	})
}
module.exports = myComments
