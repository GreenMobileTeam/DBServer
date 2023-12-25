require('dotenv').config();

let host = process.env.DB_HOST;
let user = process.env.DB_USER;
let password = process.env.DB_PASSWORD;
let database = process.env.DB_DATABASE;
let port = process.env.DB_PORT;

const mysql = require('mysql');

const connection = mysql.createConnection({
    host,
    user,
    password,
    port,
    database
});

const connectDB = (callback) => {
    console.log("DB 연결 시도 중");

    connection.connect((err) => {
        if (err) {
            console.log("DB 연결 실패:", err);
            connection.end();
            throw err;
        } else {
            console.log("DB 접속 성공");
            callback(connection);
        }
    });
};

// 모듈 내보내기
module.exports = { connectDB, connection };