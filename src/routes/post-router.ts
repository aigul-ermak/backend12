import {Router, Request, Response} from "express";
import {authMiddleware} from "../middleware/auth/auth-middleware";
import {postValidation} from "../validators/post-validator";
import {mongoIdInParamValidation} from "../validators/blog-validator";
import {commentValidation, likeStatusValidation} from "../validators/comment-validator";
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

postRouter.put('/:id/like-status', authBearerMiddleware, likeStatusValidation(), postController.createLikeToPost.bind(postController));

postRouter.delete('/:id', authMiddleware, mongoIdInParamValidation(), postController.deletePost.bind(postController));