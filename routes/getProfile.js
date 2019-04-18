const express = require('express');
const verifyToken = require('../middleware/verifyToken');

const router = express.Router();

router.post('/profile', verifyToken, async (req, res) => {
    const profileData = req.tokenUserData.user;
    return res.json({
        status: 'success',
        profileData
    });
});

module.exports =  router;