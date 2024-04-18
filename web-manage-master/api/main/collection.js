const collection = async (req, res, sqlMain, moment, baseUrl,selectUser) => {
	res.status(200)
	// id:文章id
	// status:0 取消收藏，1 收藏
	const {status} = req.body
	const { id } = req.params
	if (Number(status)) {
		const {id:user_id} = await selectUser(req,res,sqlMain)
		const insetCollection = await sqlMain.insetSql('collection', 'community_id,user_id', [Number(id),user_id])
		if (!insetCollection) {
			res.send({
				code: 400,
				data: null,
				message: "",
			})
			return
		}
		res.send({
			code: 200,
			message: "收藏成功",
		})
	} else {
		const deleteCollection = await sqlMain.deleteSql('collection', 'community_id', id)
		
		if (!deleteCollection) {
			res.send({
				code: 400,
				message: "取消收藏失败",
			})
			return
		}
		res.send({
			code: 200,
			message: "取消收藏成功",
		})
	}

}
module.exports = collection
