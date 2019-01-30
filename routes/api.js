import express from 'express';
import { validationResult } from 'express-validator/check';
import UserModel from '../models/user';
import v from '../controller/inputValidation';

const router = express.Router();

router.post('/', v.loginInputValidation, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json({status: errors.array()});
    } else {
        try {
            const loginUser = await UserModel.findOne({
                email: req.body.email,
                password: req.body.password
            });
            console.log(loginUser);
        } catch(err) {
            return console.log('login fail');
        }
        //res.json({status: 'success'});
    }
});

router.post('/register', v.registerInputValidation, async (req, res) => {
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
    
});

export default router;