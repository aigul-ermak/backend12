import {BlogService} from "../services/blog-service";
import {
    RequestBodyAndParams,
    RequestTypeWithQuery,
    RequestTypeWithQueryAndParams,
    RequestWithBody,
    RequestWithParams
} from "../types/common";
import {Response} from "express";
import {Params} from "../routes/videos-router";
import {CreateBlogData, SortDataType, UpdateBlogData} from "../types/blog/input";
import {OutputItemPostType, OutputPostType} from "../types/post/output";
import {BlogDBType, OutputBlogType, OutputItemBlogType} from "../types/blog/output";
import {SortPostType} from "../types/post/input";
import {PostService} from "../services/post-service";


export class BlogController {
    constructor(protected blogService: BlogService, protected postService: PostService) {
    }

    async getAllBlogs(req: RequestTypeWithQuery<SortDataType>, res: Response<OutputBlogType>) {
        const sortData = {
            searchNameTerm: req.query.searchNameTerm,
            sortBy: req.query.sortBy,
            sortDirection: req.query.sortDirection,
            pageNumber: req.query.pageNumber,
            pageSize: req.query.pageSize
        }

        const blogs: OutputBlogType = await this.blogService.getAllBlogs(sortData)
        res.status(200).send(blogs)
    }

    async getBlogById(req: RequestWithParams<Params>, res: Response<OutputItemBlogType>) {
        const blogId: string = req.params.id
        const blog: null | OutputItemBlogType = await this.blogService.getBlogById(blogId)

        if (!blog) {
            res.sendStatus(404)
        } else {
            res.send(blog)
        }
    }

    async getPostsByBlogId(req: RequestTypeWithQueryAndParams<{ id: string }, SortPostType>, res: Response<OutputPostType>) {
        const id: string = req.params.id

        const sortData: SortPostType = {
            sortBy: req.query.sortBy,
            sortDirection: req.query.sortDirection,
            pageNumber: req.query.pageNumber,
            pageSize: req.query.pageSize
        }

        const blog: null | BlogDBType = await this.blogService.getBlogById(id)

        if (!blog) {
            res.sendStatus(404)
            return
        }

        const posts: OutputPostType = await this.postService.getPostsByBlogId(id, sortData);

        if (!posts) {
            res.sendStatus(204)
            return
        }
        res.status(200).send(posts)
    }

    async createBlog(req: RequestWithBody<CreateBlogData>, res: Response<OutputItemBlogType>) {
        const newData: CreateBlogData = req.body;
        const blog: OutputItemBlogType | null = await this.blogService.createBlog(newData);

        if (!blog) {
            res.sendStatus(404)
            return
        }

        res.status(201).send(blog)
    }

    async createPostToBlog(req: RequestBodyAndParams<{ id: string }, {
        title: string,
        shortDescription: string,
        content: string
    }>, res: Response<OutputItemPostType>) {
        const id: string = req.params.id

        const {title, shortDescription, content} = req.body;

        const post: OutputItemPostType | null = await this.blogService.createPostToBlog(id, {title, shortDescription, content})

        if (!post) {
            res.sendStatus(404)
            return
        }

        res.status(201).send(post)
    }

    async updateBlog(req: RequestBodyAndParams<Params, UpdateBlogData>, res: Response) {
        const updateData = req.body;
        const id = req.params.id;

        let isBlogUpdated = await this.blogService.updateBlog(id, updateData);

        if (isBlogUpdated) {
            res.sendStatus(204);
            return
        }
        res.sendStatus(404);
    }

    async deleteBlog(req: RequestWithParams<{ id: string }>, res: Response) {
        const id = req.params.id;

        const result = await this.blogService.deleteBlog(id);

        if (!result) {
            res.sendStatus(404);
            return
        }
        res.sendStatus(204);
    }
}