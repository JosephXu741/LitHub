const port = 8080;
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
    cors: { origin: "*" }
});

let cardData = [];

let playerData = [];
// {
//     player: {
//         id: Number,
//         cards: []
//     }
// }


const generateNewDeck = () => {
    let newDeck = [];
    ["S", "H", "C", "D"].forEach(suite => {
        ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"].forEach(value =>  {
            newDeck.push(value + suite);
        })
    })
    
    return newDeck;
}

const deal = (newDeck, players) => {
    // [
    //     {
    //         playerId: id
    //         cards: []
    //     },
    //     {
    //         playerId: id
    //         cards: []
    //     }
    // ]
    
    players.forEach(player => {
        const newPlayer = {};
        newPlayer.playerId = player;
        newPlayer.cards = [];
        playerData.push(newPlayer)
    }) 

    for (const i = 0; i < 52; i++) {
        const random = Math.floor(Math.random() * newDeck.length);
        const card = newDeck[random];
        newDeck.splice(random, 1);
        playerData[i % 4].cards.push(card);
    }

    return playerData;

}

const newGame = (players) => {
    playerData = [];
    const newDeck = generateNewDeck();
    const playerData = deal(newDeck, players);
    return playerData
}

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('ping', (ping) => {
        console.log(ping);
        io.emit("response", "We received your ping!");
    });

    socket.on('newGame', message => {
        const data = newGame(message.players);
        io.emit("gameData", data);
    });

});



app.get('/', (req, res) => {
    res.send("hello!");
});

server.listen(port, () => {
    console.log('listening on 8080');
});