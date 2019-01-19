/**
 * 
 * @author rsb
 */
'use strict';

// cluster client
const clusterClient = require('./cluster-client').getClient();

const chatroomInitMessage = (chatroom, timestamp, user) => {
    // add two messages when a chatroom is first created
    // 1) User 'username' created chatroom 'chatroom' on 'timestamp'
    // 2) User 'username' connected to chatroom 'chatroom' on 'timestamp'

    const initMessage = 'User ' + user + ' created chatroom ' + chatroom + ' on ' + timestamp;
    
    return new Promise((resolve, reject) => {
        clusterClient._rpush(chatroom, initMessage)
        .then(() => {
            const adminConnectedMessage = 'User ' + user + ' connected to chatroom ' + chatroom + ' on ' + new Date().toLocaleString();
    
            clusterClient._rpush(chatroom, adminConnectedMessage)
            .then((listLenght) => {
                resolve(listLenght)
            })
        })
        .catch((error) => {
            reject(error);
        });
    });
}

const newMessage = (chatroom, timestamp, user, message) => {

}

module.exports = {
    chatroomInitMessage,
    newMessage
}