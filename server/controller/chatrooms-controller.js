/**
 * 
 * @author rsb
 */
'use strict';

// router
const router = require('express').Router();

// mapping
const mapping = '/chatrooms';

// cluster service
const chatroomService = require('../cluster/chatroom-cluster-service');

const getChatroomList = (req, res) => {
    chatroomService.getChatroomsList()
    .then((chatrooms) => {
        return res.status(200).json({ chatrooms: chatrooms });
    })
    .catch((error) => {
        console.log('Error while accessing GET api/chatrooms. Error message:', error);
        return res.status(500).send('Unexpected server error while fetching chatrooms.');
    });
}

const createNewChatroom = (req, res) => {
    chatroomService.createChatroom(req.body.chatroom)
    .then((initMessages) => {
        return res.status(200).json({
            'chatroom': {
                'chatroom': req.body.chatroom.chatroom,
                'password': req.body.chatroom.password,
                'createdAt': req.body.chatroom.createdAt,
                'createdBy': req.body.chatroom.createdBy,
                'initMessages': initMessages
            }
        });
    })
    .catch((error) => {
        console.log('Error while accessing POST api/chatrooms. Error message:', error);
        return res.status(500).send('Unexpected server error while creating chatroom ' + chatroom + '.');
    });
}

router.get(mapping,
    getChatroomList
);

router.post(mapping,
    createNewChatroom
);


module.exports = {
    router
}
