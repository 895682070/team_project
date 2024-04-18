const articleDetails = async (req,res,sqlMain,moment,baseUrl,selectUser) => {
	res.status(200)
	// id:文章id
	
	const {id} = req.params
	const {id:user_id,nickName} = await selectUser(req,res,sqlMain)
	let selectCollectionData
	if(user_id){
		selectCollectionData = await sqlMain.selectJoinSql(
		'community.id','(user,community)',"collection",
		"collection.user_id","user.id",
		"collection.community_id = community.id  AND user.id = " + user_id,"",""
		)
		if(!selectCollectionData){
			res.send({
				code: 400,
				data:null,
				message: "",
			})
			return
		}
	}
	// 根据id查询
	const selectCommunityData = await sqlMain.selectJoinSql(
	'community.id,community.user_id,public_status,job_address_name,job_type_name,job_address,job_type,article_type,delete_status,nickName,avatar,title,content,image_path,community.create_time,priview_address,code_address,star_status,access_count','user',"community",
	"community.user_id","user.id",
	"community.id = "+id,"",""
	)
	
	if(!selectCommunityData || (selectCommunityData[0].public_status === 0 && selectCommunityData[0].user_id !== user_id)){
		res.send({
			code: 400,
			data:null,
			message: "文章未找到或被删除！",
		})
		return
	}
	// 计算访问量
	let count = selectCommunityData[0].access_count
	let updateAccessCountData = ""
		if(nickName!=selectCommunityData[0].nickName&&selectCommunityData[0].nickName){
			count = count + 1
			updateAccessCountData = await sqlMain.updateSql('community','access_count = ?','Id',[count,id])
		}
		
	
	if(selectCommunityData[0].delete_status === '0'){
		res.send({
			code: 400,
			data:null,
			message: "该文章已被作者删除",
		})
		return
	}
	delete selectCommunityData[0]['delete_status'];
	selectCommunityData.forEach(async(res)=>{
		res.create_time = moment(res.create_time).format("YYYY-MM-DD HH:mm:ss")
		res.avatar = res.avatar?baseUrl+'avatar/'+res.avatar:''
		res.image_name = res.image_path
		res.image_path = res.image_path?baseUrl+'articles/'+res.image_path:''
		res.access_count = count
		if(selectCollectionData){
			selectCollectionData.forEach((list)=>{
				if(res.id === list.id){
					res.star_status = 1
				}else{
					res.star_status = 0
				}
			})
		}
		
	})
	res.send({
		code: 200,
		data:{
			acticleDetail:selectCommunityData
		},
		message: "",
	})
}
module.exports = articleDetails
