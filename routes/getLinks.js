const express = require('express');
const LinkModel = require('../models/link');
const verifyToken = require('../middleware/verifyToken');

const router = express.Router();

router.post('/getlinks', verifyToken, async(req, res) => {
    try {
        let filter = null,
        count = req.body.showLinksCount;
        switch(req.body.filter) {
            case 'latest':
                filter = '-posted';
                break;
            case 'oldest':
                filter = 'posted';
                break;
            case 'like':
                filter = {like: -1};
                break;
            case 'dislike':
                filter = {dislike: -1};
                break;
            default:
                break;
        }
        const links = await LinkModel.find().skip(count).limit(30).sort(filter);
        return res.json({
            status: 'success',
            links,
            userRatedLinks: req.tokenUserData.user.ratedLinks
        });
    } catch(err) {
        console.log(`Failed to get links | ${Date()} | ${err}`);
        return res.json({status: 'Something went wrong!'});
    }
});

module.exports =  router;