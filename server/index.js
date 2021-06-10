const http = require('http')
const express = require('express')
const socketIO = require('socket.io')
const port = process.env.PORT || 3000;

let app = express();
let server = http.createServer(app);
let io = socketIO(server);




app.get('/', (req, res) => {
    
})

server.listen(port, () => {
    console.log("server is up")
})

