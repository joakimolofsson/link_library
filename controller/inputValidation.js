import { check } from 'express-validator/check';
import UserModel from '../models/user';

const loginInputValidation = [
    check('password').isLength({ min: 3 })
];

const registerInputValidation = [
    check('firstname')
        .isLength({min: 1, max: 20})
        .trim()
        .escape()
        .withMessage('Your firstname is not valid!'),
    check('lastname')
        .isLength({min: 1, max: 20})
        .trim()
        .escape()
        .withMessage('Your lastname is not valid!'),
    check('age')
        .isInt()
        .withMessage('Your age is not valid!'),
    check('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Your e-mail is not valid!')
        .custom(async (email) => {
            try {
                const checkEmail = await UserModel.findOne({
                    email
                });
                if(checkEmail) {
                    return Promise.reject('E-mail address already exists!');
                }
            } catch(err) {
                return Promise.reject('Something went wrong!');
            }
        }),
    check('password')
        .isLength({min: 6, max: 20})
        .withMessage('Your password is not valid!')
];

export default { loginInputValidation, registerInputValidation }