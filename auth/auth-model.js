const db = require("../database/dbConfig")

module.exports = {
    add,
    getAllUsers,
    findBy
}

function add(user) {
    return db('users').insert(user)
}

function getAllUsers(){
    return db("users")
}

function findBy(filter) {
	return db("users")
		.select( "username", "password")
		.where(filter)
}