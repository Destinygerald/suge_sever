const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const admin = require('./routes/Admin.js');
const index = require('./routes/index.js');
const { errorHandler, asyncWrapper } = require('./middleware.js')


const app = express();

// app.use(function(req, res, next) {
//     // res.header("Access-Control-Allow-Origin", "*");
//     const allowedOrigins = ['http://localhost:5173', 'https://www.suge.co.uk', 'http://www.suge.co.uk', 'https://suge-3a6v.onrender.com', 'http://suge.co.uk', 'http://sugeuk.com', 'https://sugeuk.com'];
//     const origin = req.headers.origin;
//     if (allowedOrigins.includes(origin)) {
//          res.setHeader('Access-Control-Allow-Origin', origin);
//     }
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
//     res.header("Access-Control-Allow-credentials", true);
//     res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, UPDATE");
//     next();
// });

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

app.use(
    cors({
        origin: [
                'http://localhost:5173', 
                'https://suge-3a6v.onrender.com', 
                'https://www.suge.co.uk', 
                'http://sugeuk.com', 
                'http://www.suge.co.uk', 
                'https://sugeuk.com'
            ],
        credentials: true,
        optionsSuccessStatus: 200 
    })
);

// app.use(cors())

app.use('/admin', admin)
app.use('/blog', index)

app.get('/test', (req, res) => {
    return res.status(200).json({
        status: 'OK',
        message: 'Test successful'
    })
})


app.use(errorHandler)


module.exports = { app };