const MODULE_NAME = 'app';

// * Third party dependencies
const httpLogger    = require('morgan');
const express       = require('express');
const config        = require('config');
const https         = require('https');
const http          = require('http');
const fs            = require('fs');

// * Import modules
const dbClient  = require('./routes/utils/dbHandler').dbClient;
const logger    = require('./routes/utils/logger');

// * Global variables and config.
const app       = express();
const port      = config.get('port');
const httpPort  = config.get('http');


// * Middlewares 
app.use(express.json());
app.use(httpLogger('dev'));

// * Print detailed warning messages from node
process.on('warning', (warning) => {
    console.warn(warning.name);    // Print the warning name
    console.warn(warning.message); // Print the warning message
    console.warn(warning.stack);   // Print the stack trace
});

// * API to test database connection and server life.
app.get('/ping', async function (req, res) {
    const recieverInfo = {
        baseModule          : MODULE_NAME,
        currentModule       : MODULE_NAME,
        baseApi             : '/ping',
        currentProcessor    : 'ping',
        level               : 0
    };

    const result = await dbClient(recieverInfo, `SELECT 1 as life FROM tb_students`, [], 'Testing system life!');
    const response = {
        pong: true,
        dbStatus: result[0]['life']
    };
    await logger.track(recieverInfo, {EVENT: 'Testing system life!'}, {RESPONSE_SENT: response});
    return res.send(response);
});

// * Routes and their directories.
const students      = require('./routes/students/index');
const teachers      = require('./routes/teachers/index');

app.use('/student',         students);
app.use('/teacher',         teachers);



const options = {
    key   : fs.readFileSync(__dirname + '/certs/localhost.key'),
    cert  : fs.readFileSync(__dirname + '/certs/localhost.crt'),
    ca    : fs.readFileSync(__dirname + '/certs/localhost.pem', 'utf-8')
};

http.createServer(app).listen(httpPort,() => {
    console.log('');
    console.log('::::::::::::::: Running HTTP Server on port:', httpPort);
});
https.createServer(options, app).listen(port, () => {
    console.log('');
    console.log('::::::::::::::: Running HTTPS Server on port:', port);
    console.log('');
});