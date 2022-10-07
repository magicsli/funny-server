const router = require('koa-router')()

router.prefix('/chat')

const UserControllers = require('../controllers/user')

router.get('/', async (ctx, next) => {
  ctx.body = await UserControllers.getUsers()
  next()
})

router.post('/bar', async function (ctx, next) {
  ctx.body = await UserControllers.getUsers()
  next()
})

module.exports = router
