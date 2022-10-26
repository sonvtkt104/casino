import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { Player } from '../../components'
import { Link, useParams } from 'react-router-dom'
import io from 'socket.io-client'
import { useSelector } from 'react-redux'
import { URL_BASE_SERVER } from '../../helper'

export default function Room() {
    //server
    const [players, setPlayers] = useState([
        {
            // id: 0,
            // name: 'Xuan Son',
            // image: '/images/cards.png',
        }, 
        {},
        {},
        {}
    ])  
    const [numberCardsPlayer, setNumberCardsPlayer] = useState([]) // number cards player other [13, 13, 13, 13]
    const [cardsCurrent, setCardsCurrent] = useState([]) // Object[]
    const [statusGame, setStatusGame] = useState('waiting') //waiting, playing, end
    const [turnPlayer, setTurnPlayer] = useState()  //int
    const [totalPlayers, setTotalPlayers] = useState()  //int
    const [playing, setPlaying] = useState([]) // who playing? VD: [0, 1, 4]
    const [playerOwner, setPlayerOwner] = useState()  //int
    const [playerWin, setPlayerWin] = useState() //default = 4 and 0, 1, 2 , 3
    //client
    const [owner, setOwner] = useState(true) //boolean
    const [playerNumber, setPlayerNumber] = useState()  // 0 1 2 3
    const [cards, setCards] = useState([])   // cards player current -> Object[]
    const [selectCards, setSelectCards] = useState([])   // Integer[]
    //define const
    const socketRef = useRef()
    const idPlayer = useRef(parseInt(Math.random() * 1000000))

    const roomId = Number(useParams().roomId)
    const {name, image} = useSelector((state) => state.app)

    const topNumber = useMemo(() => {
        return playerNumber > 1 ? playerNumber - 2 : playerNumber + 2;
    }, [playerNumber])

    const leftNumber = useMemo(() => {
        return playerNumber > 0 ? playerNumber - 1 : 3;
    }, [playerNumber])

    const rightNumber = useMemo(() => {
        return playerNumber < 3 ? playerNumber + 1 : 0;
    }, [playerNumber])

    // socket IO
    useEffect(
		() => {
			socketRef.current = io.connect(URL_BASE_SERVER, { transports : ['websocket'] })

            //listen get info room current
            socketRef.current.on( `info-room-${roomId}`, (room) => {
                setPlayers(room?.players)
                setPlayerOwner(room?.playerOwner)
                let playerNumber;
                for(let i = 0; i < room?.players?.length ; i++) {
                    if(room.players[i]?.id === idPlayer.current) {
                        playerNumber = i;
                        setPlayerNumber(i)
                    }
                }
                if(playerNumber === room?.playerOwner) {
                    setOwner(true)
                } else {
                    setOwner(false)
                }
                setNumberCardsPlayer(room?.numberCardsPlayer)
                setCardsCurrent(room?.cardsCurrent)
                setStatusGame(room?.status)
                setTurnPlayer(room?.turnPlayer)
                setTotalPlayers(room?.totalPlayers)
                setPlaying(room?.playing)
                setPlayerWin(room?.playerWin)
            })

            //listen start-game-receive
            socketRef.current.on( `start-game-response-${roomId}`, (data) => {
                console.log(data?.cards)
                console.log('sssssss', playerNumber)
                setNumberCardsPlayer(data?.numberCardsPlayer)
                setCardsCurrent(data?.cardsCurrent)
                setStatusGame(data?.status)
                setTurnPlayer(data?.turnPlayer)
                setPlaying(data?.playing)
                setCards(data?.cards[playerNumber])
            })

			return () => {
                socketRef.current.disconnect()
            }
		},
		[playerNumber, roomId]
	)

    // setup when player join
    useEffect(() => {
        const params = new Proxy(new URLSearchParams(window.location.search), {
            get: (searchParams, prop) => searchParams.get(prop),
        });
        let owner = params.owner
        let player = params.player
        if( owner === '') {
            // create new room
            console.log('create new room')
            socketRef.current.emit("create-room", {
                roomId: roomId,
                idPlayer : idPlayer.current,
                name: name,
                image: image,
            })
        } else if(player === '') {
            // player join room
            console.log('player join room');
            socketRef.current.emit("join-room", {
                roomId: roomId,
                idPlayer : idPlayer.current,
                name: name,
                image : image,
            })
        }
    }, [roomId, name, image])

    // start game
    const startGame = () => {
        console.log('Starting game')

        //request start game
        socketRef.current.emit("start-game", {
            roomId: roomId,
        })
    }

    //sort cards
    const sortCards = useCallback(() => {
        console.log('sort cards');
        const arr = cards?.sort((a, b) => {
            if(a?.card > b?.card) return 1
            else if(a?.card < b?.card) return -1
            else return 0
        })
        setSelectCards([]);
        setCards((pre) => JSON.parse(JSON.stringify(arr)));
    }, [cards])

    //check type Cards Select
   /** return default: error
    * single
    * double
    * triple
    * quartet
    * chain
    * doubleChain
    */
    const checkTypeCardsSelect = () => { 
        switch (selectCards?.length) {
            case 0:
                return 'error'
            case 1:
                return 'single'
            case 2:
                if(cards[selectCards[0]]?.card === cards[selectCards[1]]?.card ) {
                    return 'double'
                } else return 'error'
            case 3:
                
            default:
                return 'error'
        }
    } 

    const infoState = () => {
        console.log('--------------------------------')
        console.log('players', players)
        console.log('playerNumber', playerNumber)
        console.log('owner', owner)
        console.log('cards', cards)
        console.log("selectCards", selectCards)
        console.log('cardsCurrent', cardsCurrent)
        console.log('statusGame', statusGame)
        console.log('turnPlayer', turnPlayer)
        console.log('totalPlayers',totalPlayers)
        console.log('idPlayer', idPlayer.current)
        console.log('roomId', roomId)
        console.log('name', name)
        console.log('image', image)
        console.log('numberCardsPlayer', numberCardsPlayer)
        console.log('playing', playing)
        console.log('playerOwner', playerOwner)
        console.log('playerWin', playerWin)
    }
    infoState();

    return (
        <div className="room">
            <div className="room-table">

                {/* player left */}
                <div className="room-table-left">
                    <div className="room-user-left">
                        {
                            players[leftNumber]?.name 
                            ? (
                                <Player 
                                    name={players[leftNumber]?.name} 
                                    playerNumber={leftNumber}
                                    turnPlayer={turnPlayer === leftNumber}
                                />
                            )
                            : (
                                <div>
                                    <button>add player</button>
                                </div>
                            )
                        }
                    </div>
                </div>

                {/* Player right */}
                <div className="room-table-right">
                    <div className="room-user-right">
                        {
                            players[rightNumber]?.name 
                            ? (
                                <Player 
                                    name={players[rightNumber]?.name} 
                                    playerNumber={rightNumber}
                                    turnPlayer={turnPlayer === rightNumber}
                                />
                            )
                            : (
                                <div>
                                    <button>add player</button>
                                </div>
                            )
                        }
                    </div>
                </div>

                <div className="room-table-center">

                    {/* Player top */}
                    <div className="room-user-top">
                        {
                            players[topNumber]?.name 
                            ? (
                                <Player 
                                    name={players[topNumber]?.name} 
                                    playerNumber={topNumber}
                                    turnPlayer={turnPlayer === topNumber}
                                />
                            )
                            : (
                                <div>
                                    <button>add player</button>
                                </div>
                            )
                        }
                    </div>

                    {/* Player bottom - It's me */}
                    <div className="room-user-bottom">
                        <Player 
                            name={name} 
                            playerNumber={playerNumber}
                            turnPlayer={turnPlayer === playerNumber}
                        />

                        {
                            statusGame === 'playing' && (
                                <button 
                                    className="room-sort"
                                    onClick={sortCards}
                                >
                                    Xếp bài
                                </button>
                            )
                        }

                        <div className="room-main">
                            {
                                cards?.map((item, index) => {
                                    return (
                                        <div
                                            key={index}
                                            className={selectCards?.includes(index) ? 'room-main-card active' : 'room-main-card'}
                                            style={{ 
                                                border: '1px solid red',
                                                left: `${index * 40 + 30}px`,
                                                width: 70,
                                                height: 100,
                                                zIndex: index + 1,
                                                backgroundColor: 'gray',
                                            }}
                                            onClick={() => {
                                                if(selectCards?.includes(index)) {
                                                    let arr = selectCards?.filter(e => e !== index)
                                                    setSelectCards(pre => JSON.parse(JSON.stringify(arr)))
                                                } else {
                                                    let arr = selectCards;
                                                    arr.push(index)
                                                    setSelectCards(pre => JSON.parse(JSON.stringify(arr)))
                                                }
                                            }}
                                        >
                                            <div style={{ 
                                                position: 'absolute',
                                                fontSize: '24px',
                                                color: 'blue',
                                                top: 4, 
                                                left: 4,
                                            }}>
                                                {`${item?.card}-${item?.character}`}
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>

                    {/* Start-game */}
                    <div className='room-start-game'>
                        {
                            totalPlayers > 1 && owner && statusGame === 'waiting' && (
                                <button onClick={startGame}>Start</button>
                            )
                        }
                        {/* <button onClick={startGame}>Start</button> */}
                    </div>

                    {/* Cards current */}
                    <div className='room-cards-current'>
                        <div style={{width: 1, position: 'relative'}}>
                        {
                            selectCards?.length > 0 && selectCards?.map((item, index) => {
                                let a = parseInt(selectCards.length / 2)
                                let arr = Array.from({length: selectCards.length}, (v, k) => k-a);

                                return (
                                    <div
                                        key={index}
                                        className='room-main-card'
                                        style={{ 
                                            border: '1px solid red',
                                            left: `${arr[index] * 40}px`,
                                            width: 70,
                                            height: 100,
                                            zIndex: index + 1,
                                            backgroundColor: 'gray',
                                        }}
                                    >
                                        <div style={{ 
                                            position: 'absolute',
                                            fontSize: '24px',
                                            color: 'blue',
                                            top: 4, 
                                            left: 4,
                                        }}>
                                            {item}
                                        </div>
                                    </div>
                                )
                            })
                        }
                        </div>
                    </div>
                </div>
                
            </div>


            <div className='room-info'>
                {roomId}
            </div>


            <div className='room-action'>
                <Link to="/">
                    <button>
                        Out Room
                    </button>
                </Link>
            </div>
        </div>
    )
}