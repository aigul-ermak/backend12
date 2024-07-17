import {SessionDBType} from "../../types/token/output";
import {SessionModel} from "../../models/security";
import {BlogModel} from "../../models/blog";
import {UserDBType} from "../../types/user/output";
import bcrypt from "bcrypt";


export class QuerySecurityRepo {
    static async putSessionToList(session: SessionDBType) {
        const res = await SessionModel.create(session);
        return res._id.toString();
    }

    static async updateSessionToList(userId: string, deviceId: string, iatDate: string, expDate: string) {
        const filter = {userId: userId, deviceId: deviceId};
        const updateDoc = {
            $set: {
                iatDate: iatDate,
                expDate: expDate
            }
        };
        const result = await SessionModel.updateOne(filter, updateDoc);
        return result;
    }

    static async deleteSessionFromList(id: string | undefined, deviceId: string | undefined) {
        const userId: string | undefined = await id;
        const result = await SessionModel.deleteOne({userId, deviceId});

        return result.deletedCount > 0;
    }

    static async checkTokenInList(refreshToken: string) {
        const token = await SessionModel.findOne({refreshToken})
        return token;
    }

    static async checkRefreshTokenInList(id: string, deviceId: string) {
        const token: SessionDBType | null = await SessionModel.findOne({userId: id, deviceId: deviceId})
        return token;
    }

    static async findSessionByDeviceId(deviceId: string) {
        const session: SessionDBType | null = await SessionModel.findOne({deviceId})
        return session;
    }
}
