
const UserModel = require('../models/user')

 const { transformId } =  require('../utils/tool')


const getUsers = async () => {
	const result = UserModel.find({})
	return transformId(result)
}


module.exports = {
	getUsers
}