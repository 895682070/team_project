
const pushSet = async (req,res,sqlMain,baseUrl,selectUser) => {
	res.status(200)
	// push_job  推送职位
	//push_address 推送地址
	//push_type 是否推送 1 推送 0 不推送
	
	
	const {id} = await selectUser(req,res,sqlMain)
	
	const {push_job,push_address,push_type} = req.body
	
	const updatePush = await sqlMain.updateSql('user','push_job = ?,push_address = ?,push_type = ?','Id',[push_job,push_address,push_type,id])
	
	if(!updatePush){
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
module.exports = pushSet
