const isAuthorization = require("./isAuthorization.js")
const selectUser = async (req,res,sqlMain)=>{
	
	const { authorization } = req.headers
	const selectEmail = await sqlMain.selectAuthSql(authorization)
	
	const is_Authorization = await isAuthorization(req)
	
	if((!selectEmail || selectEmail.length === 0) && is_Authorization){
		res.send({
			code: 401,
			message: "您还未登录，请重新登录后再操作！",
		})
		return;
	};
	
	return selectEmail&&selectEmail[0]?selectEmail[0]:{}
	
}
module.exports = selectUser