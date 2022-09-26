

module.exports = {
	transformId(list = []){
		
		if (!Array.isArray(list)) return list

		return list.map(item => {
			const newItem = {id: item._id, ...item}
			delete newItem._id
			return newItem
		})
	}
}