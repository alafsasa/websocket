const express = require('express');
const WebSocket = require('ws');
const app = express();
const port = 3000;
const path = require('path');
const parse = require('url-parse');

//users
const users = {
    1: 'a1',
    2: 'b2',
    3: 'c3'
};

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

//generate unique ids

//var t = 0;
//what should a websocket do on connection
wsServer.on('connection', (ws, req)=>{
    //console.log(ws);
    //what to do on msg event
    const params = parse(req.url, true);
    console.log(params.query.myCustomID);
    ws.id = params.query.myCustomID;
    ws.on('message', (msg)=>{
        //console.log(JSON.parse(msg).to);
        wsServer.clients.forEach((client)=>{
            //check if client is ready
            if(client.readyState === WebSocket.OPEN){
                console.log('clientid: ' + client.id)
                //console.log(client.id[0])
                //client.send(msg.toString());
                if(client.id === JSON.parse(msg).to){
                    client.send(msg.toString());
                }
            }
        });
        //ws.send(msg.toString())
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