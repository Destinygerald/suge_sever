const express = require('express')
const { addBlog, editBlog, removeBlog, auth, signUp, profile } = require('../controllers/Blog.js')
const { allQuotes, quote, editQuote, removeQuote } = require('../controllers/Quote.js')
const { newPopup, removePopup, popupActivate, popupDeactivate, allPopups, popupEdit } = require('../controllers/Popup.js')
const { authAdmin } = require('../middleware.js')

const Route = express.Router()

// Route.all('/', function(req, res, next) {
//     res.header('Access-Control-Allow-Origin', '*')
//     res.header('Access-Contol-Allow-Headers', 'X-Requested-With')
// })

// Auth Routes [login, profile]
Route.post('/login', auth)

Route.post('/signup', signUp)

Route.get('/profile', profile)

// Blog Routes [ create, delete, edit ]
Route.use('/', authAdmin)
Route.post('/', addBlog)

Route.use('/:id', authAdmin)
Route.put('/:id', editBlog)
Route.delete('/:id', removeBlog)

// Quotes Routes [ AllQuotes, Quote, Delete, Edit,  ]
Route.use('/quote', authAdmin)
Route.get('/quote', allQuotes)

Route.use('/quote/:id', authAdmin)
Route.get('/quote/:id', quote)
Route.put('/quote/:id', editQuote)
Route.delete('/quote/:id', removeQuote)

// Popup Routes [ Create, Edit, Delete, Activate, Deactivate, FetchAllPopups, FecthActivePopup ]
Route.use('/popups', authAdmin)
Route.get('/popups', allPopups)

Route.use('/popup-message', authAdmin)
Route.post('/popup-message', newPopup)

Route.use('/popup-message/:id', authAdmin)
Route.delete('/popup-message/:id', removePopup)

Route.use('/activate-popup', authAdmin)
Route.put('/activate-popup/:id', popupActivate)

Route.use('/deactivate-popup/:id', authAdmin)
Route.put('/deactivate-popup/:id', popupDeactivate)

Route.use('/edit-popup/:id', authAdmin)
Route.put('/edit-popup/:id', popupEdit)

module.exports = Route