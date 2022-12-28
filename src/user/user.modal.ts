import mongoose from "mongoose";
import bcryptjs from 'bcryptjs';
import { NextFunction } from 'express';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: String
    },
    password: {
        type: String,
        required: true
    }
});
    // @ts-ignore
// userSchema.pre('save', function (next:NextFunction) {
//     // @ts-ignore
//         this.password  = bcryptjs.hash(this.password, 12);
//         next();
// });
userSchema.pre('save', async function (next) {
    // this.isModified('password'))
    this.password = await bcryptjs.hash(this.password, 12)
    next()
})

const userModel = mongoose.model("Users", userSchema);
export default userModel ;