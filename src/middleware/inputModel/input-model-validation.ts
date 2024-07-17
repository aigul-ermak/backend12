import {NextFunction, Request, Response} from "express";
import {Result, ValidationError, validationResult} from "express-validator";
import {ErrorMessageType} from "../../types/common";

export const inputModelValidation = (req: Request, res: Response, next: NextFunction) => {

    const errors = validationResult(req).formatWith((error: ValidationError) => {
        switch (error.type) {
            case "field":
                return {
                    message: error.msg,
                    field: error.path
                }
            default:
                return {
                    message: error.msg,
                    field: 'not found'
                }
        }
    })

    if (!errors.isEmpty()) {
        //const err = errors.array({onlyFirstError: true})

        return res.status(400).json({ errorsMessages: errors.array() });
    }

    return next()
}