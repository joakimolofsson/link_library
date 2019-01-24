import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

import db from './config/db';
const mongoDb = async () => {
    try {
        await mongoose.connect(db, { useNewUrlParser: true });
        console.log('MongoDB Connected');
    } catch(err) {
        console.log(`MongoDB Error: ${err}`);
    }
};
mongoDb();

const app = express(),
port = process.env.port || 4000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

import api from './routes/api';
app.use('/api', api);

app.listen(port, () => {
    console.log(`Server on port: ${port}`);
});