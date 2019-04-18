const express = require('express');
const bodyParser = require('body-parser');
const dotEnv = require('dotenv');
const mongoDb = require('./config/db');
const path = require('path');

const login = require('./routes/login');
const register = require('./routes/register');
const nav = require('./routes/nav');
const getLinks = require('./routes/getLinks');
const rateLink = require('./routes/rateLink');
const addLink = require('./routes/addLink');
const getProfile = require('./routes/getProfile');
const editProfile = require('./routes/editProfile');


dotEnv.config();
mongoDb();

const app = express(),
port = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());

const address = '/api';
app.use(address, login);
app.use(address, register);
app.use(address, nav);
app.use(address, getLinks);
app.use(address, rateLink);
app.use(address, addLink);
app.use(address, getProfile);
app.use(address, editProfile);

if (process.env.NODE_ENV === 'production') {
    // Serve any static files
    app.use(express.static(path.join(__dirname, 'client/build')));
    // Handle React routing, return all requests to React app
    app.get('*', function(req, res) {
        res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
    });
}

app.listen(port, () => {
    console.log(`Server on port: ${port}`);
});