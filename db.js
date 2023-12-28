require('dotenv').config();

let host = process.env.DB_HOST;
let user = process.env.DB_USER;
let password = process.env.DB_PASSWORD;
let database = process.env.DB_DATABASE;
let port = process.env.DB_PORT;


const mysql = require('mysql');

const pool = mysql.createPool({
    host,
    user,
    password,
    database,
    port,
});

const connectDB = (callback) => {
    console.log("DB 연결 시도 중");

    pool.getConnection((err, connection) => {
        if (err) {
            console.log("DB 연결 실패:", err);
            throw err;
        } else {
            console.log("DB 접속 성공");
            callback(connection);
        }
    });
};

module.exports = { connectDB };
