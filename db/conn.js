const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    password: '%F_psql214%',
    port: '5432'
});

exports.pool = pool;