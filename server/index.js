import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import {Server} from 'socket.io'
import http from 'http'
import dotenv from 'dotenv'
import { deckOfCards } from './helper.js'
import { isPromise } from 'util/types'
import { getListRoomOnline } from './controllers/ListRoomController/index.js'

dotenv.config();

const app = express()
const PORT = process.env.port || 5000

var infoRoomDefault = {
    players: [
        {
            // id: 0,
            // name: 'Xuan Son',
            // image: '/images/cards.png'
        },
        {
        },
        {
        },
        {
        }
    ],
    totalPlayers: 1,
    playerOwner: 0,
    numberCardsPlayer: [13, 13, 13, 13],  //[13, 13, 13, 13]
    status: 'waiting',
    turnPlayer: 0,
    cardsCurrent: [
        // {
        //     card: 1,
        //     character: 4,
        //     image: ""
        // },
        // {
        //     card: 1,
        //     character: 3,
        //     image: ""
        // }
    ],
    playing : [], // who playing? VD: [0, 1, 4]
    playerWin: 4, //default = 4 and 0, 1, 2 , 3
}

var infoRoomOnline = {
    // 1 : JSON.parse(JSON.stringify(infoRoomDefault))
};

// Create socketIO and wrap app server inside
const server = http.Server(app)
const io = new Server(server)

io.on('connection', socket => {
    console.log("Connected socket");

    //listen disconnect
    socket.on("disconnect", () => {
        console.log("Disconnected socket" );
    });

    //listen create new room 
    socket.on("create-room", ({roomId, idPlayer, name, image}) => {
        let room = JSON.parse(JSON.stringify(infoRoomDefault));
        room.players[0] = {
            id: idPlayer,
            name: name,
            image: image
        }
        infoRoomOnline[roomId] = room;

        //receive info room
        io.emit(`info-room-${roomId}`, room)
    })

    //listen player join room
    socket.on("join-room", ({roomId, idPlayer, name, image}) => {
        if(infoRoomOnline[roomId]) {
            // has room
            for(let i = 0; i < infoRoomOnline[roomId].players?.length; i++) {
                if(!infoRoomOnline[roomId].players[i]?.name) {
                    infoRoomOnline[roomId].players[i] = {
                        id: idPlayer,
                        name: name,
                        image: image
                    }
                    break;
                }
            }
            infoRoomOnline[roomId].totalPlayers = infoRoomOnline[roomId].totalPlayers + 1;

            //receive info room
            io.emit(`info-room-${roomId}`, infoRoomOnline[roomId])
        } else {
            // room undefine -> create new room
            let room = JSON.parse(JSON.stringify(infoRoomDefault));
            room.players[0] = {
                id: idPlayer,
                name: name,
                image: image
            }
            infoRoomOnline[roomId] = room;

            //receive info room
            io.emit(`info-room-${roomId}`, room)
        }
    })

    //listen start-game
    socket.on('start-game', ({roomId}) => {
        if(infoRoomOnline[roomId]) {
            infoRoomOnline[roomId].numberCardsPlayer = [13, 13, 13, 13];
            infoRoomOnline[roomId].status = 'playing';
            infoRoomOnline[roomId].turnPlayer = infoRoomOnline[roomId].playerWin != 4 ? infoRoomOnline[roomId].playerWin : infoRoomOnline[roomId].playerOwner;
            infoRoomOnline[roomId].cardsCurrent = []

            let playing = [];
            for(let i = 0; i < infoRoomOnline[roomId].players.length; i++) {
                if(infoRoomOnline[roomId].players[i]?.name) {
                    playing.push(i);
                }
            }
            infoRoomOnline[roomId].playing = playing;

            // shuffled Deck Of Cards
            let shuffled = deckOfCards?.sort(() => Math.random() - 0.5)
    
            io.emit(`start-game-response-${roomId}`, {
                numberCardsPlayer: infoRoomOnline[roomId].numberCardsPlayer,
                status : infoRoomOnline[roomId].status,
                turnPlayer: infoRoomOnline[roomId].turnPlayer,
                cardsCurrent: infoRoomOnline[roomId].cardsCurrent,
                playing: infoRoomOnline[roomId].playing,
                cards: {
                    0: shuffled.slice(0, 13),
                    1: shuffled.slice(13, 26),
                    2: shuffled.slice(26, 39),
                    3: shuffled.slice(39, 52)
                }
            })
        }
    })
});




// Add middleware to handle post request for express
app.use(bodyParser.json({limit : '30mb'}))
app.use(bodyParser.urlencoded({extended: true, limit: '30mb'}))
app.use(cors())





//Route
app.get('/', (req, res) => {
    res.send('hello world')
})
app.get("/all-room", (req, res) => {
    return res.status(200).json(infoRoomOnline)
})
app.get("/get-room", (req, res) => {
    let roomId = Number(req.query.id)
    return res.json(infoRoomOnline[roomId]);
})







// Run Server
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})

