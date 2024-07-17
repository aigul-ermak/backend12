import mongoose, {Schema, model, Document} from 'mongoose';
import {LIKE_STATUS, LikeDBModel} from "../types/like/output";


const likesSchema = new mongoose.Schema<LikeDBModel>({
    status: {type: String, enum: Object.values(LIKE_STATUS), required: true},
    userId: {type: String, required: true},
    parentId: {type: String, required: true},
});

export const LikePostModel = mongoose.model('LikePostModel', likesSchema);
export const LikeCommentModel = mongoose.model('LikeCommentModel', likesSchema);