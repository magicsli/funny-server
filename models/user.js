const mongoose = require('mongoose')

const Schema = mongoose.Schema

const IUser = {
	user_id: String,
	name: String,
	avatar: String,
	create_time: Number
}

// 建立数据模型

const UserModel = mongoose.model('user', new Schema(IUser))


module.exports = UserModel