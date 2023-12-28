// users.js 파일
const express = require('express');
const router = express.Router();
const loginCtrl = require('../controllers/login.ctrl');
const signupCtrl = require('../controllers/signup.ctrl');

// 기본 경로 추가
router.get('/', (req, res) => {
  res.send('Hello, this is the users route!');
});

// 회원가입
router.post('/signup', signupCtrl.signup);
router.get('/checkDuplicate/:type/:value', signupCtrl.checkDuplicate);
router.get('/checkCensorship/:type/:value', signupCtrl.checkCensorship);

// 로그인
router.post('/login', loginCtrl.login);
router.post('/getLoginInfo', loginCtrl.getLoginInfo);

module.exports = router;
