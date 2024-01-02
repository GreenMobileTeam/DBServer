const bcrypt = require('bcrypt');
const { connectDB, query} = require('../db.js');

exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const results = await query('SELECT * FROM usertable WHERE username = ?', [username]);

        if (results.length === 0) {
            return res.status(401).json({ message: 'username' });
        }

        const result = await bcrypt.compare(password, results[0].password);

        if (!result) {
            return res.status(401).json({ message: 'password' });
        }

        if (req.session.isLoggedIn) {
          req.session.destroy();
      }
        req.session.isLoggedIn = true;
        req.session.user = results[0];

        console.log(req.session.user);

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

exports.getLogout = async (req, res) => {
  try {
      req.session.destroy();
      res.status(200).json({ message: '로그아웃 성공' });
  } catch (err) {
      console.error(err);
      return res.status(500).json({ error: '서버 오류' });
  }
};

exports.getUserTime = async (req, res) => {
  try{

  } catch (err)
  {

  }
}