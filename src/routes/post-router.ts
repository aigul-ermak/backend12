import {Router, Request, Response} from "express";
import {OutputPostType, PostDBType} from "../types/post/output";
import {authMiddleware} from "../middleware/auth/auth-middleware";
import {RequestBodyAndParams, RequestTypeWithQueryAndParams, RequestWithBody, RequestWithParams} from "../types/common";
import {Params} from "./videos-router";
import {postValidation} from "../validators/post-validator";
import {QueryPostRepo} from "../repositories/post-repo/query-post-repo";
import {PostService} from "../services/post-service";
import {PostRepo} from "../repositories/post-repo/post-repo";
import {SortPostType} from "../types/post/input";
import {mongoIdInParamValidation} from "../validators/blog-validator";
import {QueryCommentRepo} from "../repositories/comment-repo/query-comment-repo";
import {CommentService} from "../services/comment-service";
import {commentValidation, likeStatusValidation} from "../validators/comment-validator";
import {OutputCommentType, OutputItemCommentType, SortCommentType} from "../types/comment/output";
import {authBearerMiddleware} from "../middleware/auth/auth-bearer-middleware";
import {postExistsMiddleware} from "../middleware/comment/post-middleware";
import {postController} from "../composition-root";


export const postRouter = Router({})

//TODO - replace type
type RequestTypeWithQuery<Q> = Request<{}, {}, {}, Q>;

postRouter.get('/', postController.getAllPosts.bind(postController));

postRouter.get('/:id', mongoIdInParamValidation(), postController.getPostById.bind(postController));

postRouter.get('/:id/comments', mongoIdInParamValidation(), postController.getCommentByPostId.bind(postController));

postRouter.post('/', authMiddleware, postValidation(), postController.createPost.bind(postController));

postRouter.post('/:id/comments', authBearerMiddleware, mongoIdInParamValidation(), postExistsMiddleware, commentValidation(), postController.createComment.bind(postController))

postRouter.put('/:id', authMiddleware, postValidation(), postController.updatePost.bind(postController));

postRouter.put('/:id/like-status', postController.createLikeToPost.bind(postController));

postRouter.delete('/:id', authMiddleware, mongoIdInParamValidation(), postController.deletePost.bind(postController));