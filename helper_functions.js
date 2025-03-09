const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config()

function hashPassword (password) {
	return new Promise((resolve, reject) => {
		bcrypt.hash(password, 10, (err, hash) => {
			if (err) reject(err)
			resolve(hash)
		})
	})
}

async function comparePassword(password, hash) {
	const match = await bcrypt.compare(password, hash)
	return match
}

function jwtSign (info) {
	const sign = jwt.sign(info, process.env.SECRET)
	return sign
}

function jwtVerify (token) {
	const result = jwt.verify(token, process.env.SECRET)
	console.log(result)
	return result
}

module.exports = {
    hashPassword,
    comparePassword,
    jwtSign,
    jwtVerify
}