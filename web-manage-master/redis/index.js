let codeJson = {}


module.exports = function redis(){
	
	const setValue = function(key,value){
		codeJson[key] = value
	}
	
	const getValue = function(key,callback){
		
		callback(codeJson[key])
	}
	
	const removeValue = function(key){
		delete codeJson[key];
	}
	const clearValue = function(key){
		codeJson = {}
	}
	return {
		setValue,
		getValue,
		removeValue,
		clearValue
	}
}
// redisClient.setValue("111",'2324')
	
// redisClient.getValue("111",(res)=>{
// 	console.log(res)
// })