const path = require('path')
const updateDeleteZip = require('./children/updateDeleteZip.js')
const updatePackZip = require('./children/updatePackZip.js')
const updateAddZip = require('./children/updateAddZip.js')
const updateSeachZip = require('./children/updateSeachZip.js')
const updateZip = async (req, res, sqlMain, formidable, fs, pathModules, baseUrl, selectUser, moment) => {
	res.status(200)
	// path:文件夹路径
	// file：file文件
	// zip_path:路径参数
	// avatar 头像 articles文章图片
	if (req.method === 'GET') {
		updateSeachZip(req, res, sqlMain,baseUrl,selectUser)
	} else {
		const {
			zip_path,
		} = req.params
		const form = new formidable.IncomingForm();
		// 新增
		form.parse(req, async (err, fields, files) => {
			const {title,describe,file_id,delete_id,file_source} = fields
			let params = {
				title,
				describe,
				file_id,
				delete_id,
				file_source,
				zip_path,
				files,
				req, 
				res, 
				sqlMain, 
				formidable, 
				fs, 
				pathModules, 
				baseUrl, 
				selectUser, 
				moment,	
			}
			// 修改基本信息
			if (delete_id) {
				updateDeleteZip(params)
				return
			}
			
			
			// 文件，基本信息更新
			if (file_id) {
				updatePackZip(params)
				return
			}
			if (err) {
				res.json({
					code: 400,
					message: "文件上传失败",
				})
				return;
			}
			if (!files?.files?.filepath) {
				res.json({
					code: 400,
					message: "文件不能为空",
				})
				return
			} 
			// 文件添加
			updateAddZip(params)
		})

	}
}
module.exports = updateZip
