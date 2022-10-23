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

router.post('/detail', async (ctx, next) => {
  const userId = ctx.state.user._id
  const to = ctx.request.body.to

  const room = {}

  ctx.body = await ChatControllers.getOrCreateRoom()

  next()
})

module.exports = router
