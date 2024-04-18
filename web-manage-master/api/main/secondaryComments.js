const secondaryComments = async (req,res,sqlMain,moment,baseUrl,selectUser) => {
	res.status(200)
	// post UrlParmas
		//id 评论id 
	// post parmas ：
		//article_id 文章id
		//content 评论内容
		//be_user_id 二级评论的用户id
		
	
	const {id:user_id,user_type} = await selectUser(req,res,sqlMain)
	const {id} = req.params
	
	
	const {content,article_id,be_user_id} = req.body
	if(!content){
		res.send({
			code: 400,
			message: "请输入评论内容",
		})
		return;
	}
	let insetComments = ""
	const create_time = moment().utcOffset(8).format("YYYY-MM-DD HH:mm:ss")
	if(be_user_id){
		insetComments = await sqlMain.insetSql('three_comments',
		'community_id,comments_id,user_id,be_user_id,create_time,content',
		[article_id,id,user_id,be_user_id,create_time,content])
	}else{
		insetComments = await sqlMain.insetSql('secondary_comments',
		'community_id,comments_id,user_id,create_time,content',
		[article_id,id,user_id,create_time,content])
	}
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
module.exports = secondaryComments
