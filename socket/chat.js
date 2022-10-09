let Io = null

const chatHandler = {
  socket: null,
  /**
   *
   * @param {unkow} value socket返回值
   */
  handleSend() {
    console.log('xcxxxxxxxxxxx')
    Io?.emit('send', '你发尼玛呢？')
  }
}

const handleChatSocket = (socket, chatIo) => {
  socket = socket
  Io = chatIo
  socket.on('send', chatHandler.handleSend)
}

module.exports = handleChatSocket
