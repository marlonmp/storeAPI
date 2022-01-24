require('dotenv').config();

const express = require('express');
const app = express();

const cookieParser = require('cookie-parser');

app.use(express.json());

app.use(cookieParser());

app.use(require('./routes'));

const { SERVER_PORT, SERVER_HOST } = process.env;

const listener = app.listen(
    SERVER_PORT,
    SERVER_HOST,
    
    () => console.log(`[EVENT] Server start in http://${SERVER_HOST}:${SERVER_PORT}`)
);