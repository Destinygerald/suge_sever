const { createBlog, getBlogs, getBlog, updateBlog, deleteBlog, adminLogin, findAdminEmail, addAdmin } = require('../db/functions')
const { jwtSign, jwtVerify, hashPassword } = require('../helper_functions.js')

let AdminAdded = false;

async function auth(req, res) {
    try {

        const { email, password } = req.body

        if (!email || !password) {
            return res.status(401).json({
                status: 'Invalid credentials',
                message: 'Login is not correct'
            })
        }


        const adminCheck = await adminLogin(email, password)

        if (adminCheck == 'Invalid credentials') {
            return res.status(401).json({
                status: 'Invalid credentials',
                message: 'Login is not correct'
            })
        }

        const authToken = await jwtSign({...adminCheck})


        if (!authToken) {
            return res.status(400).json({
                status: 'Failed',
                message: 'Error with auth token'
            })
        }

       
        return res
                .status(200)
                .cookie('admin_auth_token', authToken, { expires: new Date(Date.now() + (24 * 3600000)) })
                .json({
                    status: 'Ok',
                    message: 'Login Successfully',
                    auth: authToken
                })

        

    } catch (err) {
        return res.status(500).json({
            status: 'Failed',
            err: err
        })
    }
}

async function signUp(req, res) {
    try {

        const { email, password } = req.body

        if (!email || !password) {
            return res.status(401).json({
                status: 'Failed',
                message: 'Invalid Credentials'
            })
        }

        const hashedPassword = await hashPassword(password)

        if (!hashedPassword) {
            return res.status(400).json({
                status: 'Failed',
                message: 'Server Error'
            })
        }


        addAdmin(email, hashedPassword)

        return res.status(201).json({
            status: 'Created',
            message: 'Admin added'
        })

    } catch (err) {
        return res.status(500).json({
            status: 'Failed',
            err: err
        })  
    }
}

async function profile(req, res) {
    try {

        const authToken = req.headers.authorization.split(' ')

        if (!authToken[1]) {
            return res.status(401).json({
                status: 'Failed',
                message: 'Invalid token Credentials'
            })
        }

        const verify = await jwtVerify(authToken[1])




        if (!verify) {
            return res.status(401).json({
                status: 'Failed',
                message: 'Couldnt verify Credentials'
            })
        }

        const checkEmail = await findAdminEmail(verify?._doc?.email)

        if (!checkEmail) {
            return res.status(401).json({
                status: 'Failed',
                message: 'Invalid token Credentials*'
            })
        }

        return res.status(200).json({
            status: 'Ok',
            message: 'Auth Successful'
        })
        

    } catch (err) {
        return res.status(500).json({
            status: 'Failed',
            err: err
        })
    }
}

async function addBlog(req, res) {
    try {
        const { title, content, readTime, template } = req.body;


        if (!title || !readTime || !content[0]) {
            return res.status(400).json({
                status: 'Failed',
                message: 'Incomplete data'
            })
        }

        const data = {
            title, content, readTime, dateAdded: Date.now(), template
        }

    

        await createBlog(data)

    

        return res.status(201).json({
            status: 'Created',
            message: 'Blog created successfully'
        })
    } catch (err) {
        return res.status(500).json({
            status: 'Failed',
            err: err
        })
    }
}

async function blogs (req, res) {
    try {
        const blogList = await getBlogs()

        return res.status(200).json({
            status: 'OK',
            result: blogList
        })
    } catch (err) {
        return res.status(500).json({
            status: 'Failed',
            err: err
        })
    }
}

async function blog (req, res) {
    try {
        const {id} = req.params 

        if (!id) {
            return res.status(404).json({
                status: 'Not Found',
                message: 'Invalid blog id'
            })
        }

        const blog = await getBlog(id)

        if (blog == 'Invalid Id') {
            return res.status(404).json({
                status: 'Not Found',
                message: 'Invalid blog id'
            })
        }
        
        return res.status(200).json({
            status: 'OK',
            data: blog
        })
    } catch (err) {
        return res.status(500).json({
            status: 'Failed',
            err: err
        })
    }
}

async function editBlog(req, res) {
    try {
        const { id } = req.params
        const { title, content, readTime } = req.body

        if (!id) {
            return res.status(404).json({
                status: 'Not Found',
                message: 'Invalid blog id'
            })
        }

        const blog = await getBlog(id)

        if (blog == 'Invalid Id') {
            return res.status(404).json({
                status: 'Not Found',
                message: 'Invalid blog id'
            })
        }

        const data = {
            title,
            content,
            readTime
        }
        
        await updateBlog(id, data)

        return res.status(200).json({
            status: 'Ok',
            message: 'Blog edited successfully'
        })

    } catch (err) {
        return res.status(500).json({
            status: 'Failed',
            err: err
        })
    }
}

async function removeBlog(req, res) {
    try {

        const {id} = req.params 

        if (!id) {
            return res.status(404).json({
                status: 'Not Found',
                message: 'Invalid blog id'
            })
        }

        const blog = await getBlog(id)

        if (blog == 'Invalid Id') {
            return res.status(404).json({
                status: 'Not Found',
                message: 'Invalid blog id'
            })
        }

        await deleteBlog(id)

        return res.status(200).json({
            status: 'Ok',
            message: 'Blog deleted'
        })

    } catch (err) {
        return res.status(500).json({
            status: 'Failed',
            err: err
        })
    }
}

module.exports = {
    addBlog,
    blog,
    blogs,
    editBlog,
    removeBlog,
    auth,
    signUp,
    profile
}