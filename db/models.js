const { Schema, model } = require('mongoose')

// CONTENT LIST SCHEMA
const contentListSchema = new Schema({
    title: String,
    description: String    
})


// CONTENT SCHEMA
const contentSchema = new Schema({
    header: String,
    content: String,
    list: [contentListSchema],
    img: String,
})

const Content = model('content', contentSchema)


// BLOG SCHEMA
const BlogSchema = new Schema({
    template: Number,
    title: String,
    dateAdded: Date,
    readTime: Number,
    content: [{
        type: Schema.Types.ObjectId,
        ref: 'content'
    }],
})  

BlogSchema.pre('deleteOne', {document: true}, async function(next) {

    const contentIds = this.content

    for (const contentId of contentIds) {
        await Content.deleteOne({ _id: contentId })
    }

    next()
    
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
    Admin,
    Content
}