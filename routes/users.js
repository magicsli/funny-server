const router = require('koa-router')()

const crypto = require('crypto')
const jwt = require('jsonwebtoken')

const UserControllers = require('../controllers/user')
const { toJsonWidthTransfromId } = require('../utils')
const { USER_ID } = require('../utils/constant')
const { secret, activeTime, tempDueTime } = require('../jwt')

/**
 * token签名
 * @param {string | ObjectId} id 用户Id
 * @param {number} expiresIn 过期时间
 * @returns 生成好的token
 */
const signToken = (id, expiresIn = activeTime) => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      {
        _id: typeof id === 'string' ? id : id.toString()
      },
      secret,
      {
        expiresIn
      },
      (error, token) => {
        if (error || !token) {
          reject(error)
        } else {
          resolve(token)
        }
      }
    )
  })
}

// 登录
router.post('/login', async (ctx, next) => {
  const { username, password } = ctx.request.body

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
  const loginUser = await UserControllers.findUser({
    name: username,
    password: passMd
  })

  if (!loginUser) {
    ctx.status = 500
    ctx.body = {
      code: 500,
      message: '未找到该用户'
    }

    next()
  } else {
    const token = await signToken(loginUser._id).catch(() => {
      ctx.status = 500
      ctx.body = {
        code: 500,
        message: `生成token失败！ ：${error.message}}`
      }
      next()
    })

    ctx.cookies.set('token', token, {
      path: '/', // 写cookie所在的路径
      maxAge: activeTime, // cookie有效时长
      httpOnly: false // 是否只用于http请求中获取
    })

    ctx.body = toJsonWidthTransfromId(loginUser, USER_ID)
    next()
  }
})

// 更新token信息
router.get('/update', async (ctx, next) => {
  const userId = ctx.state.user._id

  // 获取到同昵称的用户信息
  const user = (await UserControllers.getUserById(userId))?.[0]

  if (!user) {
    ctx.status = 401
    ctx.body = {
      code: 401,
      message: '登录授权失败！'
    }

    next()
  } else {
    const token = await signToken(user._id).catch(() => {
      ctx.status = 500
      ctx.body = {
        code: 500,
        message: `生成token失败！ ：${error.message}}`
      }
      next()
    })

    ctx.cookies.set('token', token, {
      path: '/', // 写cookie所在的路径
      maxAge: activeTime, // cookie有效时长
      httpOnly: false // 是否只用于http请求中获取
    })

    ctx.body = toJsonWidthTransfromId(user, USER_ID)
    next()
  }
})

// 游客快速登录
router.post('/visitor', async (ctx, next) => {
  const tempUser = await UserControllers.createTempUser(tempDueTime)

  /**
   * 注： 正常响应必须在内部的async周期中， 在回调函数中无法响应！（但是可以响应错误态/500）
   */
  const token = await signToken(tempUser._id).catch(() => {
    ctx.status = 500
    ctx.body = {
      code: 500,
      message: `生成token失败！ ：${error.message}}`
    }
    next()
  })

  ctx.body = toJsonWidthTransfromId(tempUser, USER_ID)

  ctx.cookies.set('token', token, {
    path: '/', // 写cookie所在的路径
    maxAge: tempDueTime, // cookie有效时长
    httpOnly: false // 是否只用于http请求中获取
  })

  next()
})

// 注册
router.post('/register', async (ctx, next) => {
  const { username, password } = ctx.request.body

  if (!username || !password) {
    ctx.status = 500
    ctx.body = {
      code: 500,
      message: '未输入正确的用户名或密码'
    }

    next()
    return
  }

  if (username.length > 16) {
    ctx.status = 500
    ctx.body = {
      code: 500,
      message: '用户名过长！请限制在16个字符内'
    }

    next()

    return
  }

  if (password.length > 20) {
    ctx.status = 500
    ctx.body = {
      code: 500,
      message: '密码过长！请限制在20个字符内'
    }

    next()
    return
  }

  const passMd = crypto.createHash('md5').update(password).digest('hex')

  const newPerson = await UserControllers.registerUser({
    name: username,
    password: passMd,
    create_time: Date.now(),
    // 暂时不支持头像上传， 给个默认图， 迫切需要一个支持资源上传的站点
    avatar:
      'https://s2.51cto.com/oss/202107/05/de51b4f0711b421ed9714fea6e1ec5e8.jpg?x-oss-process=image/format,webp/ignore-error,1'
  })

  /**
   * 注： 正常响应必须在内部的async周期中， 在回调函数中无法响应！（但是可以响应错误态/500）
   */
  const token = await signToken(newPerson._id).catch(() => {
    ctx.status = 500
    ctx.body = {
      code: 500,
      message: `生成token失败！ ：${error.message}}`
    }
    next()
  })

  ctx.cookies.set('token', token, {
    path: '/', // 写cookie所在的路径
    maxAge: activeTime, // cookie有效时长
    httpOnly: false // 是否只用于http请求中获取
  })

  ctx.body = toJsonWidthTransfromId(newPerson, USER_ID)

  next()
})

// 查询所有的用户信息
router.get('/user', async (ctx, next) => {
  const users = await UserControllers.getUsers()

  ctx.body = users.map(item => toJsonWidthTransfromId(item, USER_ID))
  next()
})

module.exports = router
