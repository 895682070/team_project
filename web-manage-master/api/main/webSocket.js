var ws = require("nodejs-websocket")
var userEmail = null
const webSocket = (redisClient, moment, sqlMain) => {
	let webServer = ws.createServer(function(conn) {
		userEmail = conn.path.split('=')[1]
		console.log(userEmail)
		redisClient.getValue(userEmail, (targetConn) => {
			if (targetConn) {
				targetConn.sendText(JSON.stringify({
					from: 'servier',
					infoType: 'topOff',
					to: userEmail,
					createTime: moment().format()
				}))
				redisClient.removeValue(userEmail)
				targetConn = null
			}
			
			if (!targetConn) {
				setTimeout(() => {
					redisClient.setValue(userEmail, conn)
					sqlMain.updateSql('user', 'is_line = ?', 'account', [1,
						userEmail
					])
					sqlMain.updateSql('user', 'last_time = ?', 'account', [
						moment().format('YYYY-MM-DD HH:mm:ss'),
						userEmail
					])
					webServer.connections.forEach((c) => {
						let s = c.path.split('=')[1]
						c.sendText(JSON.stringify({
							from: 'servier',
							infoType: 'newLine',
							to: s,
							user: userEmail,
							type: 1,
							createTime: moment().format()
						}))
					})
				}, 1000)
			}
			
		})
		// 房间管理
		const roomMain = {
			creatUpdateRoom: (info) => {
				// 创建房间
				if (info.roomId) {
					redisClient.getValue(info.roomId, async (message) => {
						if (message) {
							if (info.infoType === 'invite') {
								return
							}
							if (info.infoType === 'leave') {
								if (!info.isStartGame) {
									message.forEach((v, i) => {
										if (v.from === (info.lost_user ? info
												.lost_user.user : info.from)) {
											if (message.length === 3) {
												message[i] = 0
											} else {
												message.splice(i, 1)
											}

										}
									})
									if ((info.lost_user ? info.lost_user.user : info
											.from) === info.isHomeowner) {
										message.forEach((v, i) => {
											v.isHomeowner = message[0] ?
												message[0].from : message[1]
												.from
										})
									}
								} else {
									message.forEach((v, i) => {
										if (v.from === (info.lost_user ? info
												.lost_user.user : info.from)) {
											v.isLine = 0
										}
									})
								}

							} else if (info.infoType === 'end') {
								redisClient.removeValue(info.roomId)
							} else {
								let result = message.find((r) => r.from === info.from)
								if (!result) {
									let userResult = await sqlMain.selectTable('*',
										'user', 'WHERE account = ' + '"' + info
										.from + '"', '')
									info.user_info = userResult[0]
									if (message.length === 3) {
										message.forEach((r, i) => {
											if (!r) {
												message[i] = info
											}
										})
									} else {
										message.push(info)
									}

								}

							}
							if (info.infoType === 'end') {
								webServer.connections.forEach((c) => {
									let s = c.path.split('=')[1]
									c.sendText(JSON.stringify({
										from: 'servier',
										infoType: 'updateUser',
										to: s,
										userMessage: [],
										type: 2,
										roomId: info.roomId,
										createTime: moment()
										.format()
									}))
								})
							} else {
								redisClient.setValue(info.roomId, message)
								webServer.connections.forEach((c) => {
									let s = c.path.split('=')[1]
									c.sendText(JSON.stringify({
										from: 'servier',
										infoType: 'updateUser',
										to: s,
										userMessage: message,
										isStartGame: info
											.isStartGame,
										type: 2,
										roomId: info.roomId,
										createTime: moment()
										.format()
									}))
								})
								if (message.length <= 1) {
									redisClient.removeValue(info.roomId)
								}
							}

						} else {
							let userResult = await sqlMain.selectTable('*', 'user',
								'WHERE account = ' + '"' + info.from + '"', '')
							info.user_info = userResult[0]
							redisClient.setValue(info.roomId, [info])
						}
					})
				}
			},
			startGame: (info) => {
				redisClient.getValue(info.roomId, async (message) => {
					if (message) {
						let sliceResult = null
						message.forEach((v, i) => {
							sliceResult = Object.assign([], info.cardsArray
								?.sliceResult[i])
							if (info?.outCardsArray?.length > 0 && v.from ===
								info.to) {
								let c = Object.assign([], info?.outCardsArray)
								let deleteCards = c.pop().isCards
								let sliceResultCopy = Object.assign([],
									sliceResult)
								console.log('deleteCards', deleteCards)
								if (deleteCards) {
									deleteCards.forEach((k) => {
										sliceResult.forEach((m, n) => {
											if (m === k) {
												sliceResult
													.splice(n,
														1)
											}
										})
									})
								}
								console.log('sliceResult2', sliceResult)
								message[i].cards = sliceResult
								info.cardsArray.sliceResult[i] = sliceResult
							} else {
								if (info.robbingSelect === v.from) {
									v.cards = sliceResult
									v.cards = v.cards.concat(info.cardsArray
										?.sliceResult[3])
									info.cardsArray.sliceResult[i] = v.cards
									info.cardsArray.sliceResult[3] = []
								} else {
									v.cards = sliceResult
								}

							}

						})
						if (info.isStartGame === 1) {
							webServer.connections.forEach((c) => {
								let s = c.path.split('=')[1]
								c.sendText(JSON.stringify({
									from: 'servier',
									infoType: 'startGame',
									to: s,
									userMessage: message,
									type: 2,
									roomId: info.roomId,
									isHomeowner: info.isHomeowner,
									alarmUser: info.alarmUser,
									isRobbingArray: info
										.isRobbingArray,
									isStartGame: info.isStartGame,
									cardsArray: info.cardsArray,
									labdlordCardsArray: info
										.cardsArray?.sliceResult[3],
									userMessage: message,
									createTime: moment().format()
								}))
							})
						} else if (info.isStartGame === 2) {
							webServer.connections.forEach((c) => {
								let s = c.path.split('=')[1]
								c.sendText(JSON.stringify({
									from: 'servier',
									infoType: info.infoType,
									to: s,
									userMessage: message,
									type: 2,
									roomId: info.roomId,
									isHomeowner: info.isHomeowner,
									alarmUser: info.alarmUser,
									robbingSelect: info
										.robbingSelect,
									isStartGame: info.isStartGame,
									cardsArray: info.cardsArray,
									outCardsArray: info
										.outCardsArray,
									labdlordCardsArray: info
										.cardsArray?.sliceResult[3],
									createTime: moment().format()
								}))
							})
						}

					}
				})
			},
			gameOver: (info) => {
				webServer.connections.forEach((c) => {
					let s = c.path.split('=')[1]
					c.sendText(JSON.stringify({
						from: 'servier',
						infoType: info.infoType,
						to: s,
						userMessage: info.message,
						type: 2,
						roomId: info.roomId,
						isHomeowner: info.isHomeowner,
						alarmUser: info.alarmUser,
						robbingSelect: info.robbingSelect,
						isStartGame: info.isStartGame,
						cardsArray: info.cardsArray,
						outCardsArray: info.outCardsArray,
						win: info.win,
						createTime: moment().format()
					}))
				})
			}
		}

		conn.on("text", function(str) {
			let info = JSON.parse(str)
			let self = this.path.split('=')[1]
			redisClient.getValue(info.to, async (sendConn) => {
				if (sendConn) {
					if (info.infoType == 'agree') {
						if (!info.gameName) {
							sqlMain.updateSql('user', 'is_line = ?', 'account', [2, info
								.to
							])
							sqlMain.updateSql('user', 'is_line = ?', 'account', [2, info
								.from
							])
						}
						webServer.connections.forEach((c) => {
							let s = c.path.split('=')[1]
							c.sendText(JSON.stringify({
								from: 'servier',
								infoType: 'game',
								to: s,
								user: [info.to, info.from],
								type: 2,
								createTime: moment().format()
							}))
							c.sendText(str)
						})
						// 斗地主
						roomMain.creatUpdateRoom(info)

					} else if (info.infoType == 'leave' || info.infoType == 'end') {
						sqlMain.updateSql('user', 'is_line = ?', 'account', [1, info
							.to])
						sqlMain.updateSql('user', 'is_line = ?', 'account', [1, info
							.from
						])
						webServer.connections.forEach((c) => {
							let s = c.path.split('=')[1]
							c.sendText(JSON.stringify({
								from: 'servier',
								infoType: 'game',
								to: s,
								user: [info.to, info.from],
								type: 1,
								createTime: moment().format()
							}))
							c.sendText(str)
						})
						// 斗地主
						roomMain.creatUpdateRoom(info)
					} else if (info.infoType == 'invite') {
						let result = await sqlMain.selectAnySql('user', 'account', info
							.to)
						if (result[0].is_line == 2) {
							conn.sendText(JSON.stringify({
								from: 'servier',
								infoType: 'playing',
								to: self,
								type: 2,
								user: info.to,
								createTime: moment().format()
							}))
						} else {
							// 斗地主
							roomMain.creatUpdateRoom(info)
							sendConn.sendText(str)
						}

					} else if (info.infoType == 'updateStatus') {
						sqlMain.updateSql('user', 'is_line = ?', 'account', [1, info
							.from
						])

					} else if (info.infoType == 'machineLeave' || info.infoType ==
						'machineStart') {
						sqlMain.updateSql('user', 'is_line = ?', 'account', [info
							.infoType === 'machineStart' ? 2 : 1, info.from
						])
					} else if (info.infoType === 'startGame' || info.infoType ===
						'startCardsGame') {
						roomMain.startGame(info)
					} else if (info.infoType === 'gameOver') {
						roomMain.gameOver(info)
					} else if (info.infoType === 'updateScore') {
						info.sendUserData.forEach((v) => {
							sqlMain.updateSql('user', 'landlord_pulse = ?',
								'account', [v.score, v.account])
						})
					} else if (info.infoType === 'gameMessage') {
						webServer.connections.forEach((c) => {
							let s = c.path.split('=')[1]
							c.sendText(JSON.stringify({
								from: 'servier',
								infoType: 'gameMessage',
								to: s,
								roomId: info.roomId,
								content: info.content,
								createTime: moment().format()
							}))
						})
					} else {
						sendConn.sendText(str)
					}
				} else {
					conn.sendText(JSON.stringify({
						from: 'servier',
						infoType: 'lost',
						to: self,
						lostUser: info.to,
						createTime: moment().format()
					}))
				}
			})
		})
		conn.on("close", function(code, reason) {

			let deleteUser = this.path.split('=')[1]
			redisClient.removeValue(deleteUser)
			sqlMain.updateSql('user', 'is_line = ?', 'account', [0, deleteUser])
			webServer.connections.forEach((c) => {
				let s = c.path.split('=')[1]
				c.sendText(JSON.stringify({
					from: 'servier',
					infoType: 'newLine',
					to: s,
					user: deleteUser,
					type: 0, //0:掉线
					createTime: moment().format()
				}))
			})
		})
		conn.on("error", function(err) {
			console.log("handle err");

		})

	})

	webServer.on('close', (res) => {
		console.log('关闭了', res)
	})
	webServer.on('error', (res) => {
		console.log('报错了', res)
	})
	webServer.on('listening', (res) => {
		console.log('启动了', res)
	})
	webServer.listen(9003, function() {
		console.log('我的webServer服务启动了')
	})

}
module.exports = webSocket
