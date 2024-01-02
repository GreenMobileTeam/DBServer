require('dotenv').config();

let host = process.env.DB_HOST;
let user = process.env.DB_USER;
let password = process.env.DB_PASSWORD;
let database = process.env.DB_DATABASE;
let port = process.env.DB_PORT;

const mysql = require('mysql');
const util = require('util');
const session = require('express-session');
const mySqlStore = require('express-mysql-session')(session);

const pool = mysql.createPool({
    connectionLimit: 10,
    host,
    user,
    password,
    database,
    port,
});

const query = util.promisify(pool.query).bind(pool);

const connectDB = async () => {
    console.log("DB 연결 시도 중");
    
    try {
        const connection = await query('SELECT 1');
        console.log("DB 접속 성공");
        return connection;
    } catch (err) {
        console.log("DB 연결 실패:", err);
        throw err;
    }
};


const sessionStore = new mySqlStore({
  host,
  user,
  password,
  database,
  port,
});

module.exports = { connectDB, query, sessionStore };


