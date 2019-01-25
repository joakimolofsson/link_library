import express from 'express';
const router = express.Router();

import UserModel from '../models/user';

router.post('/', async (req, res) => {
    try {
        const loginUser = await UserModel.findOne({
            email: req.body.email,
            password: req.body.password
        });

        if(loginUser != null) {
            console.log(`Login Success ${req.body.email} ${req.body.password} ${Date()}`);
            res.send('Login Success');
        } else {
            console.log(`Login Failed ${req.body.email} ${req.body.password} ${Date()}`);
            res.send('Login Failed');
        }
    } catch(err) {
        console.log(`/api/ Error: ${err}`);
        res.send('Something Went Wrong');
    }
});

router.post('/register', async (req, res) => {
    const newUser = UserModel({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        age: req.body.age,
        email: req.body.email,
        password: req.body.password
    });

    try {
        const checkDbForSameEmail = await UserModel.findOne({
            email: newUser.email
        });

        if(checkDbForSameEmail != null) {
            console.log(`Email Already Exists: ${newUser.email}`)
            return res.send('Email Already Exists');
        }
    } catch(err) {
        console.log(`checkDbForSameEmail: ${err}`);
        return res.send('Something Went Wrong');
    }

    try {
        const addNewUserToDb = await newUser.save();
        console.log(`New User Registered: ${addNewUserToDb}`);
        res.send('New User Registered');
    } catch(err) {
        console.log(`Error Registering New User: ${err}`);
        res.send('Error Registering New User');
    }
});

export default router;