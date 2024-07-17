import {Router} from "express";
import {authMiddleware} from "../middleware/auth/auth-middleware";
import {
    blogPostValidation,
    blogValidation,
    mongoIdInParamValidation
} from "../validators/blog-validator";
import {blogController} from "../composition-root";


export const blogRouter: Router = Router({})

blogRouter.get('/', blogController.getAllBlogs.bind(blogController));

blogRouter.get('/:id', mongoIdInParamValidation(), blogController.getBlogById.bind(blogController));

blogRouter.get('/:id/posts', mongoIdInParamValidation(), blogController.getPostsByBlogId.bind(blogController));

blogRouter.post('/', authMiddleware, blogValidation(), blogController.createBlog.bind(blogController));

blogRouter.post('/:id/posts', authMiddleware, blogPostValidation(), blogController.createPostToBlog.bind(blogController));

blogRouter.put('/:id', authMiddleware, blogValidation(), blogController.updateBlog.bind(blogController));

blogRouter.delete('/:id', authMiddleware, blogController.deleteBlog.bind(blogController));