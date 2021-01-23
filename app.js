const express   = require('express');
const config    = require('config');
const logger    = require('morgan');
const https     = require('https');
const http      = require('http');
const fs        = require('fs');


const app = express();
const port = config.get('port');
const httpPort = config.get('http');


app.use(logger('dev'));
app.get('/ping', function (req, res) {
    let response = {
        pong: true
    };
    res.send(response);
});


const students      = require('./routes/students/index');
const teachers      = require('./routes/teachers/index');
app.use('/student',         students);
app.use('/teacher',         teachers);




const options = {
  key: fs.readFileSync(__dirname + '/certs/localhost.key'),
  cert: fs.readFileSync(__dirname + '/certs/localhost.crt'),
  ca: fs.readFileSync(__dirname +'/certs/localhost.pem', 'utf-8')
};

http.createServer(app).listen(httpPort,() => {
    console.log(`***********************************************************************************`);
    console.log(`*************  Running HTTP Server on port ${httpPort} ******************`);
    console.log(`***********************************************************************************`);
});
https.createServer(options, app).listen(port, () => {
    console.log(`***********************************************************************************`);
    console.log(`*************  Running HTTPS Server on port ${port} ******************`);
    console.log(`***********************************************************************************`);

});