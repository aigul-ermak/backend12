import {jwtService} from "./jwt-sevice";
import {RefreshedToken, RefreshToken, SessionDBType} from "../types/token/output";
import {SecurityRepo} from "../repositories/security-repo/security-repo";
import {QuerySecurityRepo} from "../repositories/security-repo/query-security-repo";
import {SessionModel} from "../models/security";


export class SecurityService {
    static async getUserIdFromToken(token: string) {
        const payload: RefreshToken | null = await jwtService.getPayloadFromToken(token)
        if (!payload) {
            return null;
        }
        return payload.userId;
    }

    static async getActiveDevices(token: string) {

     const payload = await jwtService.getPayloadFromToken(token)

        if(!payload)
            return null

        const activeDevices = await SessionModel.find({
            "userId": payload.userId
        });

        const transformedDevices = activeDevices.map(device => {
            return {
                ip: device.ip,
                title: device.title,
                lastActiveDate: device.iatDate,
                deviceId: device.deviceId
            };
        });

        return transformedDevices;
    }

    static async createSession(userId: string, userIp: string, userAgent: string, deviceId: string,  tokens: RefreshedToken) {
        const payload: RefreshToken| null = jwtService.getPayloadFromToken(tokens.refreshToken)

        if (!payload)
            return null


        const sessionUser : SessionDBType = {
            userId: userId,
            deviceId: deviceId,
            ip: userIp,
            title: userAgent,
            iatDate: payload?.iatDate,
            expDate: payload?.expDate
        }

        const result = await QuerySecurityRepo.putSessionToList(sessionUser);

        if(!result)
            return null;

        return true;

    }
    static async deleteDeviceSession(token :string, deviceId: string) {

        const payload: RefreshToken| null  = jwtService.getPayloadFromToken(token)

        const isDeviceDeleted = await SecurityRepo.deleteDeviceToken(payload?.userId, deviceId);

        return isDeviceDeleted;
    }

    static async deleteSpecifiedDeviceSession(token :string) {

        const payload: RefreshToken| null  = jwtService.getPayloadFromToken(token)

        const isDeviceDeleted = await SecurityRepo.deleteSpecifiedDeviceToken(payload?.userId, payload?.deviceId);

        return isDeviceDeleted;
    }
}

