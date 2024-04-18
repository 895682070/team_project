// 是否鉴权
function isAuthorizationMain(req,url){
	if(url=='/'){
		return true
	}
	if(req.method === 'GET'&&req.url.indexOf('comments') > -1){
		return false
	}else if(req.method === 'POST'&&req.url.indexOf('comments') > -1){
		return true
	}
	return (req.url.indexOf(url)==-1?true:false)
}
const isAuthorization = async (req)=>{
	let isLogin = (
	isAuthorizationMain(req,'/')&&isAuthorizationMain(req,'favicon.ico')&&isAuthorizationMain(req,'forgetPassword')
	&&isAuthorizationMain(req,'verificationCode')&&isAuthorizationMain(req,'login')&&isAuthorizationMain(req,'register')
	&&isAuthorizationMain(req,'articleList')&&isAuthorizationMain(req,'newList')
	&&isAuthorizationMain(req,'articleDetails')&&isAuthorizationMain(req,'comments')&&isAuthorizationMain(req,'public')
	)
	return isLogin
}
module.exports = isAuthorization