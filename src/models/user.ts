import mongoose, {Schema, model, Document} from 'mongoose';
import {BlogDBType} from "../types/blog/output";
import {CommentDBType} from "../types/comment/output";
import {UserDBType} from "../types/user/output";

const userSchema = new mongoose.Schema<UserDBType>({
    accountData: {
        login: {type: String, required: true},
        email: {type: String, required: true},
        passwordHash: {type: String, required: true},
        passwordRecoveryCode: {type: String, required: false},
        recoveryCodeExpirationDate: {type: Date, required: false},
        createdAt: {type: Date, required: true}
    },
    emailConfirmation: {
        confirmationCode: {type: String, required: false},
        expirationDate: {type: Date, required: true},
        isConfirmed: {type: Boolean, required: true}
    }
});

export const UserModel = mongoose.model('User', userSchema);
