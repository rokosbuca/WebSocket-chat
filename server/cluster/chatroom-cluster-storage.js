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
                chatroom.name = chatroomInfo.name;
                chatroom.password = (chatroomInfo.password ? chatroomInfo.password : "");
                chatroom.createdAt = chatroomInfo.createdAt;
                chatroom.createdBy = chatroomInfo.createdBy;

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
 * @param {String} chatroom - Chatroom's name.
 * 
 * @returns {Object} Chat room info object containing attributes: name, password, createdAt, createdBy.
 */
const getChatRoomInfo = (chatroom) => {

}

/**
 * Checks if chatroom with provided name already exists on redis.
 * 
 * @param {String} chatroom - Chatroom's name.
 * 
 * @returns {boolean} True if chatroom with a provided name already exists, false otherwise.
 */
const chatroomExists = (chatroom) => {

}

/**
 * Checks if the chatroom with the same as provided chatroom name already exists.
 * 
 * @param {String} chatroom - Chatroom's name.
 * 
 * @returns {boolean} True if chatroom with a provided name already exists, false otherwise.
 */
const isChatroomNameTaken = (chatroom) => {

}

/**
 * Checks if the provided password for entering the chatroom is correct.
 * 
 * @param {String} chatroom - Chatroom's name.
 * @param {String} password - User provided password to be checked agains already saved password on redis.
 * 
 * @returns {boolean} True if the provided password is correct, false otherwise. Always true if chatroom 
 *      with the provided name doesn't have a password. Always false if the chatroom with the provided 
 *      name doesn't exist.
 */
const checkPassword = (chatroom, password) => {

}

/**
 * Checks if the user has admin privileges in a given chatroom.
 * 
 * @param {String} chatroom - Chatroom's name.
 * @param {String} user - User's username.
 * 
 * @returns {boolean} True if the user has admin privileges, false otherwise. 
 */
const isUserAdmin = (chatroom, user) => {

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