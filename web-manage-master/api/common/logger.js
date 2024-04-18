// 日志的封装
// 写入文件中 file-stream-rotator所有日志
var express = require('express');
var logger = require('morgan');
var fs = require('fs');
var moment = require('moment');
var sendMessage = require('./sendMessage.js')
var fileStreamRotato = require('file-stream-rotator')
var app = express()
var accessLogStream = fileStreamRotato.getStream({
  filename: './log/access-%DATE%.log',
  frequency: 'daily',
  verbose: false,
  date_format: 'YYYYMMDD'
})
process.on("uncaughtException", (error) => {
	fs.readFile('./log/access-err-'+moment().format('YYYYMMDD')+'.log', 'utf8', function (e, data) {
		if (e) throw e;
	    data = data +'\n'+ error.stack
		fs.writeFile('./log/access-err-'+moment().format('YYYYMMDD')+'.log', data, (err) => {
		  if (err) throw err;
		  sendMessage('lvjl@chuzhi.cn',`<div>${error.stack}</div>`)
		  console.log('File has been saved!');
		});
	})
});
// 格式化日志输出格式  由于代码重复，对输出格式进行封装
function formatLog(tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    decodeURI(tokens.url(req, res)), // 获取get参数
    JSON.stringify(req.body),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms'
  ].join(' ')
}

const accessLog = (logger(function (tokens, req, res) {
  return formatLog(tokens, req, res)
}, {stream: accessLogStream}));
// 写入文件中 file-stream-rotator 错误日志
var accessLogStreamErr = fileStreamRotato.getStream({
  filename: './log/access-err-%DATE%.log',
  frequency: 'daily',
  verbose: false,
  date_format: 'YYYYMMDD'
})
const accessLogErr = (logger(function (tokens, req, res) {
  return formatLog(tokens, req, res)
}, {
  stream: accessLogStreamErr,
  skip: function (req, res) {
    return res.statusCode < 400
  }
}));
// 导出代码
module.exports = {accessLog, accessLogErr, logger}
