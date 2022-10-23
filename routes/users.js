const router = require('koa-router')()

const UserControllers = require('../controllers/user')

router.prefix('/user')

router.get('/', async (ctx, next) => {
  ctx.body = await UserControllers.getUsers()
  next()
})

router.get('/bar', function (ctx, next) {
  ctx.body = 'this is a users/bar response'
})

module.exports = router
