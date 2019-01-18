const app = require('express')();
const http = require('http').Server(app);
//const server = require('http').createServer(app);
//const io = require('socket.io')(server);
const io = require('socket.io')(http);

//io.on('connection', client => { console.log('client:', typeof(client), client); console.log('got a connection'); });
//io.listen(3000);

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
    console.log('a user connected');
});
  
  
http.listen(3001, () => { console.log('listening on port 3001'); });