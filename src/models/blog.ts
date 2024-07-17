import mongoose, { Schema, model, Document } from 'mongoose';
import {BlogDBType} from "../types/blog/output";

export const blogSchema = new mongoose.Schema<BlogDBType>({
    name:  {type: String, required: true},
    description:{type: String, required: true},
    websiteUrl: {type: String, required: true},
    //TODO change type
    createdAt: Date,
    isMembership: Boolean
})

export const BlogModel = mongoose.model('Blog', blogSchema)