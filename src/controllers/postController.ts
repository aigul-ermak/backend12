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
import {OutputItemPostType, OutputPostType, PostDBType} from "../types/post/output";
import {OutputCommentType, OutputItemCommentType, SortCommentType} from "../types/comment/output";
import {QueryCommentRepo} from "../repositories/comment-repo/query-comment-repo";
import {CommentService} from "../services/comment-service";
import {QueryPostRepo} from "../repositories/post-repo/query-post-repo";
import {SortPostType} from "../types/post/input";
import {jwtService} from "../services/jwt-sevice";
import {LIKE_STATUS, LikeDBModel} from "../types/like/output";
import {LikeCommentService} from "../services/like-comment-service";
import {AuthService} from "../services/auth-service";
import {UserService} from "../services/user-service";

export class PostController {
    constructor(protected postService: PostService, protected commentService: CommentService,
                protected likeService: LikeCommentService) {
    }

    async getAllPosts(req: RequestTypeWithQuery<SortPostType>, res: Response) {
        const sortData = {
            sortBy: req.query.sortBy,
            sortDirection: req.query.sortDirection,
            pageNumber: req.query.pageNumber,
            pageSize: req.query.pageSize
        }

        let userId;

        if (req.headers.authorization) {
            const accessToken = req.headers.authorization.split(' ')[1];
            userId = await jwtService.getUserIdByToken(accessToken);
        }

        if (!userId) {
            res.status(401)
        }

        const posts: OutputPostType = await this.postService.getAllPosts(sortData)
        res.status(200).send(posts)
    }

    async getPostById(req: RequestWithParams<Params>, res: Response<PostDBType>) {
        const id: string = req.params.id
        //TODO type??
        //const post: PostDBType | null = await this.postService.getPostById(id)
        const post: any | null = await this.postService.getPostById(id)

        let userId;

        let myStatus = 'None';

        if (req.headers.authorization) {
            const accessToken = req.headers.authorization.split(' ')[1];
            userId = await jwtService.getUserIdByToken(accessToken);
        }

        if (userId) {
            const like: LikeDBModel | null = await this.likeService.getLike(post.id, userId);
            if (like) {
                myStatus = like.status;
            }
        }

        post.extendedLikesInfo.myStatus = myStatus;

        const user = await this.userService.findUserById(userId);
        const newestLikes = await this.likeService.getNewestLikes(post.id);

        const formattedNewestLikes = newestLikes.map(like => ({
            addedAt: like.createdAt,
            userId: like.userId,
            login: user?.accountData.login,
        }));

        //post.newestLikes = formattedNewestLikes;

        if (post) {
            res.status(200).send(post)
        } else {
            res.sendStatus(404)
            return
        }
    }

    async getCommentByPostId(req: RequestTypeWithQueryAndParams<{
        id: string
    }, SortCommentType>, res: Response<OutputCommentType>) {
        const postId: string = req.params.id

        const sortData: SortCommentType = {
            sortBy: req.query.sortBy,
            sortDirection: req.query.sortDirection,
            pageNumber: req.query.pageNumber,
            pageSize: req.query.pageSize
        }
//TODO type??
        //const post: PostDBType | null = await this.postService.getPostById(postId)
        const post: any | null = await this.postService.getPostById(postId)

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
        //TODO type??
        //const newPost: PostDBType | null = await this.postService.getPostById(postId);
        const newPost: any | null = await this.postService.getPostById(postId);

        if (newPost) {
            res.status(201).send(newPost);
        } else {
            res.sendStatus(404);
            return
        }
    }

    async createLikeToPost(req: Request, res: Response) {
        const likeStatus: LIKE_STATUS = req.body.likeStatus

        const postId: string = req.params.id;

        const post: OutputItemPostType | null = await this.postService.getPostById(postId);

        if (!post) {
            res.sendStatus(404);
            return;
        }

        // Check if the access token is provided
        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader) {
            res.sendStatus(401); // Unauthorized
            return;
        }

        const accessToken = authorizationHeader.split(' ')[1];
        if (!accessToken) {
            res.sendStatus(401); // Unauthorized
            return;
        }

        // // Verify the token and get user ID
        const userId = await jwtService.getUserIdByToken(accessToken);
        if (!userId) {
            res.sendStatus(401); // Unauthorized
            return;
        }

        let isPostStatusUpdated = await this.likeService.createStatus(userId, likeStatus, post.id);

        if (!isPostStatusUpdated) {
            res.sendStatus(404);
            return;
        }

        res.sendStatus(204);

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