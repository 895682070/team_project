
var express = require("express");
var bodyParser = require('body-parser');
var cors = require('cors');
const logger = require('./common/logger.js')
var app = express()
const fs = require('fs')
const path = require('path')
const redisClient = require("../redis/index.js")();
const authorization = require("../jwt/index.js");
const verification = require("./main/verification.js")
const sqlMain = require("./common/sql.js")
const formidable = require('formidable')
const moment = require('moment')
const selectUser = require("./common/selectUser.js")
const isAuthorization = require("./common/isAuthorization.js")
const register = require("./main/register.js")
const login = require("./main/login.js")
const logout = require("./main/logout.js")
const alterPassword = require("./main/alterPassword.js")
const forgetPassword = require("./main/forgetPassword.js")
const updateImage = require("./main/updateImage.js")
const articleRelease = require("./main/articleRelease.js")
const articleList = require("./main/articleList.js")
const articleDetails = require("./main/articleDetails.js")
const myRelease = require("./main/myRelease.js")
const collection = require("./main/collection.js")
const myCollection = require("./main/myCollection.js")
const personal = require("./main/personal.js")
const pushSet = require("./main/pushSet.js")
const comments = require("./main/comments.js")
const myComments = require("./main/myComments.js")
const newList = require("./main/newList.js")
const personalList = require("./main/personalList.js")
const reviseUserPermissions = require("./main/reviseUserPermissions.js")
const articleManageList = require("./main/articleManageList.js")
const reviewArticle = require("./main/reviewArticle.js")
const secondaryComments = require("./main/secondaryComments.js")
const interpolateList = require("./main/interpolateList.js")
const gameList = require("./main/gameList.js")
const sourceList = require("./main/sourceList.js")
const jobType = require("./main/jobtype.js")
const addQuestionType = require("./main/addQuestionType.js")
const addQuestion = require("./main/addQuestion.js")
const alterQuestion = require("./main/alterQuestion.js")
const deleteQuestion = require("./main/deleteQuestion.js")
const questionList = require("./main/questionList.js")
const questionTypeList = require("./main/questionTypeList.js")
const addQuestionColletion = require("./main/addQuestionColletion.js")
const questionColletionList = require("./main/questionColletionList.js")
const deleteQuestionColletion = require("./main/deleteQuestionColletion.js")
const getOtherinfo = require("./main/getOtherinfo.js")
const setUserMoney = require("./main/setUserMoney.js")
const gameRecord = require("./main/gameRecord.js")
const gameTotalRecord = require("./main/gameTotalRecord.js")
const alterScore = require("./main/alterScore.js")
const seachGameRoom = require("./main/seachGameRoom.js")
const exStatic = require("express-static");
const webSocket = require("./main/webSocket.js")
const updateZip = require("./main/updateZip.js")
const md5 = require("md5")

// 音视频通话
const http = require('http').Server(app)
const io = require('socket.io')(http);
const ioConnect = require("./main/ioConnect.js")

