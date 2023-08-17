const express = require('express');
const router = express.Router();
const Bookmark = require('../models/Bookmark');

router.post('/addBookmark', async (req, res) => {
    const { url, title, user } = req.body;

    try {
        const bookmark = new Bookmark({
            url,
            title,
            user,
        });

        const result = await bookmark.save();
        console.dir(result);
        res.status(201).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: '북마크를 찾을 수 없습니다.' });
    }
});
router.get('/bookmarks/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const bookmarks = await Bookmark.find({ user: userId });
        res.status(200).json(bookmarks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: '내부 서버 에러' });
    }
});

router.delete('/deleteBookmark/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await Bookmark.findByIdAndDelete(id);

        if (result) {
            console.dir(result);
            res.status(200).json(result);
        } else {
            res.status(404).json({ error: '북마크를 찾을 수 없습니다.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: '내부 서버 에러' });
    }
});

router.put('/updateBookmark/:id', async (req, res) => {
    const { id } = req.params;
    const { title, url } = req.body;

    try {
        const result = await Bookmark.findByIdAndUpdate(id, { title, url }, { new: true });

        if (result) {
            console.dir(result);
            res.status(200).json(result);
        } else {
            res.status(404).json({ error: '북마크를 찾을 수 없습니다.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: '내부 서버 에러' });
    }
});

module.exports = router;
