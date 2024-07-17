import {CreatePostData, SortPostType, UpdatePostData} from "../types/post/input";
import {PostRepo} from "../repositories/post-repo/post-repo";
import {PostDBType} from "../types/post/output";
import {BlogRepo} from "../repositories/blog-repo/blog-repo";

export class PostService {

    constructor(protected postRepo: PostRepo, protected blogRepo: BlogRepo,) {
    }

    async createPost(newData: CreatePostData): Promise<string | null> {

        const blog = await this.blogRepo.getBlogById(newData.blogId)

        if (!blog) {
            throw new Error('Blog not found');
        }

        const newPost: PostDBType = {
            ...newData,
            blogName: blog.name,
            createdAt: new Date().toISOString()
        }

        const postId = await this.postRepo.createPost(newPost);

        return postId;
    }


    async updatePost(postId: string, updateData: UpdatePostData) {

        const blog = this.blogRepo.getBlogById(updateData.blogId)

        if (!blog) {
            return false;
        }

        //updateData.blogName = blog.name;
        //update post?
        //updateData.blogName = blog.name;
        return await this.postRepo.updatePost(postId, updateData);
    }

    async deletePost(id: string) {
        return await this.postRepo.deletePost(id);
    }

    async getPostById(id: string){
        return await this.postRepo.getPostById(id);
    }

    async getAllPosts(sortData: SortPostType){
        return await this.postRepo.getAllPosts(sortData);
    }

    async getPostsByBlogId(id: string, sortData: SortPostType){
        return await this.postRepo.getPostsByBlogId(id, sortData);
    }


    // static async deleteBlog(postId: string) {
    //     const postExists = await QueryPostRepo.getPostById(postId)
    //     if (!postExists) {
    //         throw new Error('Post not found');
    //     }
    //     await PostRepo.deletePost(postId)
    // }
}