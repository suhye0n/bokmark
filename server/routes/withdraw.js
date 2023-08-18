const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.delete('/withdraw/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await User.findByIdAndDelete(id);
        
        if (result) {
            console.dir(result);
            res.status(200).json(result);
        } else {
            res.status(404).json({ error: '탈퇴 처리를 실패하였습니다.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: '내부 서버 에러' });
    }
});

module.exports = router;
