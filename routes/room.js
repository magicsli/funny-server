const router = require('koa-router')()
const { secret } = require('../jwt')
const jwt = require('koa-jwt')
const UserControllers = require('../controllers/user')
const ChatControllers = require('../controllers/chat')
router.prefix('/room')

router.get('/list', async (ctx, next) => {
  const userId = ctx.state.user._id

  ctx.body = await ChatControllers.getUserRooms(userId)

  next()
})

router.get('/detail', async (ctx, next) => {
  const userId = ctx.state.user._id
  const to = ctx.request.query.id

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

  room.members = await UserControllers.getUsers({
    _id: {
      $in: members
    }
  })

  ctx.body = room

  next()
})

module.exports = router
