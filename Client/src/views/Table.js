import React, { useEffect } from 'react'
import { io } from "socket.io-client";

function Table() {
    const socket = io("ws://localhost:8080");
    const players = ["01", "02", "03", "04"]

    useEffect(() => {
        socket.on("response", response => {
            console.log(response);
          });

        socket.on("newGame", response => {
            console.log("a new game has started!", response);
        })
    })

    const handleClick = () => {
        socket.emit("ping", "ping!")
    }

    const handlePlay = () => {
        socket.emit("newGame", players);
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
        </div>
    )
}

export default Table
