var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import mongoose from "mongoose";
import bcryptjs from 'bcryptjs';
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
userSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        // this.isModified('password'))
        this.password = yield bcryptjs.hash(this.password, 12);
        next();
    });
});
const userModel = mongoose.model("Users", userSchema);
export default userModel;
