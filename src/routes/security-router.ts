import {Request, Response, Router} from "express";
import {SecurityService} from "../services/security-service";
// import {deviceCheckMiddleware, refreshTokenMiddleware} from "../middleware/auth/refreshTokenMiddleware";
import {cookieMiddleware} from "../middleware/auth/cookie_middleware";
import {deviceCheckMiddleware} from "../middleware/auth/refreshTokenMiddleware";


export const securityRouter: Router = Router({})

/**
 * HW 9 returns all devices with active sessions to current user
 */
securityRouter.get('/devices', cookieMiddleware, async (req: Request, res: Response) => {
    const token: string = req.cookies.refreshToken

    const devices = await SecurityService.getActiveDevices(token);

    if (devices == null)
        return res.status(401);

    return res.status(200).send(devices);
})

/**
 * terminate all devices (exclude current) device's sessions
 */
securityRouter.delete('/devices', cookieMiddleware,async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;
    console.log(refreshToken)
    await SecurityService.deleteSpecifiedDeviceSession(refreshToken);

    return res.sendStatus(204);
})

/**
 * terminate specified device session
 */
securityRouter.delete('/devices/:deviceId',cookieMiddleware,
    deviceCheckMiddleware,async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;
    const deviceId = req.params.deviceId

        //const payload: RefreshToken | null = jwtService.getPayloadFromToken(refreshToken);

    await SecurityService.deleteDeviceSession(refreshToken, deviceId);
    return res.sendStatus(204);
})
