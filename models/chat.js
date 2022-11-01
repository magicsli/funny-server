const mongoose = require('mongoose')

const Schema = mongoose.Schema

const IChat = {
  from: String, // 发送方
  read_list: [String], // 已读的成员
  type: String, // 消息类型
  content: String, // 消息内容
  chat_id: String, // 消息Id
  room_id: String, // 聊天室Id
  create_time: Number // 消息发送时间
}

// 建立数据模型
const ChatModel = mongoose.model(
  'chat',
  new Schema(IChat, {
    versionKey: false
  })
)

module.exports = ChatModel
