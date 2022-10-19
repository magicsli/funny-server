const router = require('koa-router')()
const crypto = require('crypto')
const jwt = require('jsonwebtoken')

const UserControllers = require('../controllers/user')
const { secret, activeTime } = require('../jwt')

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
    /**
     * 注： 正常响应必须在内部的async周期中， 在回调函数中无法响应！（但是可以响应错误态/500）
     */
    const token = await new Promise((resolve, reject) => {
      jwt.sign(
        {
          _id: loginUser._id.toString()
        },
        secret,
        {
          expiresIn: activeTime
        },
        (error, token) => {
          if (error || !token) {
            ctx.status = 500
            ctx.body = {
              message: `生成token失败！ ：${error.message}}`
            }

            reject(error)

            next()
          } else {
            resolve(token)
          }
        }
      )
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

// 注册
router.post('/register', async (ctx, next) => {
  const { username, password } = ctx.request.body

  if (!username || !password) {
    ctx.status = 500
    ctx.body = {
      message: '未输入正确的用户名或密码'
    }

    next()

    return
  }

  const passMd = crypto.createHash('md5').update(password).digest('hex')

  const newPerson = await UserControllers.registerUser({
    name: username,
    password: passMd,
    create_time: +new Date(),
    avatar:
      'https://s2.51cto.com/oss/202107/05/de51b4f0711b421ed9714fea6e1ec5e8.jpg?x-oss-process=image/format,webp/ignore-error,1'
  })

  /**
   * 注： 正常响应必须在内部的async周期中， 在回调函数中无法响应！（但是可以响应错误态/500）
   */
  const token = await new Promise((resolve, reject) => {
    jwt.sign(
      {
        _id: newPerson._id.toString()
      },
      secret,
      {
        expiresIn: `${activeTime / 1000 / 60 / 60}H`
      },
      (error, token) => {
        if (error || !token) {
          ctx.status = 500
          ctx.body = {
            message: `生成token失败！ ：${error.message}}`
          }

          reject(error)

          next()
        } else {
          resolve(token)
        }
      }
    )
  })

  ctx.cookies.set('token', token, {
    path: '/', // 写cookie所在的路径
    maxAge: activeTime, // cookie有效时长
    overwrite: false // 是否允许重写})
  })

  ctx.response.body = {
    username: newPerson.name,
    create_time: newPerson.create_time,
    avatar: newPerson.avatar,
    _id: newPerson._id,
    token: token
  }

  next()
})

module.exports = router
