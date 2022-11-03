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
  })
}

/**
 * 搜索聊天记录 （所有）
 * @param {object} rule 搜索权限
 * @param {object} options 显示类型
 * @returns 搜索结果 - 从后向前
 */
const getChat = (rule, options) => {
  return ChatModel.find(rule, options).sort({ _id: -1 })
}

/**
 * 获取用户（聊天室内）聊天记录
 * @param {string | ObjectId} id 聊天室Id
 * @param {number} page 页码
 * @param {number} limit 每页传入多少 默认20
 * @returns
 */
const getRoomMessage = ({ id, page = 1, limit = 20 }) => {
  const roomId = toStr(id)

  return ChatModel.find({
    room_id: roomId
  })
    .sort({ _id: -1 })
    .limit(limit)
    .skip((page - 1) * limit)
}

/**
 * 获取
 * @param {string} id 聊天室Id
 * @returns
 */
const getLastMessage = id => {
  return ChatModel.find({
    room_id: id
  })
    .sort({ _id: -1 })
    .limit(1)
    .transform(doc => {
      return doc[0]?.toJSON()
    })
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
  return RoomModel.findOne(options, {
    __v: 0
  })
}

module.exports = {
  getUserRooms,
  getRoomMessage,
  getLastMessage,
  createChat,
  createRoom,
  getRoom,
  getChat
}
