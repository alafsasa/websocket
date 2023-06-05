const express = require('express');
const WebSocket = require('ws');
const app = express();
const port = 3000;
const path = require('path');

app.use("/", express.static(path.resolve(__dirname, "app")));

app.get('/test', (req, res)=>{
    res.send("This is a test");
});

//regular http server using node express
const myServer = app.listen(port, ()=>{
    console.log(`App listening to port ${port}`);
});

//websocket server
const wsServer = new WebSocket.Server({
    noServer: true
});

//what should a websocket do on connection
wsServer.on('connection', (ws)=>{
    //what to do on msg event
    ws.on('message', (msg)=>{
        wsServer.clients.forEach((client)=>{
            //check if client is ready
            if(client.readyState === WebSocket.OPEN){
                client.send(msg.toString());
            }
        });
    });
});

//handle http to websocket upgrade\
myServer.on('upgrade', async (request, socket, head)=>{
    //accepts half req and rejects half. Reload browser pager in case of rejection
    if(Math.random() > 0.5){
        //proper connection close in case of rejection
        return socket.end("HTTP/1.1 401 Unauthorized\r\n", "ascii");
    }
    //emit connection when req accepted
    wsServer.handleUpgrade(request, socket, head, (ws)=>{
        wsServer.emit('connection', ws, request);
    });
});