module.exports = function useApp(){
	const baseUrl = 'http://101.43.228.243:9001/'
	webSocket(redisClient,moment,sqlMain)
	ioConnect(io,redisClient)
	app.all('*',async function(req,res,next){
		res.header("Access-Control-Allow-Origin","*");
		res.header("Access-Control-Allow-Headers","X-Requested-With");
		res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
		res.header("X-Powered-By","3.2.1");
		res.header("Content-Type","application/json;charset=utf-8");
		// 读取图片
		if(req.url.indexOf('avatar/') > -1 || req.url.indexOf('articles/') > -1){
			res.setHeader("Content-Type","image/jpeg")
			fs.readFile(path.join(__dirname, req.url),'binary',function(err,file){
				if(err){
					
					res.end();
					return;
				}else{
					res.write(file,'binary');
					res.end();
				}
			});
			return;	
		}
		const is_authorization = await isAuthorization(req)
		if(is_authorization){
			const {authorization:token} = req.headers
			let result
			try{
				result = authorization.validationToken(token)
			}catch(e){
				//TODO handle the exception
			}
			if(!result){
				res.send({
					code: 401,
					message: "您还未登录，请重新登录后再操作！",
				})
				return
			}
		}
		
		next();
		
	})
	
	app.use(logger.accessLog)
	app.use(logger.accessLogErr)
	app.use(logger.logger('dev'))
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({extended: true}));
	app.use(cors());
	// 获取验证码
	app.post("/api/verificationCode/",function(req,res){
		verification(req,res,redisClient,sqlMain)
	})
	// 注册
	app.post("/api/register/",function(req,res){
		register(req,res,redisClient,sqlMain,moment,md5)
	})
	// 登录
	app.post("/api/login/",function(req,res){
		login(req,res,authorization,sqlMain,md5,baseUrl)
	})
	// 退出登录
	app.post("/api/logout/",function(req,res){
		logout(req,res,authorization,sqlMain,selectUser)
	})
	// 修改密码
	app.post("/api/alterPassword/",function(req,res){
		alterPassword(req,res,sqlMain,selectUser,md5)
	})
	// 忘记密码
	app.post("/api/forgetPassword/",function(req,res){
		forgetPassword(req,res,authorization,sqlMain,redisClient,md5)
	})
	// 我的发布
	app.get("/api/myRelease/",function(req,res){
		myRelease(req,res,sqlMain,moment,baseUrl,selectUser)
	})
	// 删除我的发布
	app.post("/api/deleteMyRelease/:id",function(req,res){
		myRelease(req,res,sqlMain,moment,baseUrl,selectUser)
	})
	// 获取给我的评论
	app.get("/api/myComments/",function(req,res){
		myComments(req,res,sqlMain,moment,baseUrl,selectUser)
	})
	// 收藏与取消收藏
	app.post("/api/collection/:id",function(req,res){
		collection(req,res,sqlMain,moment,baseUrl,selectUser)
	})
	// 我的收藏
	app.get("/api/myCollection/",function(req,res){
		myCollection(req,res,sqlMain,moment,baseUrl,selectUser)
	})
	// 获取个人信息
	app.get("/api/personal/",function(req,res){
		personal(req,res,sqlMain,baseUrl,selectUser)
	})
	// 获取其他人信息
	app.post("/api/getOtherinfo/",function(req,res){
		getOtherinfo(req,res,sqlMain,baseUrl,selectUser)
	})
	// 获取并且修改金币
	app.post("/api/setUserMoney/",function(req,res){
		setUserMoney(req,res,sqlMain,baseUrl,selectUser)
	})
	// 修改个人信息
	app.post("/api/personal/",function(req,res){
		personal(req,res,sqlMain,baseUrl,selectUser)
	})
	// 修改用户分数
	app.post("/api/alterScore/",function(req,res){
		alterScore(req,res,sqlMain,baseUrl,selectUser)
	})
	// 上传图片
	app.post("/api/updateImage/:img_path",function(req,res){
		updateImage(req,res,sqlMain,formidable,fs,path,baseUrl,selectUser)
	})
	// 上传文件
	app.post("/api/updateZip/:zip_path",function(req,res){
		updateZip(req,res,sqlMain,formidable,fs,path,baseUrl,selectUser,moment)
	})
	app.get("/api/updateZip/",function(req,res){
		updateZip(req,res,sqlMain,formidable,fs,path,baseUrl,selectUser,moment)
	})
	// 文章发布
	app.post("/api/articleRelease/",function(req,res){
		articleRelease(req,res,sqlMain,moment,selectUser,path,fs)
	})
	// 文章列表
	app.post("/api/articleList/:page",function(req,res){
		articleList(req,res,sqlMain,moment,baseUrl)
	})
	// 文章详情
	app.get("/api/articleDetails/:id",function(req,res){
		articleDetails(req,res,sqlMain,moment,baseUrl,selectUser)
	})
	// 获取评论
	app.get("/api/comments/:id",function(req,res){
		comments(req,res,sqlMain,moment,baseUrl,selectUser)
	})
	// 发表评论
	app.post("/api/comments/:id",function(req,res){
		comments(req,res,sqlMain,moment,baseUrl,selectUser)
	})
	// 删除评论
	app.post("/api/deleteComments/:id",function(req,res){
		comments(req,res,sqlMain,moment,baseUrl,selectUser)
	})
	// 新闻/公告列表
	app.post("/api/newList/:page",function(req,res){
		newList(req,res,sqlMain,moment,baseUrl)
	})
	// 发表二级评论
	app.post("/api/secondaryComments/:id",function(req,res){
		secondaryComments(req,res,sqlMain,moment,baseUrl,selectUser)
	})
	// 内推列表
	app.post("/api/interpolateList/:page",function(req,res){
		interpolateList(req,res,sqlMain,moment,baseUrl)
	})
	// 游戏列表
	app.post("/api/gameList/:page",function(req,res){
		gameList(req,res,sqlMain,moment,baseUrl)
	})
	// 开源列表
	app.post("/api/sourceList/:page",function(req,res){
		sourceList(req,res,sqlMain,moment,baseUrl)
	})
	// 保存游戏记录
	app.post("/api/gameRecord/",function(req,res){
		gameRecord(req,res,sqlMain,moment,selectUser,baseUrl)
	})
	// 获取对应类型分数
	app.post("/api/gameTotalRecord/",function(req,res){
		gameTotalRecord(req,res,sqlMain,moment,selectUser,baseUrl)
	})
	// 获取游戏记录
	app.get("/api/gameRecord/",function(req,res){
		gameRecord(req,res,sqlMain,moment,selectUser,baseUrl)
	})
	// 查询游戏房间详情
	app.post("/api/seachGameRoom/",function(req,res){
		seachGameRoom(req,res,sqlMain,redisClient)
	})
	// 推送消息设置
	app.post("/api/pushSet/",function(req,res){
		pushSet(req,res,sqlMain,baseUrl,selectUser)
	})
	//添加职位
	app.post("/api/jobType/",function(req,res){
		jobType(req,res,sqlMain,moment,baseUrl)
	})
	// 获取职位基本数据
	app.get("/api/jobType/",function(req,res){
		jobType(req,res,sqlMain,moment,baseUrl)
	})
	// 管理
	// 人员列表
	app.post("/api/personalList/:page",function(req,res){
		personalList(req,res,sqlMain,moment,baseUrl)
	})
	// 修改人员权限
	app.post("/api/reviseUserPermissions/",function(req,res){
		reviseUserPermissions(req,res,sqlMain,baseUrl,selectUser)
	})
	// 管理文章列表
	app.post("/api/articleManageList/:page",function(req,res){
		articleManageList(req,res,sqlMain,moment,baseUrl)
	})
	// 审核文章
	app.post("/api/reviewArticle/",function(req,res){
		reviewArticle(req,res,sqlMain,baseUrl,selectUser)
	})
	// 添加面试类型
	app.post("/api/addQuestionType/",function(req,res){
		addQuestionType(req,res,sqlMain,moment)
	})
	// 面试类型查询
	app.get("/api/questionTypeList/",function(req,res){
		questionTypeList(req,res,sqlMain,moment)
	})
	// 添加面试题
	app.post("/api/addQuestion/",function(req,res){
		addQuestion(req,res,sqlMain,moment,selectUser)
	})
	// 编辑面试题
	app.post("/api/alterQuestion/",function(req,res){
		alterQuestion(req,res,sqlMain,moment)
	})
	// 删除面试题
	app.post("/api/deleteQuestion/",function(req,res){
		deleteQuestion(req,res,sqlMain,moment)
	})
	// 查询面试题
	app.post("/api/questionList/:page",function(req,res){
		questionList(req,res,sqlMain,moment,baseUrl)
	})
	// 面试题收藏
	app.post("/api/addQuestionColletion/",function(req,res){
		addQuestionColletion(req,res,sqlMain,moment,selectUser)
	})
	// 查询历史收藏
	app.get("/api/questionColletionList/",function(req,res){
		questionColletionList(req,res,sqlMain,moment,selectUser,baseUrl)
	})
	// 删除面试题
	app.post("/api/deleteQuestionColletion/",function(req,res){
		deleteQuestionColletion(req,res,sqlMain,moment)
	})
	app.use(function(error, req, res, next) {
	   console.log("Display error : ", error);
	   res.end("Oups !", 500);
	});
	app.use(exStatic('./'));
	app.use(express.static(path.join(__dirname, 'public')));
	return app
}
// 判断环境是否写入日志,暂时不用
// if (process.env.NODE_ENV === 'development'){
//   // 开发环境打印日志不保存
//   app.use(logger.logger('dev'))
// }else {
//   // 生产环境
//   app.use(logger.accessLog)
//   app.use(logger.accessLogErr)
// }