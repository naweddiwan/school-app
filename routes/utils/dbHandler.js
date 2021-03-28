const mysql     = require('mysql2');
const config    = require('config');
const Promise   = require('bluebird');

exports.dbClient = dbClient;

let dbConnectionsPool;

const dbPoolConfig = {
    host:               config.get('dbPoolSettings.host'),
    user:               config.get('dbPoolSettings.user'),
    password:           config.get('dbPoolSettings.password'),
    database:           config.get('dbPoolSettings.database'),
    connectionLimit:    config.get('dbPoolSettings.connectionLimit')
};

function initializePool(dbPoolConfig) { 
    console.log('::::::::::::::: CREATING DB CONNECTION POOL');
    console.log('');
    dbConnectionsPool = mysql.createPool(dbPoolConfig);
    console.log('::::::::::::::: SUCCESS DB POOL CONNECTION ');
}

initializePool(dbPoolConfig);

async function dbClient(query, values) {
    return new Promise((resolve, reject) => {
        let finalQuery = dbConnectionsPool.query(query, values, function (error, result, fields) {
            if (error) {
                return reject(error);
            }
            console.log('');
            console.log("::::::::::QUERY::::::::::");
            console.log(finalQuery.sql);
            console.log('');
            console.log('::::::QUERY RESULT:::::::');
            console.log(result);
            console.log('');
            return resolve(result);
        });
    });
}