const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const admin = require('./routes/Admin.js');
const index = require('./routes/index.js');
const { errorHandler, asyncWrapper } = require('./middleware.js')


const app = express();

app.use(express.json());
app.use(cookieParser())
app.use(
    cors({
        origin: ['http://localhost:5173', 'https://suge-3a6v.onrender.com', 'www.suge.co.uk'],
        credentials: true
    })
);

app.use('/admin', admin)
app.use('/', index)

app.get('/test', (req, res) => {
    console.log('Testing')
    return 
})


app.use(errorHandler)


module.exports = { app };