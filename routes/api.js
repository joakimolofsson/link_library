import express from 'express';
const router = express.Router();

import UserModel from '../models/user';

router.get('/', (req, res) => {
    const newUser = UserModel({
        firstname: 'Joakim',
        lastname: 'Olofsson',
        age: '32',
        email: 'jjoakim.olofsson@gmail.com',
        password: 'pass',
    });
    
    newUser.save(function (err, newUser) {
        if(err) {
            console.log(err);
        } else {
            console.log(newUser);
        }
    });

    res.send('First page');
});

export default router;