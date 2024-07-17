import {NextFunction, Request, Response} from "express";
import {jwtService} from "../../services/jwt-sevice";
import {RefreshToken, RefreshTokenType} from "../../types/token/output";


export const checkTokenMiddleware = async (req: Request, res: Response, next: NextFunction) => {

    const refreshToken = req.cookies.refreshToken;
    const user = req.user;

    if (!user) {
        res.sendStatus(404)
        return
    }

    if (!refreshToken || refreshToken == null) {
        res.sendStatus(404)
        return
    }

    const payload = jwtService.getPayloadFromToken(refreshToken);

    if (payload == null) {
        res.sendStatus(401)
        return
    }
    const tokenExpDate = Number(payload.expDate);

    if (tokenExpDate < (new Date().getTime() + 1) / 1000) {
        res.sendStatus(401)
        return
    }

    const userId = payload.userId;

    if (user.id !== userId) {
        res.sendStatus(403)
        return
    }

    return next()
}