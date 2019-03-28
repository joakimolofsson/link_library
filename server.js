const express = require('express');
const bodyParser = require('body-parser');
const dotEnv = require('dotenv');
const cors = require('cors');
const mongoDb = require('./config/db');
const api = require('./routes/api');
const path = require('path');

dotEnv.config();
mongoDb();

const app = express(),
port = process.env.PORT || 3001;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());
app.use('/api', api);

if(process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

app.listen(port, () => {
    console.log(`Server on port: ${port}`);
});