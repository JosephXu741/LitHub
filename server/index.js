const port = 8080;
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
    cors: { origin: "*" }
});

io.on('connection', (socket) => {
    console.log('a user connected');
    let state = [];

    socket.on('newGame', message => {
        state = newGame(message);
        io.emit("gameData", state);
    });

    socket.on("playCard", data => {
        const player = data.player;
        const cards = new Set(data.cards)
        io.emit("newState", playCard(state, player, cards));
    })

});

// {
//     player: {
//         id: Number,
//         cards: []
//     }
// }

const playCard = (state, player, cards) => {
    const playedCards = [];
    state.forEach(playerData => {
        if (playerData.playerId === player) {
            playerData.cards = playerData.cards.filter(card => { 
                cards.has(card) && playedCards.push(card)
                return !cards.has(card)
            })
        }
    })
    return {state, playedCards} 
}

const generateNewDeck = () => {
    const newDeck = [];
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
    const playerData = [];
    
    players.forEach(player => {
        const newPlayer = {};
        newPlayer.playerId = player;
        newPlayer.cards = [];
        playerData.push(newPlayer)
    }) 

    for (let i = 0; i < 52; i++) {
        const random = Math.floor(Math.random() * newDeck.length);
        const card = newDeck[random];
        newDeck.splice(random, 1);
        playerData[i % 4].cards.push(card);
    }

    return playerData;

}

const newGame = (players) => {
    const newDeck = generateNewDeck();
    const playerData = deal(newDeck, players);
    return playerData
}




app.get('/', (req, res) => {
    res.send("hello!");
});

server.listen(port, () => {
    console.log('listening on 8080');
});