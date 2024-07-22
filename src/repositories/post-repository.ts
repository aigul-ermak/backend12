import {ObjectId, WithId} from "mongodb";
import {CreatePostData, UpdatePostData} from "../types/post/input";
import {BlogRepository} from "./blog-repository";


export class PostRepository {
    // static async getAllPosts() {
    //     const posts = await postCollection.find({}).toArray();
    //     return posts.map(postMapper);
    // }

    // static async getPostById(id: string): Promise<OutputItemPostType | null> {
    //     const post: WithId<PostType> | null = await postCollection.findOne({_id: new ObjectId(id)})
    //
    //     if (!post) {
    //         return null
    //     }
    //     return postMapper(post)
    // }

    // static async createPost(data: CreatePostData) {
    //     const createdAt = new Date();
    //     const blogName = await BlogRepository.getBlogById(data.blogId)
    //
    //     if(blogName) {
    //         const newPost: PostType = {
    //             ...data,
    //             blogName: blogName.name,
    //             createdAt: createdAt.toISOString()
    //         }
    //         const res = await postCollection.insertOne(newPost);
    //         return res.insertedId.toString();
    //     } else {
    //         return null
    //     }
    // }

    // static async updatePost(id: string, updateData: UpdatePostData): Promise<boolean> {
    //     const blog = await BlogRepository.getBlogById(updateData.blogId)
    //
    //     const res = await postCollection.updateOne({_id: new ObjectId(id)}, {
    //         $set: {
    //             title: updateData.title,
    //             shortDescription: updateData.shortDescription,
    //             content: updateData.content,
    //             blogId: updateData.blogId,
    //             blogName: blog?.name
    //         }
    //     })
    //
    //     return !!res.matchedCount;
    // }

    // static async deletePost(id: string): Promise<boolean> {
    //     const res = await postCollection.deleteOne({_id: new ObjectId(id)});
    //
    //     return !!res.deletedCount;
    // }
}