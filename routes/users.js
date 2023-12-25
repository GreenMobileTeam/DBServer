// users.js 파일
const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user.ctrl');

// 기본 경로 추가
router.get('/', (req, res) => {
  res.send('Hello, this is the users route!');
});

// 회원가입
router.post('/signup', userCtrl.signup);

// 로그인
router.post('/login', userCtrl.login);

module.exports = router;
