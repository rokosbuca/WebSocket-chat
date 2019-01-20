/**
 * 
 * @author rsb
 */
'use strict';

const app = require('express')();
const bodyParser = require('body-parser');
const http = require('http').Server(app);
//const server = require('http').createServer(app);
//const io = require('socket.io')(server);
const io = require('socket.io')(http);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

// init controller
// first, enable access from webapp
const apiControllerPath = '/api';
const allowCrossDomain = (req, res, next) => {
    res.header('Accept', '*');
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    return next();
};
app.use(apiControllerPath, allowCrossDomain);
// link controller
const apiController = require('./controller/routes')(apiControllerPath, app);

// init sockets
io.on('connection', (client) => {
    client.on('user connected to chatroom', (uac) => {
        console.log('user ' + uac.userId + ' connected to chatroom ' + uac.chatroomId);
    });
});

//io.on('connection', client => { console.log('client:', typeof(client), client); console.log('got a connection'); });
//io.listen(3000);

/*
app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});
*/

const ChatroomService = require('./cluster/chatroom-cluster-service');

// socket handlers 1, 2 and 3
//
// Handles updates regarding list of chatrooms, as displayed to the users on the homepage
// 1) creating new channel
io.on('connection', (client) => {
    client.on('newChatroomCreated', (chatroomId) => {
        console.log('Chatroom "' + chatroomId + '" was created.');
        ChatroomService.getChatroom(chatroomId)
        .then((chatroomObject) => {
            io.emit('chatroomListUpdated', chatroomObject);
        })
        .catch((error) => {
            console.log('Error while getting chatroom ' + chatroomId + '. Error message:', error);
        });
    });
});
// 2) new user connected to chatroom
// 3) new message was sent in a chatroom

io.on('connection', (client) => {
    client.on('subscribeToTimer', (interval) => {
        console.log('client is subscribing to timer with interval', interval);
        setInterval(() => {
            client.emit('timer', new Date());
        }, interval);
    });
});
  
io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
});

io.on('connection', (socket) => {
    socket.on('chat message', (msg) => {
        console.log('message: ' + msg);
    });
});

io.on('connection', function(socket){
    socket.on('chat message', function(msg){
        io.emit('chat message', msg);
    });
});
  
http.listen(3001, () => { console.log('server is listening on port 3001'); });
