const { Server } = require('socket.io')
const { createServer } = require('http')
const Koa = require('koa')

const connectionMap = {}

const app = new Koa()

// 开启一条额外http线路连接
const httpServer = createServer(app.callback())

const io = new Server(httpServer, {
  cors: {
    origin: '*'
  }
})

const handleActive = (userId, socket) => {
  console.log('userId', userId)
  connectionMap[userId] = socket
  socket.emit(200, '接入绑定成功')
}

const handleDisActive = (userId, socket) => {
  delete connectionMap[userId]
  socket.emit(200, '接触绑定成功')
}

io.on('connection', socket => {
  socket.on('active', msg => handleActive(msg, socket))
})

httpServer.listen(3001)
