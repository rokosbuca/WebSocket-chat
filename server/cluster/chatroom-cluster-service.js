/**
 * 
 * @author rsb
 */
'use strict';

// cluster storage modules
const chatroomInfoStorage = require('./chatroom-cluster-storage');
const chatroomUserStorage = require('./chatroom-user-cluster-storage');
const chatroomMsgStorage = require('./chatroom-msg-cluster-storage');

const getChatroomsList = () => {
    // return chatroom as an object containing:
    //      - chatroom
    //      - password
    //      - createdAt
    //      - createdBy
    //      - nUsers
    //      - nMessages

    const chatroomsList = [];

    return new Promise((resolve, reject) => {
        chatroomInfoStorage.getChatRooms()
        .then((chatroomsInfos) => {
            chatroomsInfos.forEach((chatroomInfo) => {
                chatroomsList.push(
                    {
                        chatroom: chatroomInfo.chatroom,
                        password: chatroomInfo.password,
                        createdAt: chatroomInfo.createdAt,
                        createdBy: chatroomInfo.createdBy
                    }
                );
            });

            // get all chatroom-user counts
            // it is in format {ch1: 20, ch2: 4, ch3: 1, ...}
            chatroomUserStorage.countUsersForAllChatrooms()
            .then((chatroomUserCounts) =>{
                chatroomsList.forEach((chatroomObject) => {
                    chatroomObject.nUsers = chatroomUserCounts.chatroom;
                });

                // get all chatroom-messages counts
                const chatroomMessagesCountPromises = [];
                chatroomsList.forEach((chatroomObject) => {
                    chatroomMessagesCountPromises.push(
                        chatroomMsgStorage.countMessages(chatroomObject.chatroom)
                        .then((count) => {
                            chatroomObject.nMessages = count;
                        })
                        .catch((error) => {
                            reject(error);
                        })
                    );
                });
                Promise.all(chatroomMessagesCountPromises)
                    .then(() => {
                        resolve(chatroomsList);
                    })
                    .catch((error) => {
                        reject(error);
                    });
            })
            .catch((error) => {
                reject(error);
            });
        })
        .catch((error) => {
            reject(error);
        });
    });
}

module.exports = {
    getChatroomsList
}