const express = require('express');
const LinkModel = require('../models/link');
const inputValidation = require('../middleware/inputValidation');
const verifyToken = require('../middleware/verifyToken');

const router = express.Router();

router.post('/addlink', verifyToken, inputValidation.addLink, async(req, res) => {
    if(req.inputError) {
        return res.json({status: req.inputError});
    } else {
        const newLink = LinkModel({
            firstname: req.tokenUserData.user.firstname,
            lastname: req.tokenUserData.user.lastname,
            link: req.body.link,
            description: req.body.description
        });
        try {
            await newLink.save();
            return res.json({status: 'success'});
        } catch(err) {
            console.log(`Failed to add link | ${Date()} | ${err}`);
            return res.json({status: 'Something went wrong!'});
        }
    }
});

module.exports =  router;