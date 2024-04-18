const path = require('path')
const {deleteTempFiles} = require('../../common/useCommon.js')
const updateDeleteZip = async (params) => {
	let {
		file_id,
		delete_id,
		zip_path,
		req, 
		res, 
		sqlMain, 
		fs, 
		pathModules, 
	} = params
	const selectCollectionData = await sqlMain.selectAnySql(
		'page_arrange','page_arrange.id', file_id,
	)
	const dirname = pathModules.resolve(__dirname, '../../../');
	const storePath = pathModules.join(dirname, zip_path);
	const image = pathModules.join(storePath);
	function deleteFolderRecursive(folderPath) {
	  //判断文件夹是否存在
	  if (fs.existsSync(folderPath)) {
	    //读取文件夹下的文件目录，以数组形式输出
	    fs.readdirSync(folderPath).forEach((file) => {
	      //拼接路径
	      const curPath = path.join(folderPath, file);
	      //判断是不是文件夹，如果是，继续递归
	      if (fs.lstatSync(curPath).isDirectory()) {
	        deleteFolderRecursive(curPath);
	      } else {
	        //删除文件或文件夹
	        fs.unlinkSync(curPath);
	      }
	    });
	    //仅可用于删除空目录
	    fs.rmdirSync(folderPath);
	  }
	}
	deleteFolderRecursive(pathModules.join(image,selectCollectionData[0].dir)) //需要解压到
	deleteTempFiles(pathModules.join(image,selectCollectionData[0].file_zip))
	const deleteDataSql = await sqlMain.deleteSql(
		'page_arrange','id', delete_id,
	)
	res.json({
		code: 200,
		message: "删除成功",
	})
}
module.exports = updateDeleteZip
