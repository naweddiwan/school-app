const express         = require('express');
const app             = express.Router();

const registration        = require('./registration');

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 
    (req.headers['access-control-request-headers'] ? req.headers['access-control-request-headers'] : 'Content-Type'));
    next();
});

/**
 * * Student Specific APIs
 */
app.post('/register',       registration.register);


module.exports = app;