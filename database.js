const mongo = require('mongoose')

const db = mongo.connection

mongo.connect('mongodb://localhost:27017/funny')

db.once('open', () => {
	console.log('mongodb conecting')
})