import express from 'express';
import bodyParser from 'body-parser';
import dotEnv from 'dotenv';
import cors from 'cors';

dotEnv.config();

import mongoDb from './config/db';
mongoDb();

const app = express(),
port = process.env.port || 4000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

import api from './routes/api';
app.use('/api', api);

app.listen(port, () => {
    console.log(`Server on port: ${port}`);
});