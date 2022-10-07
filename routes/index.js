const router = require('koa-router')()
const crypto = require('crypto')

const UserControllers = require('../controllers/user')

// 登录
router.post('/login', async (ctx, next) => {
  const { username, password, isQuick } = ctx.request.body

  if (!username || !password) {
    ctx.status = 400
    ctx.body = {
      message: '账号名或密码不能为空 '
    }
    next()
    return
  }

  const passMd = crypto.createHash('md5').update(password).digest('hex')

  // 获取到同昵称的用户信息
  const users = await UserControllers.getUserByName(username)

  const loginUser = users?.find(item => {
    return item.password === passMd
  })

  if (!loginUser) {
    ctx.status = 401
    ctx.body = {
      message: '未找到该用户'
    }

    next()
  } else {
    ctx.body = loginUser
    next()
  }
})

// 注册
router.post('/register', async (ctx, next) => {
  const { username, password } = ctx.request.body

  if (!username) {
  }

  const passMd = crypto.createHash('md5').update(password).digest('hex')

  ctx.body = await UserControllers.registerUser({
    name: username,
    password: passMd,
    create_time: +new Date(),
    avatar:
      'https://s2.51cto.com/oss/202107/05/de51b4f0711b421ed9714fea6e1ec5e8.jpg?x-oss-process=image/format,webp/ignore-error,1'
  })

  next()
})

module.exports = router
