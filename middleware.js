const { jwtVerify } = require('./helper_functions.js')
const { findAdminEmail } = require('./db/functions.js')
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

		const { admin_auth_token } = req.cookies


        if (!admin_auth_token) {
            return res.status(401).json({
                status: 'Failed',
                message: 'Invalid token Credentials'
            })
        }

        const verify = jwtVerify(admin_auth_token)

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