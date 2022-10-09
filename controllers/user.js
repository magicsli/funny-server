const UserModel = require('../models/user')

const getUsers = async () => {
  return UserModel.find({})
}

/**
 * 根据用户名（昵称）查询用户
 * @param {string} name 用户名
 * @returns 查询到的用户
 */
const getUserByName = async name => {
  return UserModel.find({ name })
}

/**
 * 根据用户Id查询用户
 * @param {string} id 用户id
 * @returns 查询到的用户
 */
const getUserById = async id => {
  return UserModel.find({ _id: id })
}

/**
 * 插入新的用户
 * @param {IUser} user 用户信息
 */
const registerUser = async user => {
  return UserModel.create(user)
}

module.exports = {
  getUsers,
  getUserById,
  getUserByName,
  registerUser
}
