let express = require('express');
let app = express();
let cors = require('cors')
let server = require('http').createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

let port = process.env.PORT || 8080;

app.use(cors({
  origin: '*'
}));


let rooms = []

app.get("/room", (req, res) => {
  res.send(rooms[req.body]);
});

app.post("/room", (req, res) => {
  rooms.push(req.body);
  res.json(rooms.length + 1000);
});

io.on("connection", socket => {
  socket.on("tic-update", room => {
    rooms[room.id - 1000] = room.board;
    io.emit("tic-update-" + room.id, { id: room.id, board: rooms[room.id - 1000] });
  });
});

server.listen(port, () => {
  console.log('listening on *:3000');
});