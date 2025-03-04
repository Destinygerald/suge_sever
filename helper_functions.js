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

async function jwtSign (info) {
	const sign = await jwt.sign(info, process.env.SECRET)
	return sign
}

async function jwtVerify (token) {
	const result = await jwt.verify(token, process.env.SECRET)
	console.log(result)
	return result
}

module.exports = {
    hashPassword,
    comparePassword,
    jwtSign,
    jwtVerify
}