import express from 'express';

import UserModel from '../models/user';
import v from '../controllers/inputValidation';

const router = express.Router();

router.post('/', v.loginInputValidation, async (req, res) => {
    if(v.inputErrors(req)) {
        res.json(v.inputErrors(req));
    } else {
        try {
            const loginUser = await UserModel.findOne({
                email: req.body.email,
                password: req.body.password
            });

            if(loginUser) {
                console.log(`Login: ${loginUser.email} ${Date()}`);
                return res.json(['success']);
            } else {
                return res.json(['Wrong e-mail or password!']);
            }
        } catch(err) {
            console.log(`Login Failed: ${Date()}`);
            return res.json(['Something went wrong!']);
        }
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