/**
 * 
 * @author rsb
 */

// router
const router = require('express').Router();

// mapping
const mapping = '/rooms';

const getChatRoomList = (req, res) => {
    return res.status(200).json({
        'message': 'GET ' + mapping,
        'req.query': req.query,
        'req.params': req.params,
        'req.body': req.body
    });
}

router.get(mapping,
    getChatRoomList
);

module.exports = {
    router
}