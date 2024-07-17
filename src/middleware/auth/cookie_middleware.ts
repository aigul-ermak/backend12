import {NextFunction, Request, Response} from "express";
import jwt from "jsonwebtoken";
import {settings} from "../../services/settings";
import {QuerySecurityRepo} from "../../repositories/security-repo/query-security-repo";
import {jwtService} from "../../services/jwt-sevice";
import {RefreshToken, SessionDBType} from "../../types/token/output";
import {SecurityRepo} from "../../repositories/security-repo/security-repo";



export const cookieMiddleware = async (req: Request, res: Response, next: NextFunction) => {

    const token = req.cookies?.refreshToken;

    if (!token) {
        res.sendStatus(401);
        return;
    }

    try {
        const result: any = jwt.verify(token, settings.JWT_SECRET);

        if (!result) {
            res.sendStatus(401);
            return;
        }

        next();
    } catch {
        res.sendStatus(401);
        return;
    }
};


export const sessionRefreshTokeMiddleware = async (req: Request, res: Response, next: NextFunction) => {

    const token = req.cookies?.refreshToken;

    const payload: RefreshToken | null = await jwtService.getPayloadFromToken(token);
    console.log(payload)

    if (!payload) {

        res.sendStatus(401);
        return;
    }

    const sessionExists: SessionDBType | null = await QuerySecurityRepo.checkRefreshTokenInList(payload.userId, payload.deviceId);

    if (!sessionExists) {
        res.sendStatus(401);
        return;
    }

    if (sessionExists.iatDate != payload.iatDate) {
        res.sendStatus(401);
        return;
    }
    next();
}

export const countMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const ipUser: any = req.ip;
    const urlUser: string = req.originalUrl; // /login/regi
    const currentTime = new Date();


    await SecurityRepo.insertRequestFromUser({
        ip: ipUser,
        url: urlUser,
        date: currentTime,
    });

    const tenSecondsAgo = new Date(currentTime.getTime() - 10000);

    const count = await SecurityRepo.countRequests(ipUser, urlUser, tenSecondsAgo);

    if (count > 5) {
        res.sendStatus(429);
        return
    }

    next();
};