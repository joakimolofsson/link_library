const express = require('express');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/user');
const LinkModel = require('../models/link');
const verifyToken = require('../middleware/verifyToken');

const router = express.Router();

router.post('/ratelink', verifyToken, async(req, res) => {
    try {
        let updateUserToken = null,
            incrementOption = null;
        const compareRatings = await UserModel.findOne({_id: req.tokenUserData.user._id, ratedLinks: {'$elemMatch': {linkId: req.body.linkId, rating: req.body.newRating}}});
        if(compareRatings === null) {
            const updateCurrentRating = await UserModel.findOneAndUpdate({_id: req.tokenUserData.user._id, 'ratedLinks.linkId': req.body.linkId}, {
                'ratedLinks.$.rating': req.body.newRating
            }, {new: true});
    
            if(updateCurrentRating !== null) {
                updateUserToken = updateCurrentRating;
                incrementOption = {[req.body.newRating]: 1, [req.body.currentRating]: -1};
            } else {
                const addNewRating = await UserModel.findOne({_id: req.tokenUserData.user._id});
                addNewRating.ratedLinks.push({
                    linkId: req.body.linkId,
                    rating: req.body.newRating
                });
                await addNewRating.save();
                updateUserToken = addNewRating;
                incrementOption = {[req.body.newRating]: 1};
            }

            const token = await jwt.sign({user: updateUserToken}, process.env.JWTSECRET, {expiresIn: '30min'}),
            newLink = await LinkModel.findOneAndUpdate({_id: req.body.linkId}, {'$inc': incrementOption}, {new: true});

            return res.json({
                status: 'success',
                token,
                newLink
            });
        } else {
            let removeRating = null;
            for(let i = 0, len = compareRatings.ratedLinks.length; i < len; i++) {
                if(compareRatings.ratedLinks[i].linkId === req.body.linkId) {
                    removeRating = compareRatings.ratedLinks[i]._id;
                }
            }
            compareRatings.ratedLinks.pull({_id: removeRating});
            await compareRatings.save();
            const token = await jwt.sign({user: compareRatings}, process.env.JWTSECRET, {expiresIn: '30min'}),
            newLink = await LinkModel.findOneAndUpdate({_id: req.body.linkId}, {'$inc': {[req.body.currentRating]: -1}}, {new: true});

            return res.json({
                status: 'success',
                token,
                newLink,
                linkStatus: 'removed'
            });
        }
    } catch(err) {
        console.log(`Failed to rate link | ${Date()} | ${err}`);
        return res.json({status: 'Something went wrong!'});
    }
});

module.exports =  router;