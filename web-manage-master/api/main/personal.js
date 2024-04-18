const personal = async (req,res,sqlMain,baseUrl,selectUser) => {
	res.status(200)
	// get 获取个人信息 post 修改个人信息
	// post params
	// nickName 昵称
	
	const {id,avatar,nickName,account,user_type,push_job,push_address,push_type} = await selectUser(req,res,sqlMain)
	
	if(req.method === 'GET'){
		// 评论全部数量
		let commentsAllCount = 0
		// 查询二级，三级评论
		function useComments(res){
			return new Promise(async(resolve, reject) => {
				
				const selectSCountComments = await sqlMain.selectJoinSql(
				'COUNT(1)','user',
				'secondary_comments','secondary_comments.user_id','user.id',
				'secondary_comments.comments_id = '+res.id+''
				)
				commentsAllCount += selectSCountComments[0]['COUNT(1)']?selectSCountComments[0]['COUNT(1)']:0
				
				// 查询三级评论
				
				const selectTCountComments = await sqlMain.selectJoinSql(
				'COUNT(1)','user',
				'three_comments','three_comments.user_id','user.id',
				'three_comments.comments_id = '+res.id+''
				)
				commentsAllCount += selectTCountComments[0]['COUNT(1)']?selectTCountComments[0]['COUNT(1)']:0
				
				
				
				resolve(commentsAllCount) 
			})
		}
		const selectMyComments = await sqlMain.selectJoinSql('comments.id,comments.community_id,nickName,avatar,comments.create_time,comments.content,community.title','(community,user)','comments','comments.community_id','community.id  AND comments.user_id = user.id','community.user_id = '+ id+' order by comments.id desc')
		
		// forEach，map内部不支持异步
		for(let res of selectMyComments){
			await useComments(res)
		}
		// 查询我的发布数量
		const selectReleaseCount = await sqlMain.selectJoinSql(
		'count(1)','user',"community",
		"community.user_id","user.id",
		"community.user_id = "+id," AND community.delete_status = 1"
		)
		const {'count(1)':releaseCount} = selectReleaseCount[0] 
		// 查询我的评论数量
		const commentsCount = commentsAllCount + selectMyComments.length
		// 查询我的收藏数量
		const selectCollectionCount = await sqlMain.selectJoinSql(
		'count(1)','(user,community)',"collection",
		"collection.user_id","user.id",
		"collection.community_id = community.id  AND user.id = " + id,"",""
		)
		const {'count(1)':collectionCount} = selectCollectionCount[0]
		
		res.send({
			code: 200,
			data:{
				avatar:avatar?baseUrl+'avatar/'+avatar:avatar,
				nickName:nickName,
				account:account,
				user_type:user_type,
				push_job:push_job,
				push_address:push_address,
				push_type:push_type,
				releaseCount:releaseCount,
				commentsCount:commentsCount,
				collectionCount:collectionCount
			},
			message: "成功",
		})
		
		
		
	}else{
		const {nick_name} = req.body
		if(!nick_name){
			res.send({
				code: 400,
				message: "请输入您的昵称",
			})
		}else{
			if(nick_name === nickName){
				res.send({
					code: 200,
					message: "修改成功",
				})
				return
			}
			const selectIsExistNickName = await sqlMain.selectExistSql('user','nickName',nick_name)
			if(!selectIsExistNickName){
				res.send({
					code: 400,
					message: "修改失败",
				})
				return
			}
			const {'count(*)':count} = selectIsExistNickName[0]
			if(count > 0){
				res.send({
					code: 400,
					message: "昵称已存在",
				})
				return
			}
			const updateNickName = await sqlMain.updateSql('user','nickName = ?','Id',[nick_name,id])
			
			if(!updateNickName || !updateNickName.changedRows){
				res.send({
					code: 400,
					message: "修改失败",
				})
				return
			}
			res.send({
				code: 200,
				message: "修改成功",
			})
			
		}
		
	}

}
module.exports = personal
