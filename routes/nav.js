const express = require('express');
const UserModel = require('../models/user');
const LinkModel = require('../models/link');
const verifyToken = require('../middleware/verifyToken');

const router = express.Router();

router.post('/nav', verifyToken, async(req, res) => {
    try {
        const allMembers = await UserModel.find({});
        const allLinks = await LinkModel.find({});
        return res.json({
            status: 'success',
            allMembers: allMembers.length,
            allLinks: allLinks.length
        });
    } catch(err) {
        console.log(`Failed to get nav data | ${Date()} | ${err}`);
        return res.json({status: 'Something went wrong!'});
    }
});

module.exports =  router;