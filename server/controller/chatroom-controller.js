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

const createNewChatroom = (req, res) => {
    const chatroom = req.body.chatroom.chatroom;
    const password = req.body.chatroom.password;
    const createdAt = req.body.chatroom.createdAt;
    const createdBy = req.body.chatroom.createdBy;

    chatroomStorage.createChatRoom(chatroom, password, createdAt, createdBy)
    .then(() => {
        return res.status(200).json({
            'chatroom': {
                'chatroom': chatroom,
                'password': password,
                'createdAt': createdAt,
                'createdBy': createdBy
            }
        });
    })
    .catch((error) => {
        console.log('Error while accessing POST api/chatrooms. Error message:', error);
        return res.status(500).send('Unexpected server error while creating chatroom ' + chatroom + '.');
    })
}

router.get(mapping,
    getChatRoomList
);

router.post(mapping,
    createNewChatroom
);


module.exports = {
    router
}
