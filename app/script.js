//Websocket variables
const url = "ws://localhost:3000?myCustomParam=1234&myCustomID=a1"
const mywsServer = new WebSocket(url);

//DOM Elements
const myMessages = document.getElementById("messages");
const myInput = document.getElementById("message");
const sendBtn =document.getElementById("send");
const userID = document.getElementById("uniqid");
const sendTo = document.getElementById("toid");

sendBtn.disabled = true;
sendBtn.addEventListener("click", sendMsg, false);

//sending message from client
function sendMsg(){
    const text = myInput.value;
    const uid = userID.value;
    const sendId = sendTo.value;
    const sms = {
        to: sendId,
        from: uid,
        messageBody: text
    }
    console.log(JSON.stringify(sms));
    msgGeneration(text, "Client");
    mywsServer.send(JSON.stringify(sms));
}

function msgGeneration(msg, from){
    const newMessage = document.createElement("h5");
    newMessage.innerText = `${from} says: ${msg}`;
    myMessages.appendChild(newMessage);
}

//enabling send message when connection is open
mywsServer.onopen = () => {
    sendBtn.disabled = false;
    console.log('connection established');
}

//handling message event
mywsServer.onmessage = (e) => {
    const { data } = e;
    msgGeneration(data, "Server");
    //console.log('Message received', e, e.data);
}

//handle errors
//mywsServer.onerror((e)=>{
//    console.log('Websocket Error: ', e);
//    //write a custom error handling func
//    //errors also cause connections to close
//});
//
////close connections
//mywsServer.onclose((e)=>{
//    console.log('Connection closed', e);
//});

