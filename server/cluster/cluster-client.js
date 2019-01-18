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

module.exports = {
    getClient
}