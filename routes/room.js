const router = require('koa-router')()
const { toJsonWidthTransfromId } = require('../utils')
const { USER_ID, CHAT_ID, ROOM_ID } = require('../utils/constant')

const UserControllers = require('../controllers/user')
const ChatControllers = require('../controllers/chat')
router.prefix('/room')

/**
 * 转化为用户Id
 * @param {string[]} ids 用户Id数组
 * @returns 获取所有查到的用户Id
 */
const getMembers = async ids => {
  const users = await UserControllers.getUsers(
    {
      _id: {
        $in: ids
      }
    },
    {
      create_time: 0,
      // _temp: 0,
      expire_time: 0
    }
  )

  return users?.map(item => toJsonWidthTransfromId(item, USER_ID))
}

router.get('/list', async (ctx, next) => {
  const userId = ctx.state.user._id

  const rooms = await ChatControllers.getUserRooms(userId)

  // 用promise.all来处理列表性质的 异步请求或许会更好？
  ctx.body = await Promise.all(
    rooms.map(async roomInfo => {
      const roomDetail = toJsonWidthTransfromId(roomInfo, ROOM_ID)
      roomDetail.members = await getMembers(roomDetail.members)
      const chat_last = await ChatControllers.getChat({
        room_id: roomInfo._id
      }).sort({ _id: -1 })

      roomDetail.last = chat_last[0]

      // 当前聊天室已读数量 - 此数字不会进行动态更新， 每次获取计算！
      roomDetail.unread = chat_last.filter(item => {
        return !item.read_list.includes(userId) && item.from !== userId
      }).length

      return roomDetail
    })
  )

  // 倒叙， 最后一次更新的在前边
  ctx.body.sort((a, b) => b.create_time - a.create_time)

  next()
})

router.get('/detail', async (ctx, next) => {
  const room_id = ctx.request.query.room_id || ''

  const room = await ChatControllers.getRoom({ _id: room_id })
  ctx.body = toJsonWidthTransfromId(room, ROOM_ID)
  ctx.body.members = await getMembers(room.members)

  next()
})

//  创建/进入 私聊聊天室详情
router.get('/secret', async (ctx, next) => {
  const userId = ctx.state.user._id || ''
  const to = ctx.request.query.id || ''

  if (!userId || !to) {
    ctx.status = 500
    ctx.body = {
      code: 500,
      message: '进入聊天室失败！'
    }
    next()
    return
  }

  const members = [userId, to]

  let room = await ChatControllers.getRoom({
    secret: true,
    members: {
      $all: members
    }
  })

  if (!room) {
    room = await ChatControllers.createRoom({
      name: '',
      secret: true,
      members,
      status: 'normal',
      create_time: Date.now()
    })
  }

  ctx.body = toJsonWidthTransfromId(room, ROOM_ID)
  ctx.body.members = await getMembers(members)
  ctx.body.last = await ChatControllers.getLastMessage(room._id)

  next()
})

// 获取聊天室中的聊天记录
router.get('/chat', async (ctx, next) => {
  const roomId = ctx.request.query.room_id
  const page = ctx.request.query.page
  const limit = ctx.request.query.limit

  ctx.body = await ChatControllers.getRoomMessage({
    page,
    id: roomId,
    limit
  })

  next()
})

// 获取聊天室中的聊天记录
router.post('/chat', async (ctx, next) => {
  const userId = ctx.state.user._id || ''

  const { room_id, message } = ctx.request.body

  const chat = await ChatControllers.createChat({
    from: userId,
    read_list: [],
    type: 'str',
    content: message,
    room_id,
    create_time: Date.now()
  })

  ctx.body = toJsonWidthTransfromId(chat, CHAT_ID)

  next()
})

module.exports = router
