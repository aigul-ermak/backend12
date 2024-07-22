import mongoose, { Schema, Document, model } from 'mongoose';
import {PostDBType} from "../types/post/output";

export const postSchema = new mongoose.Schema<PostDBType>({
    title: {type: String, required: true},
    shortDescription: {type: String, required: true},
    content: {type: String, required: true},
    blogId: {type: String, required: true},
    blogName:{type: String, required: true},
    createdAt: Date,
    likesCount: {type: Number,default: 0},
    dislikesCount:  {type: Number, default: 0},
})

export const PostModel = mongoose.model('Post', postSchema);