const mongoose = require('mongoose')

const Schema = mongoose.Schema

const IUser = {
  name: String,
  password: String,
  avatar: String,
  create_time: {
    type: Number,
    default: Date.now()
  },
  expire_time: Number, //（临时账号） 失效时间
  _temp: Boolean // 是否为临时账号
}

// 建立数据模型
const UserModel = mongoose.model(
  'user',
  new Schema(IUser, {
    versionKey: false
  })
)

module.exports = UserModel
