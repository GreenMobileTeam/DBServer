const bcrypt = require('bcrypt');
const { connectDB } = require('../db');

exports.checkDuplicate = (req, res) => {
    const { type, value } = req.params;
    connectDB((connection) => {
      const sql = `SELECT * FROM usertable WHERE ${type} = ?`;
      connection.query(sql, [value], (err, results) => {
        if (err) {
          console.error(err);
          connection.release();
          return res.status(500).json({ error: '내부 서버 오류' });
        }
  
        const isDuplicate = results.length > 0;
        //console.log(isDuplicate);
        res.status(200).json({ isDuplicate });
        connection.release();
      });
    });
  };

exports.signup = (req, res) => {
    console.log('Signup handler called');
    const { username, password, nickname } = req.body;

    // 비밀번호 해싱
    bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
            console.error(err);
            connection.release();
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        connectDB((connection) => {
            // 데이터베이스에 새로운 사용자 추가
            const sql = 'INSERT INTO usertable (username, password, nickname) VALUES (?, ?, ?)';
            connection.query(sql, [username, hash, nickname], (err, results) => {
                if (err) {
                    console.error(err);
                    connection.release();
                    return res.status(500).json({ error: 'Internal Server Error' });
                }

                res.status(200).json({ message: 'User registered successfully' });
                connection.release();
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
                connection.release();
                return res.status(500).json({ error: 'Internal Server Error' });
            }

            // 사용자가 존재하지 않을 때
            if (results.length === 0) {
                connection.release();
                return res.status(401).json({ message: 'Invalid username' });
                
            }

            // 비밀번호 비교
            bcrypt.compare(password, results[0].password, (err, result) => {
                if (err || !result) {
                    console.error(err);
                    connection.release();
                    return res.status(401).json({ message: 'Invalid password' });
                }

                // 로그인 성공
                res.status(200).json({ message: 'Login successful' });
                connection.release();
            });
        });
    });
};

// 로그인 성공 시 닉네임 반환
exports.getLoginInfo = (req, res) => {
    const { username } = req.body; 
  
    connectDB((connection) => {
      const sql = 'SELECT nickname FROM usertable WHERE username = ?';
      connection.query(sql, [username], (err, results) => {
        if (err) {
          console.error(err);
          connection.release();
          return res.status(500).json({ error: 'Internal Server Error' });
        }
  
        if (results.length === 0) 
        {
          connection.release();
          return res.status(404).json({ error: 'User not found' });
        }
  
        const nickname = results[0].nickname;
        console.log(nickname);
        res.status(200).json({ nickname });
        connection.release();
      });
    });
  };
  