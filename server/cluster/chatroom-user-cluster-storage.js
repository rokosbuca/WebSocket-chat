/**
 * 
 * @author rsb
 */
'use strict';

// cluster client
const clusterClient = require('./cluster-client').getClient();

// chatroom hash map's name
const map = 'chatrooms:users';

// contains data as follows
//      "chatroom:users" "chatroom1" "user1;user2;user3;user4"
//      "chatroom:users" "chatroom2" "user1;user2;user3;user4"
//      "chatroom:users" "chatroom3" "user1;user2;user3;user4"

const connectChatroomUser = (chatroom, user) => {
    return new Promise((resolve, reject) => {
        clusterClient._hget(map, chatroom)
        .then((users) => {
            const newUserList = (users ? users + ';' + user : user);
            clusterClient._hset(map, chatroom, newUserList)
            .then(() => {
                resolve();
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

const disconnectChatroomUser = (chatroom, user, isAdmin) => {
    return new Promise((resolve, reject) => {
        if (isAdmin) {
            clusterClient._hdel(map, chatroom)
            .then(() => {
                resolve();
            })
            .catch((error) => {
                reject(error);
            });
        } else {
            clusterClient._hget(map, chatroom)
            .then((users) => {
                const userList = users.split(';');
                const remainingUsersList = [];

                userList.forEach((userInList) => {
                    if (user !== userInList) {
                        remainingUsersList.push(userInList);
                    }
                });

                let remainingUsersString = '';
                for (let i = 0; i < remainingUsersList.length; i++) {
                    if (i !== 0) {
                        remainingUsersString += ';';
                    }

                    remainingUsersString += remainingUsersList[i];
                }
                clusterClient._hset(map, chatroom, remainingUsersString)
                .then(() => {
                    resolve();
                })
                .catch((error) => {
                    reject(error);
                });
            })
            .catch((error) => {
                reject(error);
            });
        }
    });
}

const countUsers = (chatroom) => {
    return new Promise((resolve, reject) => {
        clusterClient._hget(chatroom)
        .then((users) => {
            resolve(users.split(';').length);
        })
        .catch((error) => {
            reject(error);
        });
    });
}

const countUsersForAllChatrooms = () => {
    return new Promise((resolve, reject) => {
        const chatroomNames = [];
        const countUsersPromises = [];

        clusterClient._hkeys(map)
        .then((chatrooms) => {
            chatrooms.forEach((chatroom) => {
                chatroomNames.push(chatroom);
                countUsersPromises.push(countUsers(chatroom));
            });

            Promise.all(countUsersPromises)
            .then((counts) => {
                const chatroomUserCount = [];
                for (let i = 0; i < counts.length; i++) {
                    chatroomUserCount.push({
                        chatroom: chatroomNames[i],
                        userCount: counts[i]
                    });
                }

                resolve(chatroomUserCount);
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

const userExists = (chatroom, user) => {
    return new Promise((resolve, reject) => {
        clusterClient._hget(map, chatroom)
        .then((users) => {
            users.forEach((existingUser) => {
                if (user === existingUser) {
                    resolve(true);
                }
            });

            resolve(false);
        })
        .catch((error) => {
            reject(error);
        });
    });
}

module.exports = {
    connectChatroomUser,
    disconnectChatroomUser,
    countUsers,
    countUsersForAllChatrooms,
    userExists
}