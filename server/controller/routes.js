/**
 * 
 * @author rsb
 */
'use strict';

// controllers
const chatroomController = require('./chatroom-controller');

module.exports = (app, path) => {
    
    app.use(path, chatroomController.router);

}