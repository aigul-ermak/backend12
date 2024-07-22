import mongoose from 'mongoose';
import {LIKE_STATUS, LikeDBModel} from "../types/like/output";


const likesSchema = new mongoose.Schema<LikeDBModel>({
    status: {type: String, enum: Object.values(LIKE_STATUS), required: true},
    userId: {type: String, required: true},
    parentId: {type: String, required: true},
    login: {type: String, required: true},
    createdAt: Date,
});
export const LikeModel = mongoose.model('LikeModel', likesSchema);