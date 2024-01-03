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

      const checkUser = await query('SELECT COUNT(*) as count FROM usertimetable WHERE user_id = ?', [results[0].id]);

      if (checkUser[0].count > 0) {
          const log = await query(
              'UPDATE usertimetable SET logintime = ?, logging = 1 WHERE user_id = ?',
              [new Date(), results[0].id]
          );
      } else {
          const log = await query(
              'INSERT INTO usertimetable (user_id, logintime, logging) VALUES (?, ?, 1)',
              [results[0].id, new Date()]
          );
      }
      

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

exports.checkSession = async (req, res) => {
    const { userId } = req.body;

    try {
        const results = await query('SELECT logging FROM usertimetable WHERE user_id = ? ORDER BY logintime DESC LIMIT 1', [userId]);

        if (results.length === 0) {
            return res.status(404).json({ error: '로그인 기록 없음' });
        }

        const isLogged = results[0].logging === 1;
        res.status(200).json({ isLogged });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: '서버 오류' });
    }
};

exports.logout = async (req, res) => {
    const { username } = req.body;

    try {
        await query('UPDATE usertimetable SET logouttime = ?, logging = 0 WHERE user_id = (SELECT id FROM usertable WHERE username = ?) AND logging = 1', [new Date(), username]);

        res.status(200).json({ message: '로그아웃 성공' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: '로그아웃 오류' });
    }
};
