const mysql     = require('mysql');
const Promise   = require('bluebird');
const moment    = require('moment');
const config    = require('config');

const dbPoolConfig = {
    host: config.get('dbPoolSettings.host'),
    user: config.get('dbPoolSettings.user'),
    password: config.get('dbPoolSettings.password'),
    database: config.get('dbPoolSettings.database'),
    connectionLimit: config.get('dbPoolSettings.connectionLimit'),
    charset : "utf8mb4"
};


let numConnectionsInPool = 0;

function initializePool(dbPoolConfig) {
    
    console.log('CALLING INITIALIZE POOL');
    console.log('');
    let dbConnectionsPool = mysql.createPool(dbPoolConfig);

    dbConnectionsPool.on('connection',  (connection) => {
        numConnectionsInPool++;
        console.log('NUMBER OF CONNECTION IN POOL : ' + numConnectionsInPool);
    });
    return dbConnectionsPool;
}
const dbConnections = initializePool(dbPoolConfig);


const dbHandlerClient = {
    executeQuery :  (queryObj) => {
        return new Promise((resolve, reject) => {
            dbConnections.query(queryObj.query, queryObj.args, (err, result) => {
                console.log(":::QUERY::: ", queryObj.query);
                if(err ){
                    if(err.code === 'ER_LOCK_DEADLOCK' || err.code === 'ER_QUERY_INTERRUPTED'){
                        return setTimeout(() => {
                            dbHandlerClient.executeQuery(handlerInfo, queryObj);
                        }, 50);
                    }
                    return reject(err);
                }
                console.log(":::QUERY RESULT::: ", result);
                return resolve(result);
            });
        });
    }
}

module.exports.dbClient = (function (){
    return dbHandlerClient;
})();
