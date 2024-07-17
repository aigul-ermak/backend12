import {body} from "express-validator";
import {inputModelValidation} from "../middleware/inputModel/input-model-validation";
import {QueryBlogRepo} from "../repositories/blog-repo/query-blog-repo";

export const blogIdValidation = body('blogId')
    .isString()
    .trim()
    .notEmpty()
    .isMongoId()
    .withMessage("Incorrect mongoid blogid")
    .custom(async(value) => {
        const blog = await QueryBlogRepo.getBlogById(value);

        if(!blog) {
            throw new Error('Blog is not exists')
        }
        return true
    })
    .withMessage('Incorrect blogId')

export const shortDescriptionValidation = body('shortDescription')
    .isString()
    .trim()
    .isLength({min: 1, max: 100})
    .withMessage('Incorrect short description')

export const titlePostValidation = body ('title')
    .isString()
    .trim()
    .isLength({min: 1, max: 30})
    .withMessage('Incorrect title')

export const contentValidation= body('content')
    .isString()
    .trim()
    .isLength({min: 1, max: 1000})
    .withMessage('Incorrect content')

export const postValidation = () =>  [
    shortDescriptionValidation,
    titlePostValidation,
    contentValidation,
    blogIdValidation,
    inputModelValidation,
]

