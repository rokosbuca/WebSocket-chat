/**
 * 
 * @author rsb
 */
'use strict';

const redis = require('redis');
const redisClient = redis.createClient();

Promise.promisifyAll(require("redis"));

const getClient = () => {
    return redisClient;
}

module.exports = {
    redisClient
}