import {Request, Response, NextFunction} from "express";
import {RefreshToken, SessionDBType} from "../../types/token/output";
import {jwtService} from "../../services/jwt-sevice";
import {QuerySecurityRepo} from "../../repositories/security-repo/query-security-repo";

export const deviceCheckMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;
    const deviceId = req.params.deviceId

    if (!refreshToken) {
        res.sendStatus(404);
        return;
    }

    const payload: RefreshToken | null = jwtService.getPayloadFromToken(refreshToken);

    if (!payload) {
        res.sendStatus(404);
        return;
    }

    const session: SessionDBType | null = await QuerySecurityRepo.findSessionByDeviceId(deviceId)
    if(!session) {
        res.sendStatus(404);
        return;
    }

    if(session.userId !== payload.userId){
        res.sendStatus(403);
        return;
    }
    next();
};

export const refreshTokenMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        res.sendStatus(401);
    return;
}

const payload: RefreshToken | null = jwtService.getPayloadFromToken(refreshToken);

    if (!payload) {
        res.sendStatus(401);
        return;
    }


    next();

};


