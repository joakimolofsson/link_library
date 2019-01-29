import express from 'express';
import { check, validationResult } from 'express-validator/check';

import UserModel from '../models/user';

const router = express.Router();

router.post('/', [], async (req, res) => {
    /* const loginUser = await handleDbCall(
        UserModel.findOne({
            email: req.body.email,
            password: req.body.password
        }),
        'isNull',
        {
            success: `Login Success: ${req.body.email} | ${Date()}`,
            failed: `Login Failed: ${req.body.email} | ${Date()}`
        }
    );

    res.json(loginUser); */
});

router.post('/register', [
    check('firstname').isLength({min: 1, max: 20}).trim().escape().withMessage('Your firstname is not valid!'),
    check('lastname').isLength({min: 1, max: 20}).trim().escape().withMessage('Your lastname is not valid!'),
    check('age').isInt().withMessage('Your age is not valid!'),
    check('email').isEmail().normalizeEmail().withMessage('Your e-mail is not valid!').custom(async value => {
        try {
            const checkEmail = await UserModel.findOne({
                email: value
            });
            if(checkEmail) {
                return Promise.reject('E-mail address already exists!');
            }
        } catch(err) {
            return Promise.reject('Something went wrong!');
        }
    }),
    check('password').isLength({min: 6, max: 20}).withMessage('Your password is not valid!')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json({status: errors.array()});
    } else {
        const newUser = UserModel({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            age: req.body.age,
            email: req.body.email,
            password: req.body.password
        });
        
        try {
            await newUser.save();
            console.log(`New user registered | ${Date()}`)
            return res.json({status: 'New user registered!'}) 
        } catch(err) {
            return console.log(`Failed to save new user | ${err} | ${Date()}`);
        }
    }
});

router.get('/protected', (req, res) => {
    res.send('protected');
});

export default router;