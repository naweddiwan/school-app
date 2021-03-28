// * Third party dependencies
const express   = require('express');
const config    = require('config');
const logger    = require('morgan');
const https     = require('https');
const http      = require('http');
const fs        = require('fs');

// * Import modules
const dbClient  = require('./routes/utils/dbHandler').dbClient;

// * Global variables and config.
const app = express();
const port = config.get('port');
const httpPort = config.get('http');

app.use(logger('dev'));

// * API to test database connection and server life.
app.get('/ping', async function (req, res) {
    const result = await dbClient(`SELECT 1 FROM tb_students`, []);
    const response = {
        pong: true,
        dbStatus: result[0]["1"]
    };
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