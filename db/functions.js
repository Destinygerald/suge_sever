const Mongoose = require('mongoose')
const { Blog, Admin, Content, Quote, Popup } = require('./models.js')
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

// async function createBlogContent (header, content, img, list) {
async function createBlogContent (header, content, img) {
    const blogContent = await Content.create({
        // header, content, img, list
        header, content, img
    })

    return blogContent?._id
}

async function createBlog(data) {

    const blogContentsId = []

    for(item of data?.content) {
    //    let newBlogId = await createBlogContent(item?.header, item?.content, item?.img, item?.list )
       let newBlogId = await createBlogContent(item?.header, item?.content, item?.img)
       blogContentsId.push(newBlogId)
    //    console.log(newBlogId)
    }

    const newBlog = await Blog.create({
        meta_data_title: data?.meta_data_title,
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



    const filteredBlogs = allBlogs.map((item, i) => {
        return ({
            _id: item?._id,
            meta_data_title: item?.meta_data_title,
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
    blog.meta_data_title = data.meta_data_title

    await blog.save()
}

async function deleteBlog(id) {
    const blog = await Blog.findOne({_id: id})

    if (!blog) return 'Invalid Id';

    await blog.deleteOne()

    return 0;
}

async function getAllQuotes () {
    const allQuotes = await Quote.find({})
                                .sort({dateAdded: 'desc'})

    return allQuotes;
}


async function getQuote (id) {
    const quote = await Quote.findOne({_id: id})

    if (!quote) return 'Invalid Id';

    return quote
}


async function addQuote (data) {
    const quote = await Quote.create({...data, dateAdded: Date.now()})

    if (!quote) return;

    return true
}


async function editQuoteStat (id, stat) {
    const quote = await Quote.findOne({ _id: id })

    if (!quote) return 'Invalid Id';

    quote.status = stat

    await quote.save()

    return quote;
}


async function deleteQuote(id) {
    const quote = await Quote.findOne({ _id: id })

    if (!quote) return 'Invalid Id';

    await Quote.deleteOne({ _id: id })

    return 'Quote deleted'
}


async function fetchActivePopup () {
    const popup = await Popup.findOne({ activated: true })

    if (!popup) return;

    return popup;
}

async function fetchAllPopups () {
    const popups = Popup.find({})

    return popups
}

async function createPopup (data) {
    const popup = await Popup.create({
        title: data?.title,
        content: data?.content,
        dateAdded: Date.now(),
        navigation: data?.navigation
    })

    if (!popup) return;

    return true;
}

async function editPopup (id, data) {
    const popup = await Popup.findOne({ _id: id })

    if (!popup) return 'Invalid Id'; 

    popup.title = data?.title
    popup.content = data?.content
    popup.navigation = data?.navigation

    await popup.save()
    
    return popup;
}

async function activatePopup (id) {
    const popup = await Popup.findOne({ _id: id })

    if (!popup) return 'Invalid Id'; 

    const allPopup = await Popup.find({})
    
    for(const _popup of allPopup) {
        popup.activated = false
    }

    await allPopup.save()

    popup.activated = true
    await popup.save()

    return popup;
}

async function deactivatePopup(id) {
    const popup = await Popup.findOne({ _id: id })

    if (!popup) return 'Invalid Id'; 

    popup.activated = false
    await popup.save()

    return popup;
}

async function deletePopup (id) {
    const popup = await Popup.findOne({ _id: id })

    if (!popup) return 'Invalid Id';

    await Popup.deleteOne({ _id: id })

    return popup;
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
    addAdmin,
    getAllQuotes,
    getQuote,
    editQuoteStat,
    addQuote,
    deleteQuote,
    fetchActivePopup,
    createPopup,
    editPopup,
    activatePopup,
    deactivatePopup,
    deletePopup,
    fetchAllPopups
}