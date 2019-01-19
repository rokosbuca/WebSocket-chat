/**
 * 
 * @author rsb
 */
'use strict';

// router
const router = require('express').Router();

// mapping
const mapping = '/chatrooms';

// cluster storage
const chatroomStorage = require('../cluster/chatroom-cluster-storage');

const getChatRoomList = (req, res) => {
    // return a list of strings representing chat rooms of this format:
    // "chatroomName;nUsers;nMessages;chatroomAge;hasPassword;adminUsername"
    // sort list by chatroom's age

    const data = [];

    chatroomStorage.getChatRooms()
    .then((chatrooms) => {
        /**
         * chatroom = {
         *      name
         *      password
         *      createdAt
         *      createdBy
         * }
         */
        chatrooms.forEach((chatroom) => {
            data.push(
                chatroom.name + ';' + chatroom.password + ';' + chatroom.createdAt + ';' + chatroom.createdBy
            );
        });

        return res.status(200).json({ 'chatrooms': data });
    })
    .catch((error) => {
        console.log('Error while accessing GET api/chatrooms. Error message:', error);
        return res.status(500).send('Unexpected server error while fetching chatrooms.');
    });
}

router.get(mapping,
    getChatRoomList
);

module.exports = {
    router
}