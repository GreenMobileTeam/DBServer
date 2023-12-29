const bcrypt = require('bcrypt');
const { connectDB } = require('../db');

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

  pool.getConnection((err, connection) => {
      if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Internal Server Error' });
      }
    
      const sql = 'SELECT nickname FROM usertable WHERE username = ?';
      connection.query(sql, [username], (err, results) => {
          connection.release(); // 쿼리 실행 후 커넥션을 풀에 반환

          if (err) {
              console.error(err);
              return res.status(500).json({ error: 'Internal Server Error' });
          }
  
          if (results.length === 0) {
              return res.status(404).json({ error: 'User not found' });
          }
  
          const nickname = results[0].nickname;
          console.log(nickname);
          res.status(200).json({ nickname });
      });
  });
};