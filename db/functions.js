const Mongoose = require('mongoose')
const { Blog, Admin, Content } = require('./models.js')
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

async function createBlogContent (header, content, img, list) {
    const blogContent = await Content.create({
        header, content, img, list
    })

    return blogContent?._id
}

async function createBlog(data) {

    const blogContentsId = []

    for(item of data?.content) {
       let newBlogId = await createBlogContent(item?.header, item?.content, item?.img, item?.list )
       blogContentsId.push(newBlogId)
    //    console.log(newBlogId)
    }

    const newBlog = await Blog.create({
        title: data?.title,
        dateAdded: Date.now(),
        readTime: data?.readTime,
        content: [...blogContentsId],
    })

    return 0;
}

async function getBlogContent(id) {
    const blogContent = await Content
                                .findOne({ _id: id })

    if (!blogContent) {
        return ({})
    } 

    return blogContent;
}
async function getBlogs() {

    const allBlogs = await Blog.find({})
                                .sort({dateAdded: 'desc'})


    let allBlogContent = []

    const images = Array.from({length: allBlogs.length}, (value, index) => [])

    
                   
    for (let [i, content] of allBlogs.entries()) {
        
        let res = await getBlogContent(content.content[0])
        allBlogContent.push(res)
        images[i].push(res?.img)
    }

    // console.log(3)
    // console.log(images)



    const filteredBlogs = await allBlogs.map((item, i) => {
        return ({
            _id: item?._id,
            title: item?.title,
            dateAdded: item?.dateAdded,
            readTime: item?.readTime,
            header: allBlogContent[i]?.header,
            content: allBlogContent[i]?.content,
            img: images[i][0] || images[i][1] || images[i][2] 
        })
    })

    // console.log(filteredBlogs)

    return filteredBlogs;
}

async function getBlog(id) {
    const blog = await Blog
                        .findOne({_id: id})
                        .populate('content')
                        .exec()

    if (!blog) return 'Invalid Id';

    return blog;
}


// Fix this code....Consider if a new content is added and if a previous content is updateed
async function updateBlog(id, data) {
    const blog = await Blog.findOne({ _id: id })
    blog.title = data.title
    

    const contentIds = blog.content
    
    // Delete old contents
    for (const contentId of contentIds) {
        const blogContent = await Content.deleteOne({ _id: contentId })
    }

    for (const content of data?.content) {
        const blogContent = await Content.create({ ...content })
        blog.content.push(blogContent._id)
    }

   
    blog.readTime = data.readTime

    await blog.save()
}

async function deleteBlog(id) {
    const blog = await Blog.findOne({_id: id})

    if (!blog) return 'Invalid Id';

    await blog.deleteOne()

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