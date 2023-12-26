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

    if (connection.state === 'disconnected') {
        connection.connect((err) => {
            if (err) {
                console.log("DB 연결 실패:", err);
                throw err;
            } else {
                console.log("DB 접속 성공");
                callback(connection);
            }
        });
    } else {
        console.log("DB 연결 되어있음");
        callback(connection);
    }
};


module.exports = { connectDB, connection };