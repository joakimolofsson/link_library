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

const shareLink = async (req, res, next) => {
    req.inputError = await inputValidation(req.body, 'shareLink');
    next();
}

const profile = async (req, res, next) => {
    const updatedInput = {},
    compareKeys = ['firstname', 'lastname', 'age', 'email', 'password'];
    for(let key in req.body) {
        if(compareKeys.indexOf(key) !== -1 && req.body[key] !== req.tokenUserData.user[key]) {
            if(key === 'password' && req.body[key] === '') {
                continue;
            }
            updatedInput[key] = req.body[key];
        }
    }
    req.inputError = await inputValidation(updatedInput, 'profile');
    req.updatedInput = updatedInput;
    next();
}

//////////

const inputValidation = async (reqBody, event) => {
    const keyNames = Object.keys(reqBody);
    let currentKey = 0;
    for(let value in reqBody) {
        const error = await checkInput(reqBody[value], keyNames[currentKey], event);
        if(error) {
            return error;
        }
        currentKey++;
    }
    return;
}

const checkInput = async (val, type, event) => {
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
            const valToString = val.toString(),
            age = valToString.trim();
            if(!validator.isInt(age)) {
                return 'Your age is not valid!'
            } else if(!validator.isLength(age, {min: 1, max: 3})) {
                return 'Your age is too long or too short!';
            }
            break;
        case 'email':
            if(!validator.isEmail(val)) {
                return 'Your e-mail is not valid!';
            } else if((event === 'register' || event == 'profile') && !validator.isLength(val, {min: 1, max: 40})) {
                return 'Your e-mail is too long or too short!';
            } else if(event === 'register' || event == 'profile') {
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
            } else if((event === 'register' || event == 'profile') && !validator.isLength(val, {min: 6, max: 20})) {
                return 'Your password is too long or too short!';
            }
            break;
        case 'link':
            const link = val.trim();
            if(!validator.isLength(link, {min: 1, max: 100})) {
                return 'Your link is too long or too short!';
            } else if(!validator.isURL(link)) {
                return 'Invalid link!';
            }
            break;
        case 'description':
            const description = val.trim();
            if(!validator.isLength(description, {min: 1, max: 150})) {
                return 'Your description is too long or too short!';
            }
            break;
        default:
            break;
    }
}

export default {login, register, profile, shareLink}