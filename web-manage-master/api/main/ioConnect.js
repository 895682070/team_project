// 音视频通话
const ioConnect = (io,redisClient)=>{
	
	// ================== io 通信 =====================
	// 客户端页面打开时会和服务端建立连接
	io.on('connection', function(socket){
	  console.log('a user connected');
	  socket.emit('me', socket.id);
	  // 当用户输入消息时，服务器接收一个 chat message 事件
	  socket.on('callUser', function(data){
	   io.to(data.userToCall).emit('callUser', {
			 signal: data.signalData,
			 from: data.from,
			 name: data.name,
		});
	  });
	  
    //将数据传递给通信的发起方
	  socket.on('answerCall', function(data){
	   io.to(data.to).emit('callAccepted', data.signal);
	  });
	  // 每个 socket 还会触发一个特殊的 disconnect 事件：
	  socket.on('disconnect', function(){
	    console.log('user disconnected');
	  });
	});
}
module.exports = ioConnect

