/**
 * 
 * @author rsb
 */
'use strict';

// controllers
const chatroomController = require('./chatroom-controller');

module.exports = (path, app) => {
    
    app.use(path, chatroomController.router);

}