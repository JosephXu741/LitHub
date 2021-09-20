const port = 8080;
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
    cors: { origin: "*" }
});

const {newGame, playCard} = require('./game.js')

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

app.get('/', (req, res) => {
    res.send("hello!");
});

server.listen(port, () => {
    console.log('listening on 8080');
});