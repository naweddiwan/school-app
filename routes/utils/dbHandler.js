const mysql     = require('mysql2');
const config    = require('config');
const Promise   = require('bluebird');

const logger    = require('./logger');

exports.dbClient = dbClient;
exports.dbClientLogging = dbClientLogging;

let dbConnectionsPool;

const dbPoolConfig = {
    host:               config.get('dbPoolSettings.host'),
    user:               config.get('dbPoolSettings.user'),
    password:           config.get('dbPoolSettings.password'),
    database:           config.get('dbPoolSettings.database'),
    connectionLimit:    config.get('dbPoolSettings.connectionLimit')
};

const dbLoggingPoolConfig = {
    host:               config.get('dbLoggingPoolSetting.host'),
    user:               config.get('dbLoggingPoolSetting.user'),
    password:           config.get('dbLoggingPoolSetting.password'),
    database:           config.get('dbLoggingPoolSetting.database'),
    connectionLimit:    config.get('dbLoggingPoolSetting.connectionLimit')
}

function initializePool(dbPoolConfig) { 
    console.log('::::::::::::::: DB CONNECTION POOL <CREATING>');
    console.log('');
    dbConnectionsPool = mysql.createPool(dbPoolConfig);
    console.log('::::::::::::::: DB CONNECTION POOL <SUCCESS> ');
}

initializePool(dbPoolConfig);

async function dbClient(recieverInfo, query, values, event) {
    return new Promise((resolve, reject) => {
        let finalQuery = dbConnectionsPool.query(query, values, async function (error, result, fields) {
            if (error) {
                await logger.error(recieverInfo, {EVENT: event}, {ERROR: error.message});
                return reject(error);
            }
            await logger.track(recieverInfo, {EVENT: event}, {QUERY: finalQuery.sql}, {RESULT: result});
            return resolve(result);
        });
    });
}

let dbLoggingConnectionsPool = mysql.createPool(dbLoggingPoolConfig);

async function dbClientLogging(query, values) {
    return new Promise((resolve, reject) => {
        let finalQuery = dbLoggingConnectionsPool.query(query, values, function (error, result, fields) {
            if (error) {
                console.error({ERROR: error.message});
                return reject(error);
            }
            return resolve(result);
        });
    });
}