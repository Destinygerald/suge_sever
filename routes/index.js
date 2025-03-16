const express = require('express')
const { blog, blogs } = require('../controllers/Blog.js')
const { createQuote } = require('../controllers/Quote.js')

const Route = express.Router()


Route.get('/', blogs)
Route.get('/:id', blog)
Route.post('/add-quote', createQuote)

module.exports = Route