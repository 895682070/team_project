const seachGameRoom = async (req, res, sqlMain,redisClient) => {
	res.status(200)
	// id:房间id
	const {id} = req.body
	if(id){
		redisClient.getValue(id,(message)=>{
			res.send({
				code: 200,
				data:message,
				message: "",
			})
		})
	}
}
module.exports = seachGameRoom
