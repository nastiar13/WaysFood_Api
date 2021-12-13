require('dotenv').config()
const express = require('express')
const cors = require('cors')
const router = require('./src/routes')
const http = require('http')
const {Server} = require('socket.io')
const app = express()
const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3001"
    }
})

require('./src/socket')(io)

app.use(express.json());
app.use(cors())
app.use(express.urlencoded({ extended: true }))

app.use('/api/v1/', router)
app.use('/uploads', express.static('uploads'))

server.listen(3000, () => console.log('listening at http://127.0.0.1:3000/'))



 
