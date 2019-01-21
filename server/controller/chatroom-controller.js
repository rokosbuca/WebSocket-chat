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

const connectUser = (req, res) => {
    /** 
     * req.body.joinChatroomData = {
     *     - chatroom
     *     - user
     * }
     */

    console.log('POST api/charooms/' + req.body.chatroom.chatroom);
    console.log('recieved data', req.body.chatroom);
    chatroomService.userConnected(req.body.chatroom.chatroom, req.body.chatroom.user)
    .then((message) => {
        console.log('User ' + req.body.chatroom.user + ' connected. Generated message:\n\t' + message);
        res.status(200).send();
    })
    .catch((error) => {
        console.log('ERROR POST api/chatrooms/' + req.body.chatroom.chatroom + ' Error message:', error);
        return res.status(500).send();
    })
}

const addMessage = (req, res) => {
    /**
     * req.body.chatroom = {
     *  - chatroom
     *  - user
     *  - message
     * }
     */

    chatroomService.addMessage(req.body.chatroom.chatroom, req.body.chatroom.user, req.body.chatroom.message)
    .then((newMessage) => {
        return res.status(200).send();
    })
    .catch((error) => {
        console.log('ERROR PUT api/chatrooms/' + req.body.chatroom.chatroom + ' Error message:', error);
        return res.status(500).send();
    })
}

const disconnectUser = (req, res) => {
    // exit chatroom
    // delete chatroom if the admin is the one who is exit

    chatroomService.userDisconnected(req.body.chatroom.chatroom, req.body.chatroom.user)
    .then((message) => {
        res.status(200).send();
    })
    .catch((error) => {
        console.log('ERROR DELETE api/chatrooms/' + req.body.chatroom.chatroom + ' Error message:', error);
        return res.status(500).send();
    })
}


router.get(mapping,
    getChatroom
);

router.post(mapping,
    connectUser
);

router.put(mapping,
    addMessage
);

router.delete(mapping,
    disconnectUser
);


module.exports = {
    router
}
