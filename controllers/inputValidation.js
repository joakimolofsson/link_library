import { check, validationResult } from 'express-validator/check';
import UserModel from '../models/user';

const inputErrors = (req) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorList = [];
        for(let errorMsg in errors.array()) {
            errorList.push(errors.array()[errorMsg].msg);
        }
        return errorList;
    } else {
        return;
    }
}

const loginInputValidation = [
    check('email')
        .isEmail()
        .withMessage('Your e-mail is not valid!'),
    check('password')
        .isLength({min: 6, max: 20})
        .withMessage('Your password is not valid!')
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

export default { inputErrors, loginInputValidation, registerInputValidation }