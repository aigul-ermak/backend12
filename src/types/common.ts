import {Request} from "express";
import {AvailableResolutions} from "./video/output";

export type RequestWithParams<P> = Request<P, {}, {}, {}>

export type RequestWithBody<B> = Request<{}, {}, B, {}>

export type RequestBodyAndParams<P, B> = Request<P, {}, B, {}>

export type RequestTypeWithQuery<Q> = Request<{}, {}, {}, Q>;

export type ErrorType = {
    errorsMessages: ErrorMessageType []
}

export type RequestTypeWithQueryAndParams<P, Q> = Request<P, {}, {}, Q>;

export type ErrorMessageType = {
    field: string,
    message: string
}

export type Body = {
    title: string,
    author: string,
    availableResolutions: typeof AvailableResolutions
}

