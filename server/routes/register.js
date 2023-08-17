const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.post('/register', async (req, res) => {
    const user = new User(req.body);

    try {
        const result = await user.save();
        console.dir(result);
        res.status(201).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: '내부 서버 에러' });
    }
});

module.exports = router;
