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
app.use(express.json());


let rooms = []

app.get("/echo/:echoMessage", (req, res) => {
  res.send(`Echo ${req.params.echoMessage}`);
});

app.get("/room/", (req, res) => {
   res.send(rooms);
});

app.get("/room/:id", (req, res) => {
  res.json({id: req.params.id, board: rooms[Number(req.params.id) - 1000]});
});

app.post("/room", (req, res) => {
  rooms.push(req.body.board);
  res.json({id: rooms.length + 999, board: req.body.board});
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
