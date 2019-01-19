/**
 * 
 * @author rsb
 */
'use strict';

// cluster client
const clusterClient = require('./cluster-client').getClient();

const newMessage = (chatroom, timestamp, user, message) => {

}

module.exports = {
    newMessage
}