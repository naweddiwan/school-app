const MODULE_NAME = 'commonFunctions';

const dbHandler =  require('./dbHandler');
const constants = require('./constants');

// exports.insertData  = insertData;
// exports.updateData  = updateData;
exports.fetchData   = fetchData;

function fetchData(recieverInfo, queryObj){
    const updatedRecieverInfo = Object.assign({}, recieverInfo);
    updatedRecieverInfo.level              += 1;
    updatedRecieverInfo.currentModule      = MODULE_NAME;
    updatedRecieverInfo.currentProcessor   = 'fetchData';

    const tableName     = queryObj.table_name;
    const requiredKeys  = queryObj.required_keys;
    const constraints   = queryObj.constraints;
    const event         = queryObj.event || ('Fetching details from ' + tableName);

    let query = 'SELECT ';
    let values = [];

    for(let key of requiredKeys){
        query += key + ', ';
    }
    query = query.slice(0, -2);
    query += ' FROM ' + tableName + ' WHERE ';

    //* constraints Format:  [[key, value, operator], [key, value],   [key, value, operator], ....]
    for(let constraint of constraints) {
        if(constraint.length < 2){
            throw new Error(constants.errors.INVALID_FORMAT);
        }
        else{
            const key       = constraint[0];
            const value     = constraint[1];
            const operator  = constraint.length == 3 ? constraint[2] : ' = ';
            if(Array.isArray(value)) {
                query += key + ' IN (?) AND ';
            } else {
                query += key + operator +  '? AND ';
            }
            values.push(value); 
        }
    }
    query = query.slice(0, -5);
    return dbHandler.dbClient(updatedRecieverInfo, query, values, event);
}