const express = require('express')
const { addBlog, editBlog, removeBlog, auth, signUp, profile } = require('../controllers/Blog.js')
const { allQuotes, quote, editQuote, removeQuote } = require('../controllers/Quote.js')
const { authAdmin } = require('../middleware.js')

const Route = express.Router()

// Route.all('/', function(req, res, next) {
//     res.header('Access-Control-Allow-Origin', '*')
//     res.header('Access-Contol-Allow-Headers', 'X-Requested-With')
// })

Route.post('/login', auth)

Route.post('/signup', signUp)

Route.get('/profile', profile)

Route.use('/', authAdmin)
Route.post('/', addBlog)

Route.use('/:id', authAdmin)
Route.put('/:id', editBlog)
Route.delete('/:id', removeBlog)

Route.use('/quote', authAdmin)
Route.get('/quote', allQuotes)

Route.use('/quote/:id', authAdmin)
Route.get('/quote/:id', quote)
Route.put('/quote/:id', editQuote)
Route.delete('/quote/:id', removeQuote)

module.exports = Route