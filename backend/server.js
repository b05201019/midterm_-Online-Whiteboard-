var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');

var p = 9973;
var m = 5003;

var app = express();
const http = require('http').Server(app)
http.listen(3001, () => {
    console.log('Server side listen at port 3001');
})

var io = require('socket.io')(http);

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers');
    next();
})

app.post('/GET/createRoom', (req, res) => {
     fs.readFile('./Data/Room-manage.json', 'utf8', (err, data) => {
        if(err){console.log(err);}
            else{
                Data = JSON.parse(data);
                const newRoom = {
                    id: ((p*Data.count)%m).toString(),
                    master: req.body.name,
                    member:[] ,
                    chat: [],
                }
                Data.count++;
                Data.count %= m;
                Data.roomList.push({room: newRoom.id});
                fs.writeFile('./Data/Room-manage.json', JSON.stringify(Data), err => {
                    if(err){console.log(err)}
                        else{
                            fs.writeFile(`./Data/Room-${newRoom.id}.json`, JSON.stringify(newRoom), err => {
                                if(err){console.log(err)}
                                    else{res.send(newRoom.id);}
                            })
                        }
                })
            }
    })
})

app.post('/GET/isRoomExist', (req, res) => {
    fs.readFile('./Data/Room-manage.json', 'utf8', (err, data) => {
        if(err){console.log(err)}
            else{
                var Data = JSON.parse(data);
                var bool = Data.roomList.find( e => {
                    return e.room === req.body.roomId;
                })
                console.log(bool);
                res.send((bool === undefined)?'false':'true');
            }
    })
})

io.on('connection', socket => {
    console.log('user connected');

    socket.on('sendMessage', obj => {
        fs.readFile(`./Data/Room-${obj.roomId}.json`, 'UTF-8', (err, data) => {
            if(err){
                console.log(err);
            }else{
                var room = JSON.parse(data);
                var length = room.chat.push({name: obj.name, message: obj.message});
                if(length === 101){room.chat.shift()};
                fs.writeFile(`./Data/Room-${obj.roomId}.json`, JSON.stringify(room), err => {
                    if(err){
                        console.log(err);
                    }else{
                        io.emit(`addMessage/${obj.roomId}`, {name: obj.name, message: obj.message});
                    }
                })
            }
        })
    })

    socket.on('getAllMessage', obj => {
        fs.readFile(`./Data/Room-${obj.roomId}.json`, 'UTF-8', (err, data) => {
            if(err){
                console.log(err);
            }else{
                var room = JSON.parse(data);
                socket.emit(`initAllMessage/${obj.roomId}`, {chat: room.chat});
            }
        })
    })

    // socket.on('addRoom', obj => {
    //     socket.room = obj.roomId;
    //     socket.join(obj.roomId)
    // })

    socket.on('sendMouseData', obj => {
        socket.broadcast.emit(`setMouseData/${obj.roomId}`, obj.toolSet);
    })

    socket.on('drawing', obj => {
        socket.broadcast.emit(`uploadCanvas/${obj.roomId}`, {x: obj.x, y: obj.y});
    })

    socket.on('sendClearCanvas', obj => {
        socket.broadcast.emit(`doClearCanvas/${obj.roomId}`);
    })

    socket.on('disconnecting', () => {

    })
})