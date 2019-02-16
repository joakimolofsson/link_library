import validator from 'validator';
import UserModel from '../models/user';

const login = async (req, res, next) => {
    req.inputError = await inputValidation(req.body, 'login');
    next();
}

const register = async (req, res, next) => {
    req.inputError = await inputValidation(req.body, 'register');
    next();
}

const profile = async (req, res, next) => {
    req.inputError = 'profile';
    next();
}

const inputValidation = async (requestBody, event) => {
    const keyNames = Object.keys(requestBody);
    let currentKey = 0;
    for(let input in requestBody) {
        const error = await validateInput(requestBody[input], keyNames[currentKey], event);
        if(error) {
            return error;
        }
        currentKey++;
    }
    return;
}

const validateInput = async (val, type, event) => {
    switch(type) {
        case 'firstname':
            const firstname = val.trim();
            if(!validator.isLength(firstname, {min: 2, max: 20})) {
                return 'Your firstname is too long or too short!';
            }
            break;
        case 'lastname':
            const lastname = val.trim();
            if(!validator.isLength(lastname, {min: 2, max: 20})) {
                return 'Your lastname is too long or too short!';
            }
            break;
        case 'age':
            const age = val.trim();
            if(!validator.isInt(age)) {
                return 'Your age is not valid!'
            } else if(!validator.isLength(age, {min: 1, max: 3})) {
                return 'Your age is too long or too short!';
            }
            break;
        case 'email':
            if(!validator.isEmail(val)) {
                return 'Your e-mail is not valid!';
            } else if(event === 'register' && !validator.isLength(val, {min: 1, max: 40})) {
                return 'Your e-mail is too long or too short!';
            } else if(event === 'register') {
                try {
                    const checkEmail = await UserModel.findOne({
                        email: val
                    });
                    if(checkEmail) {
                        return 'E-mail address already exists!';
                    }
                } catch(err) {
                    return 'Something went wrong!';
                }
            }
            break;
        case 'password':
            if(event === 'login' && !validator.isLength(val, {min: 6, max: 20})) {
                return 'Your password is not valid!';
            } else if(event === 'register' && !validator.isLength(val, {min: 6, max: 20})) {
                return 'Your password is too long or too short!';
            }
            break;
        default:
            console.log('default: ' + val);
            break;
    }
}

/* const profileEditInputValidation = async (req, res, next) => {
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
} */

export default {login, register, profile}