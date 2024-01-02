const bcrypt = require('bcrypt');
const { connectDB } = require('../db');

exports.login = (req, res) => {
  connection.query(sql, [username], (err, results) => {
      if (err) {
          console.error(err);
          connection.release();
          return res.status(500).json({ error: 'Internal Server Error' });
      }

      // 사용자가 존재하지 않을 때
      if (results.length === 0) {
          // 사용자가 없음
          connection.release();
          return res.status(401).json({ message: 'Invalid username' });

      }

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
