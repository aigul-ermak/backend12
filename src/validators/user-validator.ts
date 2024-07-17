import {body, param} from "express-validator";
import {inputModelValidation} from "../middleware/inputModel/input-model-validation";
import {QueryUserRepo} from "../repositories/user-repo/query-user-repo";
import {OutputUserItemType, UserDBType} from "../types/user/output";

const loginValidation = body('login')
    .exists()
    .isString()
    .trim()
    .isLength({min: 3, max: 10})
    .matches('^[a-zA-Z0-9_-]*$')
    .withMessage('Invalid login!')
    .custom(async (login) => {
        const user = await QueryUserRepo.findByLoginOrEmail(login);
        // TODO ask
        if (user) {
            throw new Error('User already exists.')
        }
        return true
    })
    .withMessage('User already exists.')

const passwordValidation = body('password')
    .exists()
    .isString()
    .trim()
    .isLength({min: 6, max: 20})
    .withMessage('Invalid password!')

const newPassValidation = body('newPassword')
    .exists()
    .isString()
    .trim()
    .isLength({min: 6, max: 20})
    .withMessage('Invalid password!')


export const mongoIdValidation = param('id')
    .isMongoId()
    .withMessage('Incorrect id!')


const emailValidation = body('email')
    .isString()
    .trim()
    .notEmpty().withMessage('Email is required')
    .normalizeEmail()
    //.matches('^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$')
    .isEmail().withMessage('Invalid email!')
    .custom(async (email) => {
        const user = await QueryUserRepo.findByLoginOrEmail(email);
        // TODO ask
        if (user) {
            throw new Error('User already exists.')
        }
        return true
    })
    .withMessage('User already exists.')


const codeValidation = body('code')
    .isString()
    .custom(async code => {
        const userExists: OutputUserItemType| null = await QueryUserRepo.findUserByConfirmationCode(code)
        if (!userExists) {
            throw new Error('Code not valid (User do not found)')
        }

        if (!(userExists.emailConfirmation.expirationDate > new Date())) {
            throw new Error('Code not valid (Date problem)')
        }

        if (userExists.emailConfirmation.isConfirmed) {
            throw new Error('Code not valid (User already confirmed)')
        }

        return true
    })

const recCodeValidation = body('recoveryCode')
    .isString()
    .custom(async (recoveryCode) => {
        const userExists: UserDBType|null = await QueryUserRepo.findUserByRecoveryCode(recoveryCode);

        if (!userExists) {
            throw new Error('Code not valid (User do not found)');
        }

        const currentDate = new Date();
        if (!userExists.accountData.recoveryCodeExpirationDate || userExists.accountData.recoveryCodeExpirationDate < currentDate) {
            throw new Error('Code not valid (Date problem)')
        }
        return true;
    })


const emailExistsValidation = body('email')
    .isString()
    .trim()
    .normalizeEmail()
    //.matches('^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$')
    .isEmail().withMessage('Invalid email!')
    .custom(async email => {
        const userExists = await QueryUserRepo.findByLoginOrEmail(email)
        if (!userExists) {
            throw new Error('Email is not valid (User do not found)')
        }

        if (userExists.emailConfirmation.isConfirmed) {
            throw new Error('Code not valid (User already confirmed)')
        }

        return true
    })

const emailExistsRecoveryPasswordValidation = body('email')
    .isString()
    .trim()
    .normalizeEmail()
    //.matches('^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$')
    .isEmail().withMessage('Invalid email!')
    .custom(async email => {
        const userExists = await QueryUserRepo.findByLoginOrEmail(email)
        // if (!userExists) {
        //     throw new Error('Email is not valid (User do not found)')
        // }
        //
        // if (userExists.emailConfirmation.isConfirmed) {
        //     throw new Error('Code not valid (User already confirmed)')
        // }

        return true
    })


export const userValidation = () =>
    [loginValidation, emailValidation, passwordValidation, inputModelValidation]

export const userEmailValidation = () => [emailExistsValidation, inputModelValidation]
export const userCodeValidation = () => [codeValidation, inputModelValidation]

export const userRecPassEmailValidation = () => [emailExistsRecoveryPasswordValidation, inputModelValidation]

export const newPasswordValidation = () => [newPassValidation, inputModelValidation]
export const recoveryCodeValidation = () => [recCodeValidation, inputModelValidation]

