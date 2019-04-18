const express = require('express');
const bcrypt = require('bcryptjs');
const UserModel = require('../models/user');
const inputValidation = require('../middleware/inputValidation');

const router = express.Router();

router.post('/register', inputValidation.register, async (req, res) => {
    if(req.inputError) {
        res.json({status: req.inputError});
    } else {
        const newUser = UserModel({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            password: req.body.password
        });

        try {
            const hashedPassword = await bcrypt.hash(newUser.password, 10);
            newUser.password = hashedPassword;
            await newUser.save();
            console.log(`New user registered | ${Date()} | ${newUser}`)
            return res.json({status: 'success'});
        } catch(err) {
            console.log(`Failed to save new user | ${Date()} | ${err}`);
            return res.json({status: 'Something went wrong!'});
        }
    }
});

module.exports =  router;