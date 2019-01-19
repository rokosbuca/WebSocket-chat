/**
 * 
 * @author rsb
 */
'use strict';

const redis = require('redis');
const redisClient = redis.createClient();

const bluebird = require('bluebird');
bluebird.promisifyAll(redis);

const getClient = () => {
    return redisClient;
}

// remake redis client's methods with better error checking then add them to redisClient's prototype
const helloworld = () => {
    console.log('Hello world from Redis\' client! Have a nice day!');
}

const _hkeys = (map) => {
    if (!map) {
        console.log('hkeys: Provide map. map=' + map);
        return null;
    }

    return new Promise((resolve, reject) => {
        redisClient.hkeysAsync(map)
        .then((keys) => {
            resolve(keys);
        })
        .catch((error) => {
            console.log('Error while invoking redis client\'s \'hkeys\' method. Error message:', error);
            reject(error);
        })
    });
}

const _hset = (map, field, value) => {
    if (!map || !field || !value) {
        console.log('hset: Provide map, field and value to be set. map=' + map + ' field=' + field + ' value=' + value);
        return null;
    }

    return new Promise((resolve, reject) => {
        redisClient.hsetAsync(map, field, value)
        .then((result) => {
            resolve(result);
        })
        .catch((error) => {
            console.log('Error while invoking redis client\'s \'hset\' method. Error message:', error);
            reject(error);
        });
    });
}

const _hget = (map, field) => {
    if (!map || !field) {
        console.log('hget: Provide map and field. map=' + map + ' field=' + field);
        return null;
    }

    return new Promise((resolve, reject) => {
        redisClient.hgetAsync(map, field)
        .then((value) => {
            resolve(value);
        })
        .catch((error) => {
            console.log('Error while invoking redis client\'s \'hget\' method. Error message:', error);
            reject(error);
        });
    });
}

const _hgetall = (map) => {
    if (!map) {
        console.log('hgetall: Provide map. map=' + map);
        return null;
    }

    return new Promise((resolve, reject) => {
        redisClient.hgetallAsync(map)
        .then((values) => {
            resolve(values);
        })
        .catch((error) => {
            console.log('Error while invoking redis client\'s \'hgetall\' method. Error message:', error);
            reject(error);
        });
    });
}

const _hdel = (map, field) => {
    if (!map || !field) {
        console.log('hdel: Provide map and field. map=' + map + ' field=' + field);
        return null;
    }

    return new Promise((resolve ,reject) => {
        redisClient.hdelAsync(map, field)
        .then((result) => {
            resolve(result);
        })
        .catch((error) => {
            console.log('Error while invoking redis client\'s \'hdel\' method. Error message:', error);
            reject(error);
        });
    })
}

const _hdelall = (map) => {
    if (!map) {
        console.log('hdelall: Provide map. map=' + map);
        return null;
    }

    return new Promise((resolve, reject) => {
        redisClient.hkeysAsync(map)
        .then((keys) => {
            const hdelPromises = [];
            keys.forEach((key) => {
                hdelPromises.push(
                    redisClient.hdelAsync(map, key)
                );
            });

            resolve(Promise.all(hdelPromises));
        })
        .catch((error) => {
            console.log('Error while invoking redis client\'s \'hkeys\' method. It is being called from _hdelall added method of redis client. Error message:', error);
            reject(error);
        });
    });
}

const _hexists = (map, field) => {
    if (!map || !field) {
        console.log('hexists: Provide map and field. map=' + map + ' field=' + field);
        return null;
    }

    return new Promise((resolve, reject) => {
        redisClient.hexistsAsync(map, field)
        .then((exists) => {
            if (parseInt(exists) === 1) {
                resolve(true);
            } else {
                resolve(false);
            }
        })
        .catch((error) => {
            console.log('Error while invoking redis client\'s \'hexists\' method. Error message:', error);
            reject(error);
        });
    });
}

// add newly created methods to redisClient
// helloworld
redisClient.helloworld = helloworld;
// _hkeys, _hset, _hget, _hgetall, _hdel, _hdelall, _hexists
redisClient._hkeys = _hkeys;
redisClient._hset = _hset;
redisClient._hget = _hget;
redisClient._hgetall = _hgetall;
redisClient._hdel = _hdel;
redisClient._hdelall = _hdelall;
redisClient._hexists = _hexists;


module.exports = {
    getClient
}
