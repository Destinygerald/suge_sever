const Mongoose = require('mongoose')
const { Blog, Admin } = require('./models.js')
const { hashPassword, comparePassword } = require('../helper_functions.js')
require('dotenv').config()

async function findAdminEmail (email) {
    
    const admin = await Admin.findOne({ email })

    return admin
}

async function addAdmin (email, password) {
    const admin = await Admin.create({ email: email, password: password })

    return;
}

async function adminLogin(email, password) {
    const admin = await Admin.findOne({ email: email })

    if (!admin) return 'Invalid credentials'

    const passwordCompare = await comparePassword(password, admin.password)

    if (!passwordCompare) return 'Invalid credentials'

    return admin
}


async function createBlog(data) {
    const newBlog = await Blog.create({
        title: data?.title,
        dateAdded: Date.now(),
        readTime: data?.readTime,
        content: [...data?.content],
    })

    return 0;
}

async function getBlogs() {

    const allBlogs = await Blog.find({})

    return allBlogs;
}

async function getBlog(id) {
    const blog = await Blog.findOne({_id: id})

    if (!blog) return 'Invalid Id';

    return blog;
}


async function updateBlog(id, data) {
    const blog = await Blog.findOne({ _id: id })
    blog.title = data.title
    blog.content = []
    
    data.content.forEach(item => blog.content.push(item))

    // blog.content.push(data.content)
   
    blog.readTime = data.readTime

    await blog.save()
}

async function deleteBlog(id) {
    const blog = await Blog.findOne({_id: id})

    if (!blog) return 'Invalid Id';

    await Blog.deleteOne({ _id: id })

    return 0;
}

function connectDb () {

    Mongoose
        .connect(`mongodb+srv://geralddestiny7:${process.env.PASSWORD}@cluster1.ymnr5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1`)
        .then(() =>  {
            console.log('Database Connected Successful')
        })
        .catch(err => {
            console.log('Database Failed: ', err)
        })
}

module.exports = {
    createBlog,
    getBlogs,
    getBlog,
    updateBlog,
    deleteBlog,
    connectDb,
    findAdminEmail,
    adminLogin,
    addAdmin
}