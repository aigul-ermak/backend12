import {BlogRepo} from "../repositories/blog-repo/blog-repo";
import {CreateBlogData, SortDataType, UpdateBlogData} from "../types/blog/input";
import {PostRepo} from "../repositories/post-repo/post-repo";
import {OutputItemPostType, PostDBType} from "../types/post/output";
import {BlogDBType, OutputItemBlogType} from "../types/blog/output";

export class BlogService {
    constructor(protected blogRepo: BlogRepo, protected postRepo: PostRepo) {
    }

    async createBlog(newData: CreateBlogData): Promise<OutputItemBlogType | null> {

        const newBlog: BlogDBType = {
            ...newData,
            createdAt: new Date().toISOString(),
            isMembership: false
        }

        const blogId: string | null = await this.blogRepo.createBlog(newBlog);
        if (!blogId) {
            return null;
        }

        const blog: OutputItemBlogType | null = await this.blogRepo.getBlogById(blogId)

        if (!blog) {
            return null;
        }
        return blog;
    }

    async createPostToBlog(blogId: string, postData: {
        title: string,
        shortDescription: string,
        content: string
    }): Promise<OutputItemPostType | null> {
        const blog: OutputItemBlogType | null = await this.blogRepo.getBlogById(blogId)

        if (!blog) {
            return null;
        }

        const newPost: PostDBType = {
            ...postData,
            blogId: blogId,
            blogName: blog.name,
            createdAt: new Date().toISOString()
        }

        const postId: string = await this.postRepo.createPostToBlog(newPost)

        if (!postId) {
            return null;
        }

        const post: OutputItemPostType | null = await this.postRepo.getPostById(postId);
        return post;
    }

    async updateBlog(blogId: string, updateData: UpdateBlogData): Promise<boolean> {

        const blog: OutputItemBlogType | null = await this.blogRepo.getBlogById(blogId);

        if (!blog) {
            return false;
        }

        return await this.blogRepo.updateBlog(blogId, updateData)
    }

    async getAllBlogs(sortData: SortDataType) {
        return await this.blogRepo.getAllBlogs(sortData);
    }

    async getBlogById(id: string) {
        return await this.blogRepo.getBlogById(id);
    }

    async deleteBlog(blogId: string): Promise<true | null> {

        const blogExists: OutputItemBlogType | null = await this.blogRepo.getBlogById(blogId)

        if (!blogExists) {
            return null;
        }

        await this.blogRepo.deleteBlog(blogId);
        return true
    }
}


