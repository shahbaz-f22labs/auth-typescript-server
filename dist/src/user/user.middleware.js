var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import jwt from 'jsonwebtoken';
import validator from "email-validator";
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
dotenv.config();
export const comparePassword = (password, secondPassword) => bcrypt.compare(password, secondPassword);
export const findUser = (userModel, email) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log(email)
    try {
        let user = yield userModel.findOne({ email: email });
        console.log(user);
        if (user)
            return true;
        return false;
    }
    catch (error) {
        console.log(error);
    }
});
export const checkValidName = (name) => {
    if (name.length === 0 || name.length < 3)
        return false;
    return true;
};
export const validateEmail = (email) => {
    if (email.length === 0)
        return false;
    return validator.validate(email);
};
export const validatePassword = (password) => {
    if (password.length === 0)
        return false;
    let passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    return (passwordRegex.test(password));
};
export const varifyToken = (token, SIGN) => jwt.verify(token, SIGN);
export const generateToken = (SIGN, user) => {
    const { name, email } = user;
    let token = jwt.sign({
        name: name,
        email: email,
    }, SIGN, { expiresIn: '30m' });
    return token;
};
let signUpMiddleware = (userModel) => [
    (req, res, next) => {
        console.log(userModel);
        if (!checkValidName(req.body.userinfo.name)) {
            return res.status(400).send({
                error: "Please enter valid name"
            });
        }
        else {
            next();
        }
    },
    (req, res, next) => {
        if (!validateEmail(req.body.userinfo.email)) {
            return res.status(400).send({
                error: "Please enter valid email"
            });
        }
        else {
            next();
        }
    }, (req, res, next) => {
        if (!validatePassword(req.body.userinfo.password)) {
            return res.status(400).send({
                error: "Please enter valid password"
            });
        }
        else {
            next();
        }
    },
    (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let result = yield findUser(userModel, req.body.userinfo.email);
            console.log(result);
            if (result) {
                return res.status(400).send({
                    error: "User Exists"
                });
            }
            else {
                next();
            }
        }
        catch (error) {
            console.log(error);
        }
    })
];
const signInMiddleware = (userModel, SIGN) => [
    (req, res, next) => {
        try {
            if (!validateEmail(req.body.userinfo.email)) {
                return res.status(400).send({
                    error: "Please enter valid email"
                });
            }
            next();
        }
        catch (error) {
            console.log(error);
        }
    },
    (req, res, next) => {
        try {
            if (!validatePassword(req.body.userinfo.password)) {
                return res.status(400).send({
                    error: "Please enter valid password"
                });
            }
            next();
        }
        catch (error) {
            console.log(error);
        }
    },
    (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let result = yield findUser(userModel, req.body.userinfo.email);
            if (!result) {
                return res.status(404).send({
                    error: "User not found"
                });
            }
            next();
        }
        catch (error) {
            console.log(error);
        }
    }),
    (req, res, next) => {
        try {
            let token = generateToken(SIGN, req.body.userinfo);
            req.body.token = token;
            next();
        }
        catch (error) {
            console.log(error);
        }
    }
];
const updatePasswordMiddleware = (userModel, SIGN) => [
    (req, res, next) => {
        try {
            let { password } = req.body.userinfo;
            if (!validatePassword(password)) {
                return res.status(400).send({
                    error: "Please enter valid password"
                });
            }
            next();
        }
        catch (error) {
            console.log(error);
        }
    },
    (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let token = req.headers.token;
            if (req.headers.auth)
                token = req.headers.auth;
            // @ts-ignore
            if (!varifyToken(token, SIGN)) {
                res.status(400).send({
                    error: "Token Expired"
                });
            }
            next();
        }
        catch (error) {
            console.log(error);
        }
    })
];
export { signUpMiddleware, signInMiddleware, updatePasswordMiddleware };
