const path = require('path')
const compressing = require("compressing")
const redisClient = require("../../../redis/index.js")();
const {isChina,deleteTempFiles,isFileDirectory,coverDirectory} = require('../../common/useCommon.js')
const updatePackZip = async (params) => {
	let {
		title,
		describe,
		file_id,
		file_source,
		zip_path,
		files,
		req, 
		res, 
		sqlMain, 
		fs, 
		pathModules, 
		selectUser, 
		moment,	
	} = params
	// 更新资源包
	if (zip_path === 'public') {
		if (!files?.files?.filepath) {
			const updateAvatarResult = await sqlMain.updateSql('page_arrange',
				'file_title = ?,file_describe = ?,file_source = ?', 'Id', [title, describe,Number(file_source)?1:0,
					file_id
				])
				console.log()
			res.send({
				code: 200,
				message: "信息修改成功！",
			})
			return
		}
		const selectCollectionData = await sqlMain.selectAnySql(
			'page_arrange','page_arrange.id', file_id,
		)
		
		const dirname = pathModules.resolve(__dirname, '../../../');
		const storePath = pathModules.join(dirname, zip_path);
		const image = pathModules.join(storePath);
		const file = files.files;
		const {
			originalFilename,
			filepath
		} = file
		//判断文件夹是否存在
		if (!fs.existsSync(image)) {
			fs.mkdirSync(image)
		}
		//获取时间戳
		let date = new Date().getTime();
		//产生随机数
		let random = Math.floor(Math.random() * 10000);
		//获取图片的后缀
		let ext = pathModules.extname(originalFilename);
		//图片的名称
		let imageName = selectCollectionData[0].file_zip;
		//图片的读和写
		let read = fs.createReadStream(filepath);

		let write = fs.createWriteStream(pathModules.join(image, imageName));
		const {id,avatar,account} = await selectUser(req, res, sqlMain)
		redisClient.getValue(account, (targetConn) => {
			if (targetConn) {
				read.on('data',(chunk)=>{
					// 计算已上传的字节数
					  const uploadedBytes = read.bytesRead;
					  // 计算总字节数
					  const totalBytes = read.path ? fs.statSync(read.path).size : null;
					  // 计算上传进度
					  const progress = totalBytes ? (uploadedBytes / totalBytes) * 100 : 0;
					  console.log(`下载进度：${progress.toFixed(2)}%`);
					  targetConn.sendText(JSON.stringify({
					  	from: 'servier',
					  	infoType: 'progress',
					  	to: account,
						progress:`文件解压进度：${progress.toFixed(2)}%`,
					  	createTime: moment().format()
					  }))
				})
				read.on('end', async (err, result) => {
					targetConn.sendText(JSON.stringify({
						from: 'servier',
						infoType: 'progress',
						to: account,
						progress:`解压成功，文件验证中...`,
						createTime: moment().format()
					}))
					// 先解压到临时目录
					const tempDir = './temp';
					if (!fs.existsSync(tempDir)) {
						fs.mkdirSync(tempDir);
					}
					let nowFilePath = pathModules.join(image,imageName) //当前目录下解压的文件名
					// 判断是否是文件夹
					let filesList = await isFileDirectory(image,nowFilePath,tempDir,res)
					if(filesList){
						const selectEmail = await sqlMain.selectTable('dir,user_id','page_arrange','where page_arrange.dir = "' +filesList[0] + '"')
						if (selectEmail && selectEmail.length > 0 && selectEmail[0].user_id === id) {
							targetConn.sendText(JSON.stringify({
								from: 'servier',
								infoType: 'progress',
								to: account,
								progress:`文件验证通过，正在解析中...`,
								createTime: moment().format()
							}))
							let cover_directory = await coverDirectory(nowFilePath,res,pathModules,image)
							const updateAvatarResult = await sqlMain.updateSql('page_arrange',
								'file_title = ?,file_describe = ?,file_source = ?', 'Id', [title, describe,Number(file_source)?1:0,
									file_id
								])
								console.log()
							res.send({
								code: 200,
								message: "信息修改成功！",
							})
						} else {
							deleteTempFiles(nowFilePath)
							res.json({
								code: 400,
								message: "压缩包里文件夹名称和原名称不一致",
							})
						}
					}else{
						deleteTempFiles(nowFilePath)
					}
					// 删除临时文件夹
					deleteTempFiles(tempDir)
					
				});
				read.pipe(write);
			}
		})
		
		
	}
}
module.exports = updatePackZip