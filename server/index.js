import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import {Server} from 'socket.io'
import http from 'http'
import dotenv from 'dotenv'

dotenv.config();

const app = express()
const PORT = process.env.port || 5000

// Create socketIO and wrap app server inside
const server = http.Server(app)
const io = new Server(server)

io.on('connection', socket => {
    console.log("Connected socket" );

    socket.on("disconnect", () => {
        console.log("Disconnected socket" );
    });

    socket.on('on-chat', ({idUser, message, idConversation}) => {
        io.emit(idConversation , { 
            idUser : idUser,
            message: message
        })
    })
});

// Add middleware to handle post request for express
app.use(bodyParser.json({limit : '30mb'}))
app.use(bodyParser.urlencoded({extended: true, limit: '30mb'}))
app.use(cors())

// Run Server
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})

