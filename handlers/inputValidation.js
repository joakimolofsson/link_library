import { check, validationResult } from 'express-validator/check';
import UserModel from '../models/user';

const handleInputErrors = (req) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorList = [];
        for(let errorMsg in errors.array()) {
            errorList.push(errors.array()[errorMsg]);
        }
        return errorList;
    } else {
        return;
    }
}

const loginInputValidation = [
    check('email')
        .isEmail().withMessage('Your e-mail is not valid!'),
    check('password')
        .isLength({min: 6, max: 20}).withMessage('Your password is not valid!')
];

const registerInputValidation = [
    check('firstname')
        .trim().escape()
        .isLength({min: 1, max: 20}).withMessage('Your firstname is too long or too short!'),
    check('lastname')
        .trim().escape()
        .isLength({min: 1, max: 20}).withMessage('Your lastname is too long or too short!'),
    check('age')
        .trim()
        .isInt().withMessage('Your age is not valid!')
        .isLength({min: 1, max: 3}).withMessage('Your age is too long or too short!'),
    check('email')
        .normalizeEmail()
        .isEmail().withMessage('Your e-mail is not valid!')
        .isLength({min: 1, max: 40}).withMessage('Your e-mail is too long or too short!')
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
        .isLength({min: 6, max: 20}).withMessage('Your password is too long or too short!')
];

export default { handleInputErrors, loginInputValidation, registerInputValidation }