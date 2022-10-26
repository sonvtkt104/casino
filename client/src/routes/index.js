import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Home, Room, ListRoom } from '../pages'

export default function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/room/:roomId" element={<Room />} />
                <Route path="/list-room" element={<ListRoom />} />
            </Routes>
        </BrowserRouter>
    )
}