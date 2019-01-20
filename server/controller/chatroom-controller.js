/**
 * 
 * @author rsb
 */
'use strict';

// router
const router = require('express').Router();

// mapping
const mapping = '/chatrooms/:chatroomId';

// chatroom cluster service
const chatroomService = require('../cluster/chatroom-cluster-service');

const getChatroom = (req, res) => {
    chatroomService.getChatroom(req.params.chatroomId)
    .then((chatroom) => {
        return res.status(200).json({ chatroom: chatroom });
    })
    .catch((error) => {
        console.log('Error while accessing GET api/chatrooms/:chatroomId endpoint. Error message:', error);
        return res.status(500).send('Unxpected server error while fetching info for chatroom ' + req.params.chatroomId);
    });
}

const newUser = (req, res) => {

}

const exitChatroom = (req, res) => {
    // exit chatroom
    // delete chatroom if the admin is the one to exit
}

router.get(mapping,
    getChatroom
);

router.post(mapping,
    newUser
);

router.delete(mapping,
    exitChatroom
);


module.exports = {
    router
}
