const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/user');
const inputValidation = require('../middleware/inputValidation');
const verifyToken = require('../middleware/verifyToken');

const router = express.Router();

router.post('/profile_edit', verifyToken, inputValidation.profile, async (req, res) => {
    if(req.inputError) {
        return res.json({status: req.inputError});
    } else {
        if(Object.keys(req.updatedInput).length !== 0) {
            if(req.updatedInput.password) {
                const hashedPassword = await bcrypt.hash(req.updatedInput.password, 10);
                req.updatedInput.password = hashedPassword;
            }
            try {
                const newProfile = await UserModel.findOneAndUpdate({_id: req.tokenUserData.user._id}, req.updatedInput, {upsert: true, new: true });
                const token = await jwt.sign({user: newProfile}, process.env.JWTSECRET, {expiresIn: '30min'});
                return res.json({
                    status: 'success',
                    token
                });
            } catch(err) {
                console.log(`Failed to update profile | ${Date()} | ${err}`);
                return res.json({status: 'Something went wrong!'});
            }
        } else {
            return res.json({status: 'Nothing to update!'});
        }
    }
});

module.exports =  router;