import express from 'express';
const router = express.Router();

import UserModel from '../models/user';
import handleCall from '../helper/handleCall';

router.post('/', async (req, res) => {
    const loginUser = await handleCall(
        UserModel.findOne({
            email: req.body.email,
            password: req.body.password
        }),
        'isNull',
        {success: 'Login Success', failed: 'Login Failed'}
    );

    res.send(loginUser);
});

router.post('/register', async (req, res) => {
    const newUser = UserModel({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        age: req.body.age,
        email: req.body.email,
        password: req.body.password
    });

    const existingEmailAddress = await handleCall(
        UserModel.findOne({
            email: newUser.email
        }),
        'notNull',
        {success: 'new', failed: 'E-mail Address Already Exists'}
    );

    if(existingEmailAddress === 'new') {
        const registerNewUser = await handleCall(
            newUser.save(),
            '',
            {success: 'New User Registered', failed: 'Failed to Register New User'}
        );
        
        res.send(registerNewUser);
    } else {
        res.send(existingEmailAddress);
    }
});

export default router;