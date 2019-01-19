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
const chatroomMessageStorage = require('../cluster/chatroom-msg-cluster-storage');

const getChatRoomList = (req, res) => {
    const chatroomList = [];

    chatroomStorage.getChatRooms()
    .then((chatrooms) => {
        /**
         * chatroom = {
         *      chatroom
         *      password
         *      createdAt
         *      createdBy
         * }
         */
        chatrooms.forEach((chatroom) => {
            chatroomList.push(chatroom);
        });

        return res.status(200).json({ 'chatrooms': chatroomList });
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

    // create chatroom
    chatroomStorage.createChatRoom(chatroom, password, createdAt, createdBy)
    .then(() => {
        // init chatroom messages
        chatroomMessageStorage.chatroomInitMessage(chatroom, createdAt, createdBy, password)
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
        });
    })
    .catch((error) => {
        console.log('Error while accessing POST api/chatrooms. Error message:', error);
        return res.status(500).send('Unexpected server error while creating chatroom ' + chatroom + '.');
    });
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
