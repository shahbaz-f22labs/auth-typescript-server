import express, { Request, Response } from "express";
import userModel from "./user.modal.js";
const route = express.Router();
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

dotenv.config();
import {
  signUpMiddleware,
  signInMiddleware,
  updatePasswordMiddleware,
} from "./user.middleware.js";

route.post(
  "/user/register",
  signUpMiddleware(userModel),
  async (req: Request, res: Response) => {
    const { name, email, password } = req.body.userinfo;
    try {
      let user = new userModel({ name, email, password });
      console.log("before...", user);
      user.save(function (err, result) {
        if (err) {
          console.log(err);
        } else {
          console.log("after...");
          return res.status(201).send({
            message: "User created",
          });
        }
      });
    } catch (error) {
      console.log(error);
    }
  }
);

route.post(
  "/user/signin",
  signInMiddleware(userModel, process.env.SIGN as string),
  (req: Request, res: Response) => {
    const { token } = req.body;
    return res.status(201).send({
      message: "Signed in Successfully",
      token: token,
    });
  }
);

route.put(
  "/user/update",
  updatePasswordMiddleware(userModel, process.env.SIGN as string),
  async (req: Request, res: Response) => {
    
    try {
      
      let isUser:any = jwt.verify(req.headers.token as string , process.env.SIGN as string);
      let { password } = req.body.userinfo;
      // console.log(isUser.email);
     
      
      password = bcrypt.hash(password, 12);
      let user = userModel.updateOne(
        { email: isUser.email },
        { $set: { password: password } }
      );
      console.log(user);
      return res.status(200).send({
        message: "Password successfully updated",
      });
    } catch (error) {
      console.log(error);
    }
  }
);

export default route ;
