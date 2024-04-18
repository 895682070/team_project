const path = require('path')
const {isChina,deleteTempFiles} = require('../../common/useCommon.js')
const updateSeachZip = async (req,res,sqlMain,baseUrl,selectUser) => {
	const { id } = await selectUser(req, res, sqlMain)
	const selectCollectionData = await sqlMain.selectJoinSql(
		'page_arrange.id,page_arrange.file_zip,page_arrange.file_source,page_arrange.file_title,page_arrange.file_describe,page_arrange.dir,page_arrange.create_time,page_arrange.file,user.avatar,user.nickName',
		'user', "page_arrange",
		"page_arrange.user_id", "user.id",
		"page_arrange.user_id = " + id, "order by page_arrange.id desc", ""
	)
	console.log(2222,selectCollectionData)
	selectCollectionData.map((res)=>{
		res.file_zip_url = baseUrl+'public/'+res.file_zip
		res.avatar = baseUrl+'avatar/'+res.avatar
		res.page_url = baseUrl+'public/'+res.dir
	})
	console.log(2222,selectCollectionData)
	res.json({
		code: 200,
		data: {
			arrange_list: selectCollectionData
		},
		message: "",
	})
}
module.exports = updateSeachZip