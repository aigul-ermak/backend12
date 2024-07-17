import {body} from "express-validator";
import {inputModelValidation} from "../middleware/inputModel/input-model-validation";
import {LIKE_STATUS} from "../types/like/output";


const contentValidation = body('content')
    .exists()
    .isString()
    .trim()
    .isLength({min: 20, max: 300})
    .withMessage('Incorrect comment')

const statusValidation = body('status')
    .exists()
    .isString()
    .trim()
    .withMessage('Status is required')

const likeValidation = body('likeStatus')
    .exists().withMessage('Like status is required')
    .trim()
    .isIn(Object.values(LIKE_STATUS))



const commentatorInfoValidation = [
    body('userId')
        .exists()
        .withMessage('User ID is required')
        .isString()
        .withMessage('User ID must be a string'),
    body('userLogin')
        .exists()
        .withMessage('User Login is required')
        .isString()
        .withMessage('User Login must be a string'),
]


export const commentValidation = () => [contentValidation, inputModelValidation]
export const commentStatusValidation = () => [statusValidation, inputModelValidation]
export const likeStatusValidation = () => [likeValidation, inputModelValidation]




