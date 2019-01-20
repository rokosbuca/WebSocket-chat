/**
 * 
 * @author rsb
 */
'use strict';

// cluster client
const clusterClient = require('./cluster-client').getClient();

const chatroomInitMessage = (chatroom, timestamp, user, password) => {
    // add two messages when a chatroom is first created
    // 1) User 'username' created chatroom 'chatroom' on ['timestamp']
    // 2) User 'username' connected to chatroom 'chatroom' on ['timestamp']

    const initMessage = 'User "' + user + '" created chatroom "' + chatroom + '" on [' + timestamp
        + (password !== '' ? '] with password "' + password + '" as a private group': '] as a public group');
    
    return new Promise((resolve, reject) => {
        clusterClient._rpush(chatroom, initMessage)
        .then(() => {
            const adminConnectedMessage = 'User "' + user + '" connected to chatroom "' + chatroom + '" on ' + timestamp;//new Date().toLocaleString();
    
            clusterClient._rpush(chatroom, adminConnectedMessage)
            .then(() => {
                resolve([initMessage, adminConnectedMessage]);
            })
        })
        .catch((error) => {
            reject(error);
        });
    });
}

const getMessages = (chatroom) => {
    return new Promise((resolve, reject) => {
        clusterClient._llen(chatroom)
        .then((nMessages) => {
            clusterClient._lrange(chatroom, 0, intParse(nMessages))
            .then((messages) => {
                resolve(messages);
            })
            .catch((error) => {
                reject(error);
            });
        })
        .catch((error) => {
            reject(error);
        });
    });
}

const newMessage = (chatroom, timestamp, user, message) => {
    const newMessage = '[' + timestamp + '] ' + user + ': ' + message;

    return new Promise((resolve, reject) => {
        clusterClient._rpush(chatroom, newMessage)
        .then(() => {
            resolve(newMessage);
        })
        .catch((error) => {
            reject(error);
        });
    });
}

const userConnectedMessage = (chatroom, timestamp, user) => {
    const message = 'User "' + user + '" has disconnected from chatroom "' + chatroom + '" on [' + timestamp + ']';

    return new Promise((resolve, reject) => {
        clusterClient._rpush(chatroom, message)
        .then(() => {
            resolve(message);
        })
        .catch((error) => {
            reject(error);
        });
    });
}

const userDisconnectedMessage = (chatroom, timestamp, user, isAdmin) => {
    const message = (isAdmin ? 'Admin "' : 'User "')
        + user 
        + '" has disconnected from chatroom "' 
        + chatroom + '" on [' + timestamp + ']\n'
        + 'The chatroom is now closed.';

    return new Promise((resolve, reject) => {
        clusterClient._rpush(chatroom, message)
        .then(() => {
            resolve(message);
        })
        .catch((error) => {
            reject(error);
        });
    });
}

module.exports = {
    chatroomInitMessage,
    getMessages,
    newMessage,
    userConnectedMessage,
    userDisconnectedMessage
}