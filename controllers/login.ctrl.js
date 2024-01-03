const bcrypt = require('bcrypt');
const { connectDB, query} = require('../db.js');

exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const results = await query('SELECT * FROM usertable WHERE username = ?', [username]);

        if (results.length === 0) {
            return res.status(401).json({ message: 'username' });
        }

        const passwordMatch = await bcrypt.compare(password, results[0].password);

        if (!passwordMatch) {
          return res.status(401).json({ message: 'password' });
      }

      const logResults = await query(
        'INSERT INTO usertimetable (logintime, user_id, logging) VALUES (NOW(), ?, 1)',
        [results[0].id]
    );

        res.status(200).json({ message: 'success' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: '서버 오류' });
    }
};

exports.getLoginInfo = async (req, res) => {
  const { username } = req.body;

  try {
      const results = await query('SELECT nickname FROM usertable WHERE username = ?', [username]);

      if (results.length === 0) {
          return res.status(404).json({ error: '유저 없음' });
      }

      const nickname = results[0].nickname;
      console.log(nickname);
      res.status(200).json({ nickname });

  } catch (err) {
      console.error(err);
      return res.status(500).json({ error: '서버 오류' });
  }
};

exports.getLogOut = async (req, res) => {
  const { user_id } = req.body;
  try {
      return res.status(200).json({ result });
  } catch (err) {
      return res.status(500).json({ error : '로그아웃 오류 '});
  }
};
