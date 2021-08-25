const express = require('express');
const { emit } = require('process');
const app = express();
const server = require('http').Server(app);
const { v4: uuidv4 } = require('uuid');
const io = require('socket.io')(server)

app.set('view engine', 'ejs');
app.use(express.static('public'))

app.get('/', (req, res)=>{
    res.redirect(`/${uuidv4()}`);
})
app.get("/full", (req, res)=>{
    res.send("full")
})
app.get('/:room', (req, res)=>{
    res.render('room', { roomId: req.params.room});
})


io.on('connection', socket => {
    socket.on('join-room', (roomId) => {
        let notallowed = false;
        if (!io.sockets.adapter.rooms[roomId])
            socket.join(roomId);
        else{
            if(io.sockets.adapter.rooms[roomId].length<2){
                socket.join(roomId);
            }
            else
                notallowed = true;
        }

        if(!notallowed){

            socket.on("show-state", white=>{
                socket.to(roomId).broadcast.emit('user-state', white);
            })

            socket.to(roomId).broadcast.emit('user-connected', socket.id);
            if(io.sockets.adapter.rooms[roomId].length==2){
                io.in(roomId).emit('ready');
            }

            socket.on("move", (from, index, moves)=>{
                socket.to(roomId).broadcast.emit('new-move', from, index, moves);
            })

            socket.on('disconnect', () => {
                socket.to(roomId).broadcast.emit('user-disconnected', socket.id);
            });

        }else{
            socket.emit("full");
        }
    })

})

  


const PORT = process.env.PORT||3030
server.listen(PORT, ()=>{
	console.log("running on port: "+PORT);
})
