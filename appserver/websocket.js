const app = require('express')() //引入express
const socketServer = require('http').Server(app) //websocket服务器
const io = require('socket.io')(socketServer) //使用socket.io
var mongoose = require('mongoose') //數據庫鏈接
var model = require('./schemas/allModel') //數據庫模型

mongoose.connect('mongodb://localhost:27017/zzz') //mongodb监听地址和数据库
const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => {
    console.log('connect to database: zzz')
})

//开启服务器并监听9000
socketServer.listen(9000, () => {
    console.log('websocket is on')
})

//websocket监听事件
io.on('connection', (socket) => {
    socket.on('add orders', (data) => {
        console.log('xixi')
        model.orders.find({}, (err, order) => {
            if (err) {
                return console.log(err)
            }
            console.log(order)
            io.emit('update', { 'data': order })
        })
    })
})