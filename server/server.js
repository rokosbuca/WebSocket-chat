const WebSocket = require('isomorphic-ws')

const ws = new WebSocket('wss://echo.websocket.org/', {
  origin: 'https://localhost:3001'
});

ws.onopen = function open() {
  console.log('connected');
  ws.send(Date.now());
};

ws.onclose = function close() {
  console.log('disconnected');
};

ws.onmessage = function incoming(data) {
  console.log(`Roundtrip time: ${Date.now() - data} ms`);

  setTimeout(function timeout() {
    ws.send(Date.now());
  }, 500);
};
