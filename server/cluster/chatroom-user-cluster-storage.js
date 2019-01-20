/**
 * 
 * @author rsb
 */
'use strict';

// cluster client
const clusterClient = require('./cluster-client').getClient();

const connectChatroomUser = (chatroom, user) => {
    return new Promise((resolve, reject) => {
        clusterClient._hset(chatroom, user, 'active')
        .then(() => {
            resolve();
        })
        .catch((error) => {
            reject(error);
        });
    });
}

const disconnectChatroomUser = (chatroom, user, isAdmin) => {
    return new Promise((resolve, reject) => {
        if (isAdmin) {
            clusterClient._hdelall(chatroom)
            .then(() => {
                resolve();
            })
            .catch((error) => {
                reject(error);
            });
        } else {
            clusterClient._hdel(chatroom, user);
        }
    });
}

const countUsers = (chatroom) => {
    return new Promise((resolve, reject) => {
        clusterClient._hkeys(chatroom)
        .then((keys) => {
            resolve(keys.length);
        })
        .catch((error) => {
            reject(error);
        });
    });
}

const userExists = (chatroom, user) => {
    return new Promise((resolve, reject) => {
        clusterClient._hget(chatroom, user)
        .then((result) => {
            if (result === 'active') {
                resolve(true);
            } else {
                resolve(false);
            }
        })
        .catch((error) => {
            reject(error);
        });
    });
}

module.exports = {
    connectChatroomUser,
    disconnectChatroomUser,
    countUsers,
    userExists
}