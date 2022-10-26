import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { URL_BASE_SERVER } from '../../helper'

export default function ListRoom () {
    const navigate = useNavigate();
    const [listRoom, setListRoom] = useState([])
            
    useEffect(() => {
        axios.get(`${URL_BASE_SERVER}/all-room`)
            .then(function (res) {
                console.log(res.data);
                let arr = [];
                for (const roomId in res.data) {
                    let item = {};
                    item.roomId = roomId;
                    item.players = res.data[roomId]?.totalPlayers;
                    arr.push(item)
                }
                setListRoom(arr)
            })
            .catch(function (error) {
                console.log(error);
            })
    }, [])

    console.log(listRoom)

    return (
        <div className="list-room">
            <div className="list-room-header">
                
                <button
                    onClick={() => {
                        let random = parseInt(Math.random() * 1000000);
                        console.log(random)
                        navigate(`/room/${random}?owner`);
                    }}
                >
                    Create Room
                </button>
                <Link to="/"><button>Home</button></Link>
            </div>
            <div className='list-room-content'>
                <table>
                    <thead>
                        <tr>
                            <th>roomID</th>
                            <th>players</th>
                            <th>join</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            listRoom?.map((item, index) => {
                                console.log(item, index);
                                return (
                                    <tr key={index}>
                                        <td>{item.roomId}</td>
                                        <td>{item.players}</td>
                                        <td>
                                            <button
                                                onClick={() => {
                                                    axios.get(`${URL_BASE_SERVER}/get-room?id=${item.roomId}`)
                                                        .then((res) => {
                                                            console.log(res.data, 'get-room')
                                                            if(Number(res.data?.totalPlayers) < 4) {
                                                                navigate(`/room/${item.roomId}?player`);
                                                            }
                                                        })
                                                        .catch((err) => {
                                                            console.log(err);
                                                        })
                                                }}
                                            >
                                                Join
                                            </button>
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>

            </div>
        </div>
    )
}