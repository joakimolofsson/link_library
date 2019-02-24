import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import UserModel from '../models/user';
import inputValidation from '../middleware/inputValidation';
import verifyToken from '../middleware/verifyToken';

const router = express.Router();

//////////

router.post('/', inputValidation.login, async (req, res) => {
    if(req.inputError) {
        res.json({status: req.inputError});
    } else {
        try {
            const loginUser = await UserModel.findOne({
                email: req.body.email
            });
            
            if(loginUser) {
                const comparePasswords = await bcrypt.compare(req.body.password, loginUser.password);
                if(comparePasswords) {
                    const token = await jwt.sign({user: loginUser}, process.env.JWTSECRET, {expiresIn: '30min'});
                    console.log(`Login | ${Date()} | ${loginUser.email}`);
                    return res.json({
                        status: 'success',
                        token
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

//////////

router.post('/register', inputValidation.register, async (req, res) => {
    if(req.inputError) {
        res.json({status: req.inputError});
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

//////////

router.get('/nav', async(req, res) => {
    try {
        const allMembers = await UserModel.find({});
        return res.json({
            status: 'success',
            allMembers: allMembers.length
        });
    } catch(err) {
        console.log(`Failed to get nav data | ${Date()} | ${err}`);
        return res.json({status: 'Something went wrong!'});
    }
});

//////////

router.post('/profile', verifyToken, async (req, res) => {
    const profileData = req.tokenUserData.user;
    return res.json({
        status: 'success',
        profileData
    });
});

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
                await UserModel.findOneAndUpdate({_id: req.body.id}, req.updatedInput, {upsert: true});
                const newProfile = await UserModel.findOne({_id: req.body.id}),
                token = await jwt.sign({user: newProfile}, process.env.JWTSECRET, {expiresIn: '30min'});
                return res.json({
                    status: 'success',
                    token
                });
            } catch(err) {
                console.log(`Failed to update profile | ${Date()} | ${err}`);
                return res.json({status: 'Something went wrong!'});
            }
        }
    }
});

export default router;