import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import UserModel from '../models/user';
import LinkModel from '../models/link';
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

router.post('/nav', verifyToken, async(req, res) => {
    try {
        const allMembers = await UserModel.find({});
        const allLinks = await LinkModel.find({});
        return res.json({
            status: 'success',
            allMembers: allMembers.length,
            allLinks: allLinks.length
        });
    } catch(err) {
        console.log(`Failed to get nav data | ${Date()} | ${err}`);
        return res.json({status: 'Something went wrong!'});
    }
});

//////////

router.post('/getlinks', verifyToken, async(req, res) => {
    try {
        let filter = null;
        switch(req.body.filterOption) {
            case 'latest':
                filter = 'posted';
                break;
            case 'oldest':
                filter = '-posted';
                break;
            default:
                break;
        }
        const links = await LinkModel.find().skip(req.body.linkCount).limit(5).sort(filter);
        return res.json({
            status: 'success',
            links,
            userRatedLinks: req.tokenUserData.user.ratedLinks
        });
    } catch(err) {
        console.log(`Failed to get links | ${Date()} | ${err}`);
        return res.json({status: 'Something went wrong!'});
    }
});

router.post('/ratelink', verifyToken, async(req, res) => {
    try {
        const userAlreadyRatedLink = await UserModel.findOne({_id: req.tokenUserData.user._id, ratedLinks: {'$elemMatch': {linkId: req.body.linkId, rating: req.body.rating}}});
        if(userAlreadyRatedLink === null) {
            let token = null;
            const updateUserRatedLinks = await UserModel.findOneAndUpdate({_id: req.tokenUserData.user._id, 'ratedLinks.linkId': req.body.linkId}, {
                'ratedLinks.$.rating': req.body.rating
            }, {new: true});
    
            if(updateUserRatedLinks !== null) {
                token = await jwt.sign({user: updateUserRatedLinks}, process.env.JWTSECRET, {expiresIn: '30min'});
            } else {
                const addUserRatedLinks = await UserModel.findOne({_id: req.tokenUserData.user._id});
                addUserRatedLinks.ratedLinks.push({
                    linkId: req.body.linkId,
                    rating: req.body.rating
                });
                addUserRatedLinks.save();
                token = await jwt.sign({user: addUserRatedLinks}, process.env.JWTSECRET, {expiresIn: '30min'});
            }
    
            await LinkModel.findOneAndUpdate({_id: req.body.linkId}, {'$inc': {[req.body.rating]: 1}});
            return res.json({
                status: 'success',
                token
            });
        } else {
            return res.json({
                status: 'Already Rated'
            });
        }
    } catch(err) {
        console.log(`Failed to rate link | ${Date()} | ${err}`);
        return res.json({status: 'Something went wrong!'});
    }
});

//////////

router.post('/addlink', verifyToken, inputValidation.addLink, async(req, res) => {
    if(req.inputError) {
        return res.json({status: req.inputError});
    } else {
        const newLink = LinkModel({
            firstname: req.tokenUserData.user.firstname,
            lastname: req.tokenUserData.user.lastname,
            link: req.body.link,
            description: req.body.description
        });
        try {
            await newLink.save();
            return res.json({status: 'success'});
        } catch(err) {
            console.log(`Failed to add link | ${Date()} | ${err}`);
            return res.json({status: 'Something went wrong!'});
        }
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

export default router;