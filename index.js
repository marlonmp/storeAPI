require('dotenv').config();

const express = require('express');
const app = express();

const cookieParser = require('cookie-parser');

app.use(express.json());

app.use(cookieParser());

app.use(require('./routes'));

const listener = app.listen(
    process.env.SERVER_PORT,
    process.env.SERVER_HOST,

    function() {
        
        const { address, port } = listener.address();

        console.log(`[EVENT] Server start in http://${address}:${port}`);
    }
);