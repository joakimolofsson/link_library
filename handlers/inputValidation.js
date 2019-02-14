import { check, validationResult } from 'express-validator/check';
import validator from 'validator';
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
        .trim()
        .isLength({min: 2, max: 20}).withMessage('Your firstname is too long or too short!'),
    check('lastname')
        .trim()
        .isLength({min: 2, max: 20}).withMessage('Your lastname is too long or too short!'),
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

const profileEditInputValidation = async (req, res, next) => {
    compareInput(req.body, req.tokenUserData.user);

    function compareInput(reqData, tokenData) {
        const compareKeys = ['firstname', 'lastname', 'age', 'email'];
        for(let key in reqData) {
            if(compareKeys.indexOf(key) !== -1 && reqData[key] !== tokenData[key]) {
                validateNewInput(reqData[key], key);
            }
        }
    }
    
    function validateNewInput(val, key) {
        const trimValue = val.trim();
        switch(JSON.stringify(key)) {

            case JSON.stringify('firstname'):
                if(!validator.isLength(trimValue, {min: 2, max: 20})) {
                    return req.validateError = `Your firstname is too long or too short!`;
                }
                return req.body.firstname = trimValue;

            case JSON.stringify('lastname'):
                if(!validator.isLength(trimValue, {min: 2, max: 20})) {
                    return req.validateError = `Your lastname is too long or too short!`;
                }
                return req.body.lastname = trimValue;

            case JSON.stringify('age'):
                if(!validator.isInt(trimValue)) {
                    return req.validateError = 'Your age is not valid!'
                }
                if(!validator.isLength(trimValue, {min: 1, max: 3})) {
                    return req.validateError = `Your age is too long or too short!`;
                }
                return req.body.age = trimValue;

            case JSON.stringify('email'):
                if(!validator.isEmail(val)) {
                    return req.validateError = 'Your e-mail is not valid!'
                }
                if(!validator.isLength(val, {min: 1, max: 40})) {
                    return req.validateError = `Your e-mail is too long or too short!`;
                }
                return req.body.email = val;

            default:
                break;
        }
    }
    next();
}

export default {handleInputErrors, loginInputValidation, registerInputValidation, profileEditInputValidation}