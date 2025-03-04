const { app } = require('./server.js');
const { connectDb } = require('./db/functions.js')

connectDb()

app.listen(8000, () => {
    console.log('listening to Port 8000');
})