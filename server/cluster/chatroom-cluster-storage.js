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
    clusterClient._hset(map, chatroomName, chatroomInfo);
}

/**
 * Gets a list of all chatrooms with their info
 * 
 * @returns {Array} An array of chatroom info objects. Attributes: name, password, createdAt, createdBy.
 */
const getChatRooms = () => {
    const chatrooms = [];

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
            chatroomInfos.forEach((chatroomInfo) => {
                const chatroom = {};
                const chatroomSnippets = chatroomInfo.split(';');

                chatroom.name = chatroomSnippets.name;
                chatroom.password = (chatroomSnippets.password ? chatroomSnippets.password : "");
                chatroom.createdAt = chatroomSnippets.createdAt;
                chatroom.createdBy = chatroomSnippets.createdBy;

                chatrooms.push(chatroom);
            });

            return chatrooms;
        })
        .catch((error) => {
            throw error;
        });
    })
    .catch((error) => {
        throw error;
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

    clusterClient._hget(map, chatroomName)
    .then((chatroomInfo) => {
        const chatroomSnippets = chatroomInfo.split(';');

        chatroom.name = chatroomSnippets.name;
        chatroom.password = (chatroomSnippets.password ? chatroomSnippets.password : "");
        chatroom.createdAt = chatroomSnippets.createdAt;
        chatroom.createdBy = chatroomSnippets.createdBy;

        return chatroom;
    })
    .catch((error) => {
        throw error;
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
    clusterClient._hexists(map, chatroomName)
    .then((exists) => {
        return exists;
    })
    .catch((error) => {
        throw error;
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
    clusterClient._hget(map, chatroomName)
    .then((chatroomInfo) => {
        if (!chatroomInfo) {
            // chatroom not found, always return false in that case
            return false;
        }

        if (chatroomInfo.split(';')[1] === "") {
            // password not defined, always return true in that case
        }

        return chatroomInfo.split(';')[1] === password;
    })
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
    clusterClient._hget(map, chatroomName)
    .then((chatroomInfo) => {
        if (!chatroomInfo) {
            // chatroom not found, always return false in that case
            return false;
        }

        return chatroomInfo.split(';')[3] === username;
    })
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
