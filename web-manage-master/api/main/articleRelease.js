var sendMessage = require('../common/sendMessage.js')
const articleRelease = async (req, res,sqlMain,moment,selectUser,pathModules,fs) => {
	res.status(200)
	// article_id 修改
	// image_name:图片名称
	// title：标题
	// priview_address：预览地址
	// code_address：源码地址
	// content:描述
	// public_status 是否发布 0 不发布，1 发布
	// article_type 文章类型
	// job_address 工作地址
	// job_type 职位
	
	const {job_address_name,job_type_name,image_name,title,priview_address,code_address,content,public_status,article_id,article_type,job_address,job_type} = req.body
	if (!title) {
		res.json({
			code: 400,
			message: "请输入标题",
		})
	} else {
			const {id,nickName,avatar} = await selectUser(req,res,sqlMain)
			const create_time = moment().utcOffset(8).format("YYYY-MM-DD HH:mm:ss")
			let insetArticleData = null
			if(article_id){
				const selectArticleImage = await sqlMain.selectTable(
				'image_path','community',"WHERE id = "+article_id,""
				)
				const dirname = pathModules.dirname(__dirname)
				const storePath = pathModules.join(dirname, 'articles');
				const image = pathModules.join(storePath);
				try{
					// 删除旧头像
					fs.unlinkSync(image+'/'+selectArticleImage[0].image_path)
				}catch(e){
					console.log(e)
				}
				insetArticleData = await sqlMain.updateSql('community',
				'job_address_name = ?,job_type_name = ?,title = ?,image_path = ?,create_time = ?,priview_address = ?,code_address = ?,content = ?,public_status = ?,article_type = ?,job_address = ?,job_type = ?',
				'id',[job_address_name,job_type_name,title,image_name,create_time,priview_address,code_address,content,public_status,article_type,job_address,job_type,article_id])
				
			}else{
				insetArticleData = await sqlMain.insetSql('community',
				'job_address_name,job_type_name,title,image_path,create_time,priview_address,code_address,content,public_status,article_type,job_address,job_type,user_id',
				[job_address_name,job_type_name,title,image_name,create_time,priview_address,code_address,content,public_status,article_type,job_address,job_type,id])
			}
			
			
			if(insetArticleData&&insetArticleData.insertId||insetArticleData.changedRows){
				
				res.send({
					code: 200,
					message: article_id?"修改成功":"发布成功",
				})
				if(public_status == 1 && article_type == 3){
					const selectUserData = await sqlMain.selectTable(
					'id,account,push_job,push_address,push_type','user',"WHERE push_type = 1",""
					)
					
					selectUserData.forEach((val)=>{
						
						if(val.id == id){
							return
						}
						
						if(val.push_type == 1){
							
							const contentText = `<div>
								<h4 style="margin:5px 0">${title}</h4>
								<div>
									<span style="font-size:15px;color:rgb(59, 115, 240)">${job_address_name}<span>
									<span style="font-size:15px;color:rgb(59, 115, 240)">${job_type_name}<span>
								 </div>
								<div>${content}<div>
							<div>`
							
							if(val.push_address&&val.push_address.indexOf(job_address.split(',')[1]) > -1 && !val.push_job){
								sendMessage(val.account,contentText,'推送成功',res)
								return
							}
								
							if(!val.push_address && val.push_job&&val.push_job.indexOf(job_type.toString()) > -1){
								sendMessage(val.account,contentText,'推送成功',res)
								return
							}
								
							if(!val.push_address && !val.push_job){
								
								sendMessage(val.account,contentText,'推送成功',res)
								return
							}
							
							if(val.push_address&&val.push_address.indexOf(job_address.split(',')[1]) > -1 && val.push_job&&val.push_job.indexOf(job_type.toString()) > -1){
								sendMessage(val.account,contentText,'推送成功',res)
							}
							
							
						}
					})
					
					
					
					
					
				}  

			}else{
				res.send({
					code: 400,
					message: article_id?"修改失败":"发布成功",
				})
			}
			
		
	}


}
module.exports = articleRelease
