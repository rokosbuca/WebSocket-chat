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

const ChatroomService = require('./cluster/chatroom-cluster-service');

// Homepage specific socket handlers 1 and 2
//
// Handles updates regarding list of chatrooms, as displayed to the users on the homepage.
// 1) creating new channel
io.on('connection', (client) => {
    client.on('new chatroom created', (chatroomId) => {
        console.log('Chatroom "' + chatroomId + '" was created. Updating Homepage...');
        ChatroomService.getChatroom(chatroomId)
        .then((chatroomObject) => {
            io.emit('chatroomListAppended', chatroomObject);
        })
        .catch((error) => {
            console.log('Error while getting chatroom ' + chatroomId + '. Error message:', error);
        });
    });
});
// 2) new user connected to chatroom or a new message was send in a chatroom
// temp solution, cluster service necessary for updating a single chatroom item on the homepage already exists
io.on('connection', (client) => {
    client.on('update homepage', (chatroomId) => {
        ChatroomService.getChatroomsList()
        .then((chatrooms) => {
            console.log('Chatroom "' + chatroomId + '" updated. Updating Homepage...');
            io.emit('chatroomListUpdated', chatrooms);
        })
        .catch((error) => {
            console.log('Error while getting chatrooms. Error message:', error);
        });
    });
});

// timer dedicated listener
// for keeping the track of the server time among all users, all across the world
io.on('connection', (client) => {
    client.on('subscribeToTimer', (interval) => {
        console.log('client is subscribing to timer with interval', interval);
        setInterval(() => {
            client.emit('timer', new Date());
        }, interval);
    });
});

// update messages in chatroom event
// notifies the server that the new message has been created
// emit new message history to a chatroom
io.on('connection', (client) => {
    client.on('update messages in chatroom', (chatroom) => {
        ChatroomService.getChatroom(chatroom.chatroom)
        .then((chatroomData) => {
            io.emit('update messages in chatroom ' + chatroomData.chatroom, chatroomData.messages);
        })
        .catch((error) => {
            console.log(error);
        });
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
