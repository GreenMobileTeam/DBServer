const bcrypt = require('bcrypt');
const { connectDB, query } = require('../db.js');

exports.signup = async (req, res) => {
    const { username, password, nickname } = req.body;

    try {
        const hash = await bcrypt.hash(password, 10);
        const results = await query('INSERT INTO usertable (username, password, nickname) VALUES (?, ?, ?)', [username, hash, nickname]);

        res.status(200).json({ message: '회원가입 완료' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: '서버 오류' });
    }
};

exports.checkDuplicate = async (req, res) => {
    const { type, value } = req.params;

    try {
        const results = await query(`SELECT * FROM usertable WHERE ${type} = ?`, [value]);

        const isDuplicate = results.length > 0;
        res.status(200).json({ isDuplicate });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: '서버 오류' });
    }
};

exports.checkCensorship = async (req, res) => {
    const { type, value } = req.params;

    try {
        const results = await query(`SELECT * FROM censorshiptable WHERE ? LIKE CONCAT('%', word, '%')`, [value]);
        const isCensored = results.length > 0;
        res.status(200).json({ isCensored });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: '서버 오류' });
    }
};
