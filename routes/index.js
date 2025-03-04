const express = require('express')
const { blog, blogs } = require('../controllers/Blog.js')

const Route = express.Router()


Route.get('/', blogs)
Route.get('/:id', blog)

module.exports = Route