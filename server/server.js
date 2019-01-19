/**
 * 
 * @author rsb
 */
'use strict';

const app = require('express')();
const http = require('http').Server(app);
//const server = require('http').createServer(app);
//const io = require('socket.io')(server);
const io = require('socket.io')(http);

// init controller
const apiControllerPath = '/api';
const allowCrossDomain = (req, res, next) => {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
};
app.use(apiControllerPath, allowCrossDomain);
const apiController = require('./controller/routes')(apiControllerPath, app);

//io.on('connection', client => { console.log('client:', typeof(client), client); console.log('got a connection'); });
//io.listen(3000);

/*
app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});
*/

io.on('connection', function(socket){
    console.log('a user connected');
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
  
http.listen(3001, () => { console.log('listening on port 3001'); });