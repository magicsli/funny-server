const ChatModel = require('../models/chat')
const RoomModel = require('../models/room')
const { toStr } = require('../utils')
const crypto = require('crypto')

/**
 * 获取用户聊天室列表
 * @param {string | ObjectId} id 用户Id
 * @returns
 */
const getUserRooms = id => {
  const userId = toStr(id)

  return RoomModel.find({
    member: {
      $elemMatch: userId
    }
  }).then(async res => {
    for await (const iterator of res) {
      const chat_last = await ChatModel.find({
        room_id: iterator._id
      }).sort({ _id: -1 })

      iterator.chat_last = chat_last[0]

      // 当前聊天室已读数量
      iterator.unread = chat_last.filter(item => {
        return item.read_list.includes(userId) && item.from !== userId
      }).length
    }

    return res
  })
}

/**
 * 获取用户聊天室列表
 * @param {string | ObjectId} id 聊天室Id
 * @param {number} page 页码
 * @param {number} limit 每页传入多少 默认20
 * @returns
 */
const getRoomChats = ({ id, page = 1, limit = 20 }) => {
  const roomId = toStr(id)

  return ChatModel.find({
    room_id: roomId
  })
    .sort({ _id: -1 })
    .limit(limit)
    .skip((page - 1) * limit)
}

/**
 * 创建一条消息
 * @param {IChat} chat 待创建的消息
 */
const createChat = async chat => {
  return ChatModel.create(chat)
}

/**
 * 生成一个新的聊天室
 * @param {IRoom} chat 待创建的消息
 */
const createRoom = async room => {
  return RoomModel.create(room)
}

/**
 * 查询聊天室详情
 * @param {IRoom} chat 待创建的消息
 */
const getRoom = async options => {
  return RoomModel.findOne(options)
}

module.exports = {
  getUserRooms,
  getRoomChats,
  createChat,
  createRoom,
  getRoom
}
