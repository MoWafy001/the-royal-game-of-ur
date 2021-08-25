var socket = io('/');

var white = true;

socket.on("full",()=>{
    document.location = "/full";
})
socket.on("ready",()=>{
    document.querySelector("#getting-ready").style.display = "none";
    console.log("ready");
})

socket.emit('join-room', ROOM_ID);
socket.on("user-connected",(userId)=>{
    socket.emit("show-state", white);
    console.log(userId, "joined");
})
socket.on("user-state", state=>{
    white = !state;
    p1_turn = true;
})
socket.on("user-disconnected",(userId)=>{
    console.log(userId, "left");
    document.querySelector("#getting-ready").style.display = "block";
    document.querySelector("#getting-ready h1").textContent = "lost connection with the other user";

    p1_pieces = 7;
    p2_pieces = 7;
    p1_end = 0;
    p2_end = 0;

    si = false;

    p1_turn = true;

    waiting = false;
    moves = 0;

    roseta = false;
    board.onBoard = []
})
