const express         = require('express');
const app             = express.Router();

const teachers        = require('./registration');


app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Headers", (req.headers['access-control-request-headers'] ? req.headers['access-control-request-headers'] : 'Content-Type'))
    next();
});


module.exports = app;