/**
 * 
 * @author rsb
 */
'use strict';

// router
const router = require('express').Router();

// mapping
const mapping = '/rooms';

// cluster storage
const chatroomStorage = require('../cluster/chatroom-cluster-storage');

const getChatRoomList = (req, res) => {
    return res.status(200).json({
        'message': 'GET ' + mapping,
        'req.query': req.query,
        'req.params': req.params,
        'req.body': req.body,
        'chatrooms': [
            'chatroom 1',
            'ChatRoom 2',
            'Chat room 3',
            'Chat Room 4'
        ]
    });
}

router.get(mapping,
    getChatRoomList
);

module.exports = {
    router
}