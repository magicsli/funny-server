const mongoose = require('mongoose')

const Schema = mongoose.Schema

const IRoom = {
  name: {
    // 聊天室标题 （如果是私聊则不保存）
    type: String,
    default: ''
  },
  secret: {
    // 是否为 私聊 （一对一）
    type: Boolean,
    default: true
  },
  members: [String], // 聊天室成员
  status: String, // 当前状态 默认normal
  create_time: Number
}

// 建立数据模型
const RoomModel = mongoose.model(
  'room',
  new Schema(IRoom, {
    versionKey: false
  })
)

module.exports = RoomModel
