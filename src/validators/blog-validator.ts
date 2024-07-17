import {body, param} from "express-validator";
import {inputModelValidation} from "../middleware/inputModel/input-model-validation";
import {contentValidation, shortDescriptionValidation, titlePostValidation} from "./post-validator";

const nameValidation = body('name')
    .exists()
    .isString()
    .trim()
    .isLength({min: 1, max: 15})
    .withMessage('Incorrect name!')

const descriptionValidation = body('description')
    .isString()
    .trim()
    .isLength({min: 1, max: 500})
    .withMessage('Incorrect description!')

const websiteUrlValidation = body('websiteUrl')
    .isString()
    .trim()
    .isLength({min: 1, max: 100})
    .matches('^https://([a-zA-Z0-9_-]+.)+[a-zA-Z0-9_-]+(/[a-zA-Z0-9_-]+)*/?$')
    .withMessage('Incorrect websiteUrl!')

export const mongoIdValidation = param('id')
    .isMongoId()
    .withMessage('Incorrect id!')

export const blogValidation = () =>  [nameValidation, descriptionValidation, websiteUrlValidation, inputModelValidation]

export const blogPostValidation = () => [mongoIdValidation, shortDescriptionValidation, titlePostValidation, contentValidation, inputModelValidation];

export const mongoIdInParamValidation = () => [ mongoIdValidation, inputModelValidation,]