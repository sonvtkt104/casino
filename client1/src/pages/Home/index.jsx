import io from 'socket.io-client'
import { useEffect, useRef } from 'react'

export default function Home() {
    const socketRef = useRef()

    //socket IO
    useEffect(
		() => {
			socketRef.current = io.connect("http://localhost:5005", { transports : ['websocket'] })
            socketRef.current.emit("on-chat", { 
                idUser: 1, 
                message: 'message',
                idConversation: 'idConversation',
            })

			socketRef.current.on( 'idConversation' , ({idUser, message}) => {
                console.log('hihi', idUser, message)
			})
			return () => {
                socketRef.current.disconnect()
            }
		},
		[]
	)

    return (
        <div>Home</div>
    )
}