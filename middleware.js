const { jwtVerify } = require('./helper_functions.js')
const { findAdminEmail } = require('./db/functions.js')
const { auth } = require('./controllers/Blog.js')
require('dotenv').config()
function asyncWrapper(fn) {
	return (req, res, next) => {
	  return Promise.resolve(fn(req, res))
		.then((result) => res.send(result))
		.catch((err) => next(err))
	}
}


async function authAdmin (req, res, next) {
	try {
		const authToken = req.headers.authorization.split(' ')


        if (!authToken) {
            return res.status(401).json({
                status: 'Failed',
                message: 'Invalid token Credentials'
            })
        }

		let token ;
		
		if (authToken[1].at(authToken[1].length) == ';') {
			token = authToken[1].slice(0, authToken[1].length - 1)
		} else {
			token = authToken[1]
		}

        const verify = jwtVerify(token)

        if (!verify) {
            return res.status(401).json({
                status: 'Failed',
                message: 'Invalid token Credentials'
            })
        }


        const checkEmail = await findAdminEmail(verify?._doc?.email)

        if (!checkEmail) {
            return res.status(401).json({
                status: 'Failed',
                message: 'Invalid token Credentials'
            })
        }

		next()

	} catch (err) {
		return res.status(500).json({
			status: 'Failed',
			err: err
		})
	}
} 

async function errorHandler (err, req, res, next) {
	res.status(500).json({
		status: 'Failed',
		message: err.message
	})
}

module.exports = {
	asyncWrapper,
	errorHandler,
	authAdmin
}