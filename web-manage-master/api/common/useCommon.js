const fs = require('fs')
const compressing = require("compressing")
const isChina = (str)=>{
	if (/.*[\u4e00-\u9fa5]+.*$/.test(str)) {
		return false;
		//不是中文
	}
	return true;
}
function deleteTempFiles(tempDir) {
	try {
		const stat = fs.lstatSync(tempDir);
		// 判断当前项是否为文件夹
		if (stat.isDirectory()) {
			fs.rmdirSync(tempDir, {
				recursive: true
			});
		}else{
			fs.rmSync(tempDir);
		}
		
		console.log(
			"Temporary directory deleted successfully.");
	} catch (error) {
		console.error("Error deleting temporary directory.",
			error);
	}
}
// 判断是否是文件夹
function isFileDirectory(image,nowFilePath,tempDir,res) {
	return new Promise((resolve,reject)=>{
		console.log(nowFilePath, tempDir)
		compressing.zip.uncompress(nowFilePath, tempDir, {
				zipFileNameEncoding: 'GBK'
			})
			.then(() => {
				const filesList = fs.readdirSync(tempDir)
				let hasFolder = false;
				console.log(hasFolder, filesList[0], filesList.length)
				if (filesList.length > 0) {
					console.log(isChina(filesList[0]))
					if (!isChina(filesList[0])) {
						res.json({
							code: 400,
							message: "压缩文件中文件夹不可以是中文",
						})
						resolve(false)
						return
					}
					const stat = fs.lstatSync(tempDir + '/' + filesList[0]);
					// 判断当前项是否为文件夹
					if (stat.isDirectory()) {
						hasFolder = true;
					}
					if (hasFolder && filesList.length === 1) {
						resolve(filesList)
					} else {
						res.json({
							code: 400,
							message: "压缩文件中不可以是文件，只可以放置一个文件夹",
						})
						resolve(false)
					}
				} else {
					res.json({
						code: 400,
						message: "压缩文件中不可以为空",
					})
					resolve(false)
				}
			})
			.catch(err => {
				console.log(err)
				reject()
			})
	})
	
}
// 如果是文件夹开始下载
function coverDirectory(nowFilePath,res,pathModules,image) {
	return new Promise(async (resolve,reject)=>{
		let positionFilePath = pathModules.join(image) //需要解压到当前目录下的目录名
		compressing.zip.uncompress(nowFilePath,positionFilePath, {
				zipFileNameEncoding: 'GBK'
			})
			.then(() => {
				
				console.log(nowFilePath + "解压完成")
				resolve(true)
			})
			.catch(err => {
				console.log("解压失败：" + err);
				try {
					// 删除旧头像
					fs.unlinkSync(nowFilePath)
				} catch (e) {
					console.log(e)
				}
				reject(false)
			})
	})
}
module.exports = {
	isChina,
	deleteTempFiles,
	isFileDirectory,
	coverDirectory
}