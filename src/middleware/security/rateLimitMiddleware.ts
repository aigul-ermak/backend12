const rateLimit = require('express-rate-limit');
import {NextFunction, Request, Response} from "express";

export const loginRateLimitMiddleware = rateLimit({
    windowMs: 100 * 1000,
    max: 5,
    handler: (req: Request, res: Response, next: NextFunction) => {
        return res.sendStatus(429)
    }
});