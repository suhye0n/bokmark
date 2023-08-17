const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
    }

    if (user.password !== password) {
      return res.status(401).json({ error: '비밀번호를 다시 확인해주세요.' });
    }

    const userId = user._id.toString();
    res.status(200).json({ message: '로그인 성공', userId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '내부 서버 에러' });
  }
});

module.exports = router;
