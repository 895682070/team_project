const reviewArticle = async (req,res,sqlMain,baseUrl,selectUser) => {
	res.status(200)
	// post params
	// article_id 需要修改的文章id
	// review_type 文章审核类型 1通过 2不通过
	// review_dec 不通过描述信息
	const {id,avatar,nickName,account,user_type:current_user_type} = await selectUser(req,res,sqlMain)
	
	
	const {article_id,review_type,review_dec} = req.body
	
	if(current_user_type == 1){
		res.send({
			code: 400,
			message: "权限不足，无法审核",
		})
		return
	}
	
	const updateArticle = await sqlMain.updateSql('community','review_status = ?,review_dec = ?','Id',[review_type,review_dec,article_id])
	if(!updateArticle || !updateArticle.changedRows){
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
module.exports = reviewArticle
