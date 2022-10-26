export default function Player ({name, playerNumber, turnPlayer}) {
    return (
        <div
            style={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                position:'relative',
                backgroundColor: 'blue'
            }}
        >
            <img src="" alt=""  style={{width: '100%', borderRadius: '50%'}}/>
            <div
                style={{
                    width: '120%',
                    position:'absolute',
                    left: '-10%',
                    bottom: '-10px',
                    border: '1px solid white',
                    borderRadius: '15px',
                    textAlign: 'center',
                    padding: '3px',
                    maxHeight: 26
                }}
            >
                <div
                    style={{
                        position:'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'black',
                        opacity:'0.4',
                        zIndex: '-1',
                        borderRadius: '15px',
                    }}
                >
                </div>
                <span 
                    style={{
                        color:'white',
                        display: '-webkit-box',
                        WebkitLineClamp: '1',
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                    }}>
                    {name}
                </span>
            </div>
            <div
                style={{
                    position: 'absolute',
                    top: '-20px',
                    left: '48%'
                }}
            >
                {playerNumber}
            </div>
            <div
                style={{
                    position: 'absolute',
                    top: '-40px',
                    left: '48%'
                }}
            >
                {
                    turnPlayer && (
                        "playing ..."
                    )
                }
            </div>
        </div>
    )
}