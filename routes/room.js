const router = require('koa-router')()
const { toJsonWidthTransfromId } = require('../utils')
const { USER_ID, ROOM_ID } = require('../utils/constant')

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
      return roomDetail
    })
  )

  // 倒叙， 最后一次更新的在前边
  ctx.body.sort((a, b) => b.create_time - a.create_time)

  next()
})

// 聊天室详情
router.get('/detail', async (ctx, next) => {
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
      secret: true,
      members,
      status: 'normal',
      create_time: Date.now()
    })
  }

  ctx.body = toJsonWidthTransfromId(room, ROOM_ID)

  ctx.body.members = await getMembers(members)

  next()
})

// 获取聊天室中的聊天记录
router.get('/chats', async (ctx, next) => {
  const roomId = ctx.request.query.room_id
  const page = ctx.request.query.page
  const limit = ctx.request.query.limit

  ctx.body = await ChatControllers.getRoomChats({
    page,
    id: roomId,
    limit
  })

  next()
})

module.exports = router
