/**
 * 
 * @author rsb
 */
'use strict';

// controllers
const chatroomsController = require('./chatrooms-controller');
const chatroomController = require('./chatroom-controller');

module.exports = (path, app) => {
    
    app.use(path, chatroomsController.router);
    app.use(path, chatroomController.router);

}