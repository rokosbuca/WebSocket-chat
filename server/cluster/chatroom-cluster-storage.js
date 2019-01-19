/**
 * A Redis storage containing basic info about chatrooms.
 * 
 * Basic info:
 *  - chatroom name
 *  - chatroom password ("" if none exists)
 *  - created at time
 *  - created by
 * 
 * Model is saved to a hash map with the map name of 'chatrooms:info'
 * Hash map's keys are chatrooms' names. Chatroom name is still saved to
 * info string redundantly.
 * 
 * Model is initialized at chatroom creation time and cannot be changed.
 * 
 * This model is used to show a list of chatrooms to the user on the Homepage.
 * 
 * Module exports all functions necessary for manipulating basic chatroom info.
 * 
 * @author rsb
 */
'use strict';

// cluster client
const clusterClient = require('./cluster-client').getClient();

// chatroom hash map's name
const map = 'chatrooms:info';

/**
 * Creates a new chatroom. Initializes it with basic info and puts it on redis.
 * 
 * @param {String} chatroomName - Name of the chatroom 
 * @param {String} chatroomPassword - Password, if exists
 * @param {String} createdAtTime - Defines a time at which the chatroom was created
 * @param {String} createdByUser - User who created this chatroom
 * 
 * @returns {String} Forwards the result of the redis client's hset method
 */
const createChatRoom = (chatroomName, chatroomPassword, createdAtTime, createdByUser) => {
    const chatroomInfo = chatroomName + ';' + chatroomPassword + ';' + createdAtTime + ';' + createdByUser;

    return new Promise((resolve, reject) => {
        clusterClient._hset(map, chatroomName, chatroomInfo)
        .then((result) => {
            resolve(result);
        })
        .catch((error) => {
            reject(error);
        })
    })
}

/**
 * Gets a list of all chatrooms with their info
 * 
 * @returns {Array} An array of chatroom info objects. Attributes: name, password, createdAt, createdBy.
 */
const getChatRooms = () => {
    const chatrooms = [];

    return new Promise((resolve, reject) => {
        clusterClient._hkeys(map)
        .then((chatroomNames) => {
            const getPromises = [];
    
            chatroomNames.forEach((chatroomName) => {
                getPromises.push(
                    clusterClient._hget(map, chatroomName)
                );
            });
    
            Promise.all(getPromises)
            .then((chatroomInfos) => {
                console.log(chatroomInfos);
                chatroomInfos.forEach((chatroomInfo) => {
                    const chatroom = {};
                    const chatroomSnippets = chatroomInfo.split(';');
    
                    chatroom.name = chatroomSnippets[0];
                    chatroom.password = (chatroomSnippets[1] ? chatroomSnippets[1] : "");
                    chatroom.createdAt = chatroomSnippets[2];
                    chatroom.createdBy = chatroomSnippets[3];
    
                    chatrooms.push(chatroom);
                });
    
                resolve(chatrooms);
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

/**
 * Retrieves chat's room info from redis.
 * 
 * @param {String} chatroomName - Chatroom's name.
 * 
 * @returns {Object} Chat room info object containing attributes: name, password, createdAt, createdBy.
 */
const getChatRoomInfo = (chatroomName) => {
    const chatroom = {};

    return new Promise((resolve, reject) => {
        clusterClient._hget(map, chatroomName)
        .then((chatroomInfo) => {
            const chatroomSnippets = chatroomInfo.split(';');
    
            chatroom.name = chatroomSnippets.name;
            chatroom.password = (chatroomSnippets.password ? chatroomSnippets.password : "");
            chatroom.createdAt = chatroomSnippets.createdAt;
            chatroom.createdBy = chatroomSnippets.createdBy;
    
            resolve(chatroom);
        })
        .catch((error) => {
            reject(error);
        });
    });
}

/**
 * Checks if chatroom with provided name already exists on redis.
 * 
 * @param {String} chatroomName - Chatroom's name.
 * 
 * @returns {boolean} True if chatroom with a provided name already exists, false otherwise.
 */
const chatroomExists = (chatroomName) => {
    return new Promise((resolve, reject) => {
        clusterClient._hexists(map, chatroomName)
        .then((exists) => {
            resolve(exists);
        })
        .catch((error) => {
            reject(error);
        });
    });
}

/**
 * Checks if the chatroom with the same as provided chatroom name already exists.
 * 
 * @param {String} chatroomName - Chatroom's name.
 * 
 * @returns {boolean} True if chatroom with a provided name already exists, false otherwise.
 */
const isChatroomNameTaken = (chatroomName) => {
    return chatroomExists(chatroomName);
}

/**
 * Checks if the provided password for entering the chatroom is correct.
 * 
 * @param {String} chatroomName - Chatroom's name.
 * @param {String} password - User provided password to be checked agains already saved password on redis.
 * 
 * @returns {boolean} True if the provided password is correct, false otherwise. Always true if chatroom 
 *      with the provided name doesn't have a password. Always false if the chatroom with the provided 
 *      name doesn't exist.
 */
const checkPassword = (chatroomName, password) => {
    return new Promise((resolve, reject) => {
        clusterClient._hget(map, chatroomName)
        .then((chatroomInfo) => {
            if (!chatroomInfo) {
                // chatroom not found, always return false in that case
                resolve(false);
            }

            if (chatroomInfo.split(';')[1] === "") {
                // password not defined, always return true in that case
                resolve(true);
            }

            resolve(chatroomInfo.split(';')[1] === password);
        })
        .catch((error) => {
            reject(error);
        })
    });
}

/**
 * Checks if the user has admin privileges in a given chatroom.
 * 
 * @param {String} chatroomName - Chatroom's name.
 * @param {String} username - User's username.
 * 
 * @returns {boolean} True if the user has admin privileges, false otherwise. 
 */
const isUserAdmin = (chatroomName, username) => {
    return new Promise((resolve, reject) => {
        clusterClient._hget(map, chatroomName)
        .then((chatroomInfo) => {
            if (!chatroomInfo) {
                // chatroom not found, always return false in that case
                resolve(false);
            }

            resolve(chatroomInfo.split(';')[3] === username);
        })
        .catch((error) => {
            reject(error);
        });
    });
}


module.exports = {
    createChatRoom,
    getChatRooms,
    getChatRoomInfo,
    chatroomExists,
    isChatroomNameTaken,
    checkPassword,
    isUserAdmin
}
