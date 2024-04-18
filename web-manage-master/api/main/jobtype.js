const jobType = async (req,res,sqlMain,moment,baseUrl) => {
	res.status(200)
	// name:职位名称 post parmas
	const {name} = req.body
	if(req.method === 'GET'){
		const selectJobData = await sqlMain.selectTable(
		'id,name','communityType',"",""
		)
		
		res.send({
			code: 200,
			data:{
				jobData:selectJobData
			},
			message: "",
		})
	}else{
		if(!name){
			res.json({
				code: 400,
				message: "请输入职位名称",
			})
			return
		}
		const selectIsExit = await sqlMain.selectTable(
		'id,name','communityType',`WHERE name = "${name}"`,""
		)
		
		if(selectIsExit&&selectIsExit.length > 0){
			res.json({
				code: 400,
				message: "已存在相同的职位名称",
			})
			return
		}
		
		const create_time = moment().utcOffset(8).format("YYYY-MM-DD HH:mm:ss")
		const insetData = await sqlMain.insetSql('communityType','name,create_time',[name, create_time])
		if(insetData.insertId){
			res.json({
				code: 200,
				message: "添加成功",
			})
		}
	}
}
module.exports = jobType
