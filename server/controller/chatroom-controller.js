/**
 * 
 * @author rsb
 */
'use strict';

// router
const router = require('express').Router();

// mapping
const mapping = '/chatrooms/:chatroomId';

// cluster storage
const chatroomStorage = require('../cluster/chatroom-cluster-storage');

const getChatroomInfo = (req, res) => {
    // get chatroom info
    chatroomStorage.getChatRoomInfo(req.params.chatroomId)
    .then((chatroomInfo) => {
        return res.status(200).json({ chatroom: chatroomInfo });
    })
    .catch((error) => {
        console.log('Error while accessing GET api/chatrooms/:chatroomId endpoint. Error message:', error);
        return res.status(500).send('Unxpected server error while fetching info for chatroom ' + req.params.chatroomId);
    })

}

const exitChatroom = (req, res) => {
    // exit chatroom
    // delete chatroom if the admin is the one to exit
}

router.get(mapping,
    getChatroomInfo
);

router.delete(mapping,
    exitChatroom
);


module.exports = {
    router
}
