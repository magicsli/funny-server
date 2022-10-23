const mongoose = require('mongoose')

const Schema = mongoose.Schema

const IRoom = {
  // room_id: '_id', // 聊天室Id
  members: [String], // 聊天室成员
  status: String, // 当前状态
  create_time: Number // 创建聊天室时间 （默认在第一个消息的发送时间）
}

// 建立数据模型
const RoomModel = mongoose.model('room', new Schema(IRoom, { _id: false }))

module.exports = RoomModel
