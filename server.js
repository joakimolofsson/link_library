import express from 'express';
import bodyParser from 'body-parser';
import dotEnv from 'dotenv';
import cors from 'cors';
import mongoDb from './config/db';
import api from './routes/api';

dotEnv.config();
mongoDb();

const app = express(),
port = process.env.port || 3001;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());
app.use('/api', api);

app.listen(port, () => {
    console.log(`Server on port: ${port}`);
});