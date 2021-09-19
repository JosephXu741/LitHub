import React, { useEffect, useState } from 'react'
import { socket } from "../services/socket";

function Table() {
    const [data, setData] = useState({
        playerData: [],
        playedCards: []
    });
    const [playerInput, setPlayerInput] = useState("");
    const [cardsInput, setCardsInput] = useState("");
    // {
    //     playerData: [
    //         {
    //             playerId: "01",
    //             cards: []
    //         },
    //         {
    //             playerId: "02",
    //             cards: []
    //         },
    //     ]
    // }

    useEffect(() => {
        socket.on("gameData", response => {
            setData(data => ({
                ...data, 
                playerData: response
            }));
        });

        socket.on("newState", response => {
            console.log(response)
            setData(data => ({
                ...data, 
                playerData: response.state,
                playedCards: data.playedCards.concat(response.playedCards)

            }));
        })


        socket.emit("newGame", ["01", "02", "03", "04"]);
    }, [])

    const handleClick = () => {
        console.log(data.playerData)
    }

    const handlePlay = () => {
        socket.emit("newGame", ["01", "02", "03", "04"]);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const cards = cardsInput.split(" ")
        socket.emit("playCard", {player: playerInput, cards})
    }

    return (
        <div>
            <button onClick={handleClick}>Ping!</button>
            <div>
                Welcome to Big 2!
            </div>
            <div>
                <button onClick={handlePlay}>Play!</button>
            </div>
            <div>
                table: {
                    data.playedCards.map(card => 
                        <span key={card}>{`${card}, `}</span>)
                }
                {
                    data.playerData.map(player => (
                        <div key={player.playerId}>
                            {player.playerId} : {player.cards.map(card => (
                                <span key={card}>{`${card}, `}</span>
                            ))}
                        </div>
                    ))
                }
            </div>
            <div>
                play a card!:
                <form onSubmit={handleSubmit}>
                    player: <input type="text" name="player" value={playerInput} onChange={(e) => setPlayerInput(e.target.value)} />
                    card/s: <input type="text" name="cards" value={cardsInput} onChange={(e)=> setCardsInput(e.target.value)} />
                    <button>Submit!</button>
                </form>
            </div>
        </div>
    )
}

export default Table
