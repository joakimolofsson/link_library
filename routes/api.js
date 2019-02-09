import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import UserModel from '../models/user';
import v from '../handlers/inputValidation';
import verifyToken from '../handlers/verifyToken';

const router = express.Router();

router.post('/', v.loginInputValidation, async (req, res) => {
    const inputErrors = v.handleInputErrors(req);
    if(inputErrors) {
        return res.json({status: inputErrors[0].msg});
    } else {
        try {
            const loginUser = await UserModel.findOne({
                email: req.body.email
            });
            
            if(loginUser) {
                const comparePasswords = await bcrypt.compare(req.body.password, loginUser.password);
                if(comparePasswords) {
                    const requestToken = await jwt.sign({user: loginUser}, process.env.JWTSECRET, {expiresIn: '30s'});
                    console.log(`Login | ${Date()} | ${loginUser.email}`);
                    return res.json({
                        status: 'success',
                        token: requestToken
                    });
                } else {
                    return res.json({status: 'Wrong e-mail or password!'});
                }
            } else {
                return res.json({status: 'Wrong e-mail or password!'});
            }
        } catch(err) {
            console.log(`Login Failed | ${Date()} | ${err}`);
            return res.json({status: 'Something went wrong!'});
        }
    }
});

router.post('/register', v.registerInputValidation, async (req, res) => {
    const inputErrors = v.handleInputErrors(req);
    if(inputErrors) {
        return res.json({status: inputErrors[0].msg});
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
            console.log(`New user registered | ${Date()} | ${newUser}`)
            return res.json({status: 'success'});
        } catch(err) {
            console.log(`Failed to save new user | ${Date()} | ${err}`);
            return res.json({status: 'Something went wrong!'});
        }
    }
});

router.post('/userinfo', verifyToken, async (req, res) => {
    const userData = req.body.user;
    return res.json({
        status: 'success',
        userData
    });
});

export default router;