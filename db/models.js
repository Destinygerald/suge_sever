const { Schema, model } = require('mongoose')


// CONTENT SCHEMA
const contentSchema = new Schema({
    header: String,
    content: String,
    list: [String],
    img: String,
})

const Content = model('content', contentSchema)


// BLOG SCHEMA
const BlogSchema = new Schema({
    title: String,
    dateAdded: Date,
    readTime: Number,
    content: [contentSchema],
})  

const Blog = model('blog', BlogSchema)


// ADMIN SCHEMA
const AdminSchema = new Schema({
    email: String,
    password: String
})

const Admin = model('admin', AdminSchema)

module.exports = {
    Blog,
    Admin
}