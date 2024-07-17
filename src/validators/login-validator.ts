import {body} from "express-validator";
import {inputModelValidation} from "../middleware/inputModel/input-model-validation";

const loginOrEmailValidation = body('loginOrEmail')
    .exists()
    .isString()
    .withMessage('Invalid login or email!')

const passwordValidation = body('password')
    .exists()
    .isString()
    .withMessage('Invalid password!')

export const userAuthValidation = () =>  [loginOrEmailValidation, passwordValidation, inputModelValidation]