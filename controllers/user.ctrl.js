const bcrypt = require('bcrypt');
const { connectDB } = require('../db');

exports.signup = (req, res) => {
    console.log('Signup handler called');
    const { username, password, nickname } = req.body;

    // 비밀번호 해싱
    bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        connectDB((connection) => {
            // 데이터베이스에 새로운 사용자 추가
            const sql = 'INSERT INTO usertable (username, password, nickname) VALUES (?, ?, ?)';
            connection.query(sql, [username, hash, nickname], (err, results) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ error: 'Internal Server Error' });
                }

                return res.status(200).json({ message: 'User registered successfully' });
            });
        });
    });
};

// 로그인
exports.login = (req, res) => {
    const { username, password } = req.body;

    connectDB((connection) => {
        // 사용자 조회
        const sql = 'SELECT * FROM usertable WHERE username = ?';
        connection.query(sql, [username], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }

            if (results.length === 0) {
                // 사용자가 없음
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            // 비밀번호 검증
            bcrypt.compare(password, results[0].password, (err, result) => {
                if (err || !result) {
                    console.error(err);
                    return res.status(401).json({ error: 'Invalid credentials' });
                }

                // 로그인 성공
                return res.status(200).json({ message: 'Login successful' });
            });
        });
    });
};