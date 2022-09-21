
const UserModel = require('../models/user')


const getUsers = async () => {
	const result = UserModel.find({})

	return result
}


module.exports = {
	getUsers
}