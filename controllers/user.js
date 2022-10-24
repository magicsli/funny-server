const UserModel = require('../models/user')
const { randomString } = require('../utils')
const crypto = require('crypto')

const getUsers = (options = {}) => {
  return UserModel.find(options, {
    password: 0, // // 省略密码
    friend: 0, // 省略朋友
    __v: 0 // 省略版本号
  })
}

/**
 * 根据用户名（昵称）查询用户
 * @param {string} name 用户名
 * @returns 查询到的用户
 */
const getUserByName = name => {
  return UserModel.find(
    { name },
    {
      password: 0, // 省略密码
      friend: 0, // 省略朋友
      __v: 0 // 省略版本号
    }
  )
}

/**
 * 根据用户（id）查询用户
 * @param {string} id 用户id
 * @returns 查询到的用户
 */
const getUserById = id => {
  return UserModel.find(
    { _id: id },
    {
      password: 0, // // 省略密码
      friend: 0, // 省略朋友
      __v: 0 // 省略版本号
    }
  )
}

/**
 * 插入新的用户
 * @param {IUser} user 用户信息
 */
const registerUser = async user => {
  const hasUser = await getUserByName(user.name)

  if (hasUser.length) return Promise.reject(new Error('当前用户名已占用'))

  return UserModel.create(user).then(res => {
    return {
      name: res.name,
      create_time: res.create_time,
      expire_time: res.expire_time,
      avatar: res.avatar,
      _temp: res._temp,
      _id: res._id
    }
  })
}

/**
 * 移除用户
 * @param {IUser} user 用户信息
 */
const removeUser = id => {
  if (!id || typeof id !== 'string') return Promise.reject('移除用户_ID错误!')

  return UserModel.findByIdAndRemove(id)
}

/**
 * 生成一个快速登录的临时账号 （默认预计14小时后进行移除）
 * @param {IUser} user 用户信息
 */
const createTempUser = async (clearTime = 1000 * 60 * 60 * 14) => {
  const nowTime = Date.now()

  const tempUser = {
    avatar: 'https://pica.zhimg.com/v2-a2d6564bfef85dfe8ae81e80f39f6a20_720w.jpg?source=172ae18b',
    create_time: nowTime,
    _temp: true,
    name: '游客@' + randomString(8),
    password: crypto.createHash('md5').update(randomString(16)).digest('hex'),
    expire_time: nowTime + clearTime
  }

  const hasSameName = await getUserByName(tempUser.name)

  if (hasSameName.length) {
    return createTempUser()
  }

  const user = await registerUser(tempUser)

  // 添加一个计时器， 移除时间到后自动移除
  clearTime &&
    setTimeout(() => {
      removeUser(user._id)
    }, clearTime)

  return user
}

module.exports = {
  getUsers,
  getUserById,
  getUserByName,
  registerUser,
  removeUser,
  createTempUser
}
