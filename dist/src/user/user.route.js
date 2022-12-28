var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import express from "express";
import userModel from "./user.modal.js";
const route = express.Router();
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
dotenv.config();
import { signUpMiddleware, signInMiddleware, updatePasswordMiddleware, } from "./user.middleware.js";
route.post("/user/register", signUpMiddleware(userModel), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body.userinfo;
    try {
        let user = new userModel({ name, email, password });
        console.log("before...", user);
        user.save(function (err, result) {
            if (err) {
                console.log(err);
            }
            else {
                console.log("after...");
                return res.status(201).send({
                    message: "User created",
                });
            }
        });
    }
    catch (error) {
        console.log(error);
    }
}));
route.post("/user/signin", signInMiddleware(userModel, process.env.SIGN), (req, res) => {
    const { token } = req.body;
    return res.status(201).send({
        message: "Signed in Successfully",
        token: token,
    });
});
route.put("/user/update", updatePasswordMiddleware(userModel, process.env.SIGN), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let isUser = jwt.verify(req.headers.token, process.env.SIGN);
        let { password } = req.body.userinfo;
        // console.log(isUser.email);
        password = bcrypt.hash(password, 12);
        let user = userModel.updateOne({ email: isUser.email }, { $set: { password: password } });
        console.log(user);
        return res.status(200).send({
            message: "Password successfully updated",
        });
    }
    catch (error) {
        console.log(error);
    }
}));
export default route;
