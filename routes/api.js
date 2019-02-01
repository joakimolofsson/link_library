import express from 'express';
import bcrypt from 'bcryptjs';
import UserModel from '../models/user';
import v from '../controllers/inputValidation';

const router = express.Router();

router.post('/', v.loginInputValidation, async (req, res) => {
    if(v.inputErrorList(req)) {
        return res.json(v.inputErrorList(req));
    } else {
        try {
            const loginUser = await UserModel.findOne({
                email: req.body.email
            });
            
            if(loginUser) {
                const comparePasswords = await bcrypt.compare(req.body.password, loginUser.password);
                if(comparePasswords) {
                    console.log(`Login: ${loginUser.email} ${Date()}`);
                    return res.json(['success']);
                } else {
                    return res.json(['Wrong e-mail or password!']);
                }
            } else {
                return res.json(['Wrong e-mail or password!']);
            }
        } catch(err) {
            console.log(`Login Failed: ${Date()} | ${err}`);
            return res.json(['Something went wrong!']);
        }
    }
});

router.post('/register', v.registerInputValidation, async (req, res) => {
    if(v.inputErrorList(req)) {
        return res.json(v.inputErrorList(req));
    } else {
        const newUser = UserModel({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            age: req.body.age,
            email: req.body.email,
            password: req.body.password
        });

        try {
            const hashedPassword = await bcrypt.hash(newUser.password, 10);
            newUser.password = hashedPassword;
            await newUser.save();
            console.log(`New user registered | ${newUser} | ${Date()}`)
            return res.json(['success']);
        } catch(err) {
            console.log(`Failed to save new user | ${err} | ${Date()}`);
            return res.json(['Something went wrong!']);
        }
    }
});

router.get('/protected', (req, res) => {
    
});

export default router;