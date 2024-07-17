import {PostService} from "../services/post-service";
import {
    RequestBodyAndParams,
    RequestTypeWithQuery,
    RequestTypeWithQueryAndParams,
    RequestWithBody,
    RequestWithParams
} from "../types/common";
import {Params} from "../routes/videos-router";
import {Request, Response} from "express";
import {OutputPostType, PostDBType} from "../types/post/output";
import {OutputCommentType, OutputItemCommentType, SortCommentType} from "../types/comment/output";
import {QueryCommentRepo} from "../repositories/comment-repo/query-comment-repo";
import {CommentService} from "../services/comment-service";
import {QueryPostRepo} from "../repositories/post-repo/query-post-repo";
import {SortPostType} from "../types/post/input";
import {jwtService} from "../services/jwt-sevice";

export class PostController {
    constructor(protected postService: PostService, protected commentService: CommentService) {
    }

    async getAllPosts(req: RequestTypeWithQuery<SortPostType>, res: Response) {
        const sortData = {
            sortBy: req.query.sortBy,
            sortDirection: req.query.sortDirection,
            pageNumber: req.query.pageNumber,
            pageSize: req.query.pageSize
        }


        const posts: OutputPostType = await this.postService.getAllPosts(sortData)
        res.status(200).send(posts)
    }
    async getPostById(req: RequestWithParams<Params>, res: Response<PostDBType>) {
        const id: string = req.params.id

        const post: PostDBType | null = await this.postService.getPostById(id)

        if (post) {
            res.status(200).send(post)
        } else {
            res.sendStatus(404)
            return
        }
    }

    async getCommentByPostId(req: RequestTypeWithQueryAndParams<{ id: string }, SortCommentType>, res: Response<OutputCommentType>) {
        const postId: string = req.params.id

        const sortData: SortCommentType = {
            sortBy: req.query.sortBy,
            sortDirection: req.query.sortDirection,
            pageNumber: req.query.pageNumber,
            pageSize: req.query.pageSize
        }

        const post: PostDBType | null = await this.postService.getPostById(postId)

        let userId;
        let myStatus = 'None';

        if (req.headers.authorization) {
            const accessToken = req.headers.authorization.split(' ')[1];
            userId = await jwtService.getUserIdByToken(accessToken);
        }

        if (!post) {
            res.sendStatus(404)
            return
        }

        const comments: OutputCommentType = await this.commentService.getCommentByPostId(postId, userId, sortData);


        if (comments.items.length > 0) {
            res.status(200).send(comments)
        } else {
            res.sendStatus(404)
            return
        }
    }

    async createPost(req: RequestWithBody<PostDBType>, res: Response) {
        const newData: PostDBType = req.body;

        const postId: string | null = await this.postService.createPost(newData);

        if (!postId) {
            res.sendStatus(404);
            return;
        }

        const newPost: PostDBType | null = await this.postService.getPostById(postId);
        if (newPost) {
            res.status(201).send(newPost);
        } else {
            res.sendStatus(404);
            return
        }
    }

    async createComment(req: Request, res: Response) {
        const postId: string = req.params.id;
        const contentData = req.body;
        //TODO any type for user
        const user: any = req.user

        const commentId: string = await this.commentService.createComment(contentData, user, postId);

        if (!commentId) {
            res.sendStatus(404);
            return;
        }

        const newComment: OutputItemCommentType | null = await this.commentService.getCommentById(commentId);

        if (newComment) {
            res.status(201).send(newComment);
        }
    }

    async updatePost(req: RequestBodyAndParams<Params, PostDBType>, res: Response) {
        const id: string = req.params.id;
        const updateData: PostDBType = req.body;
        const isUpdated: boolean = await this.postService.updatePost(id, updateData);

        if (isUpdated) {
            res.sendStatus(204);
            return
        }
        res.sendStatus(404);
    }

    async deletePost(req: RequestWithParams<Params>, res: Response) {
        const id: string = req.params.id;
        const isPostDeleted: boolean = await this.postService.deletePost(id);

        if (!isPostDeleted) {
            res.sendStatus(404);
            return;
        }
        res.sendStatus(204);
    }
}