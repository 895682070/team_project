const reviseUserPermissions = async (req,res,sqlMain,baseUrl,selectUser) => {
	res.status(200)
	// post params
	// user_id 需要修改的用户id
	// user_permissions 用户权限 1普通 2管理员 3超级管理员
	
	const {id,avatar,nickName,account,user_type:current_user_type} = await selectUser(req,res,sqlMain)
	
	
	const {user_id,user_permissions} = req.body
	
	if(id == user_id){
		res.send({
			code: 400,
			message: "个人无法修改个人账号权限",
		})
		return
	}
	
	
	const selectUserPermissions = await sqlMain.selectTable('user_type','user','WHERE user.id = '+user_id)
	if(!selectUserPermissions){
		res.send({
			code: 400,
			message: "修改失败",
		})
		return
	}
	const {user_type:revise_user_type} = selectUserPermissions[0]

	if((revise_user_type == user_permissions && current_user_type > revise_user_type) || (revise_user_type == user_permissions && current_user_type == 3)){
		res.send({
			code: 200,
			message: "修改成功",
		})
		return
	}
	if(current_user_type <= revise_user_type && current_user_type !== 3){
		res.send({
			code: 400,
			message: "权限不足，无法修改此用户",
		})
		return
	}
	const updatePermissions = await sqlMain.updateSql('user','user_type = ?','Id',[user_permissions,user_id])
	
	if(!updatePermissions || !updatePermissions.changedRows){
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
module.exports = reviseUserPermissions
