const router = require('koa-router')()
const crypto = require('crypto')
const jwt = require('jsonwebtoken')

const UserControllers = require('../controllers/user')
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
      overwrite: false // 是否允许重写})
    })

    ctx.body = loginUser
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

  ctx.body = tempUser

  ctx.cookies.set('token', token, {
    path: '/', // 写cookie所在的路径
    maxAge: tempDueTime, // cookie有效时长
    overwrite: false // 是否允许重写})
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
    avatar:
      'https://s2.51cto.com/oss/202107/05/de51b4f0711b421ed9714fea6e1ec5e8.jpg?x-oss-process=image/format,webp/ignore-error,1'
  })

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

  ctx.cookies.set('token', token, {
    path: '/', // 写cookie所在的路径
    maxAge: activeTime, // cookie有效时长
    overwrite: false // 是否允许重写})
  })

  ctx.body = newPerson

  next()
})

module.exports = router
