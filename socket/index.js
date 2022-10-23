const { Server } = require('socket.io')
const { createServer } = require('http')
const Koa = require('koa')
// const handleChatSocket = require('./chat')

const app = new Koa()

// 开启一条额外http线路连接
const httpServer = createServer(app.callback())

const io = new Server(httpServer, {
  cors: {
    origin: '*'
  }
})

io.on('connection', () => {
  const ChatIo = io.of('/chat')
  // ChatIo.on('connection', socket => handleChatSocket(socket, ChatIo))
})

httpServer.listen(3001)
