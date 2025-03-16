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
    meta_data_title: String,
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

const QuoteSchema = new Schema({
    businessType: String,
    wasteType: String,
    frequency: String,
    location: String,
    name: String,
    email: String,
    phone: String,
    status: {
        type: String,
        default: 'Pending'
    },
    dateAdded: Date
})

const Quote = model('quote', QuoteSchema)


module.exports = {
    Blog,
    Admin,
    Content,
    Quote
}