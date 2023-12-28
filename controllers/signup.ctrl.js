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

exports.checkCensorship = (req, res) => {
  const { type, value } = req.params;
  connectDB((connection) => {
    const sql = `SELECT * FROM censorshiptable WHERE ? LIKE CONCAT('%', word, '%')`;
    connection.query(sql, [value], (err, results) => {
      if (err) {
        console.error(err);
        connection.release();
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      const isCensored = results.length > 0;
      res.status(200).json({ isCensored });
      connection.release();
    });
  });
};
