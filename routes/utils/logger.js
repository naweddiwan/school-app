const chalk = require('chalk');

const dbHandler = require('./dbHandler');
const constants = require('./constants');
const commons   = require('./commonFunctions');

exports.track = track;
exports.error = error;

async function track(/* Arguments */) {
    try{
        if(!arguments[0]){
            throw new Error(constants.errors.INVALID_FORMAT);
        }
        // * Fetch reciever logging details
        const module    = arguments[0]['baseModule'];
        const api       = arguments[0]['baseApi'];
    
        let stmt = `SELECT * FROM tb_modules_api_map WHERE module_name = ? `;
        let [loggingDetails] = await dbHandler.dbClientLogging(stmt, [module]);
        if(!loggingDetails.apis['global'] && !loggingDetails.apis[api]){
            return;
        }

        console.log(chalk.cyan(JSON.stringify(arguments[0], null, 2)));
        for(let i = 1;  i < arguments.length; i++) {
            console.log(JSON.stringify(arguments[i], null, 2));
        }   
        console.log('');
    }
    catch(error){
        console.log(error.message);
    }
}

async function error(/* Arguments */) {
    // * Fetch reciever logging details
    console.log('');
    if(!arguments[0]){
        throw new Error(constants.errors.INVALID_FORMAT);
    }
    console.log(chalk.red(JSON.stringify(arguments[0], null, 2)));
    for(let i = 1;  i < arguments.length; i++) {
        console.log(chalk.red(JSON.stringify(arguments[i], null, 2)));
    }   
    console.log('');
}

