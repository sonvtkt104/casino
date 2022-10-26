
import { Link } from 'react-router-dom'

export default function Home() {
    
    return (
        <div>
            <p>Home</p>
            <div>
                <Link to="/list-room">
                    Chon Ban
                </Link>
            </div>

        </div>
    )
}