import express, { Express, Request, Response,NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import validator  from "email-validator";
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs'
dotenv.config();

export const comparePassword = (password: string, secondPassword: string) => bcrypt.compare(password, secondPassword)

export const findUser= async( userModel:any,email:string ) =>{
    // console.log(email)
    try {
     let user = await userModel.findOne({email:email})
     console.log(user)
     if(user)return true
     return false
    } catch (error) {
     console.log(error)
    }
}



export const checkValidName = (name:string):Boolean => {
    if (name.length === 0 || name.length < 3) return false
    return true
};

export const validateEmail = (email:string) => {
    if (email.length === 0) return false
    return validator.validate(email);
};

export const validatePassword = (password:string):Boolean => {
    if (password.length === 0) return false
    let passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    return (passwordRegex.test(password));
}



interface tokenInterface  {
    name:string,
    email:string
}

export const varifyToken = (token:string , SIGN:string) => jwt.verify(token, SIGN)

export const generateToken = (SIGN:string, user: tokenInterface) : string => {
    const {name,email} = user;
    let token  =  jwt.sign({
        name : name,
        email: email,
    }, SIGN, { expiresIn: '30m' })
    return token
}


let signUpMiddleware  = (userModel:any) =>[
        (req:Request, res:Response, next:NextFunction) => {
            console.log(userModel)
              if(!checkValidName(req.body.userinfo.name)){
                return res.status(400).send({
                    error: "Please enter valid name"
                });
              }else{
                next();
              }
   
        },
        (req:Request, res:Response, next:NextFunction) => {
                if(!validateEmail(req.body.userinfo.email)){
                    return res.status(400).send({
                        error: "Please enter valid email"
                    }); 
                }else{
                    next();
                }
        }, (req:Request, res:Response, next:NextFunction) => {
                 if(!validatePassword(req.body.userinfo.password)){
                    return res.status(400).send({
                        error: "Please enter valid password"
                    }); 
                }else{
                    next();
                }
        },
        async(req:Request, res:Response, next:NextFunction) => {
            try {
                let result = await findUser(userModel,req.body.userinfo.email)
                console.log(result)
                if(result){
                    return res.status(400).send({
                        error: "User Exists"
                    }); 
                }else{
                    next();
                }
            } catch (error) {
                console.log(error)
            }
        }
    ]



const signInMiddleware = (userModel:any,SIGN:string) =>[
    (req:Request, res:Response, next:NextFunction) => {
        try {
            if(!validateEmail(req.body.userinfo.email)){
                return res.status(400).send({
                    error: "Please enter valid email"
                }); 
            }
            next();
        } catch (error) {
            console.log(error)
        }
    },
    (req:Request, res:Response, next:NextFunction) => {
        try {
            if(!validatePassword(req.body.userinfo.password)){
               return res.status(400).send({
                   error: "Please enter valid password"
               }); 
            }
          next();
        } catch (error) {
           console.log(error)
        }
   },
   async(req:Request, res:Response, next:NextFunction)=> {
        try {
            let result = await findUser(userModel,req.body.userinfo.email)
                if(!result){
                return res.status(404).send({
                    error: "User not found"
                }); 
            }
            
            next();
        } catch (error) {
            console.log(error)
        }
    },
    (req:Request, res:Response, next:NextFunction) => {
        try {
            let token = generateToken(SIGN,req.body.userinfo)
            req.body.token = token
            next();
        } catch (error) {
            console.log(error)
        }
    }
]


const updatePasswordMiddleware = ( userModel:any,SIGN:string ) =>[
    (req:Request, res:Response, next:NextFunction) => {
        try {
            let { password } = req.body.userinfo;
            if(!validatePassword(password)){
               return res.status(400).send({
                   error: "Please enter valid password"
               }); 
            }
          next();
        } catch (error) {
           console.log(error)
        }
   },
    async(req:Request, res:Response, next:NextFunction) =>{
        try {
            let token:String  = req.headers.token as string;
            if (req.headers.auth) token  = req.headers.auth as string
              // @ts-ignore
            if (!varifyToken(token , SIGN)) {
                res.status(400).send({
                    error: "Token Expired"
                });
            }
            next();
        } catch (error) {
            console.log(error)
        }
    }
]

export {signUpMiddleware,signInMiddleware,updatePasswordMiddleware}
