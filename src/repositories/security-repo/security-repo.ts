import {ipUrlType} from "../../types/security/output";
import {InsertOneResult} from "mongodb";
import {SessionModel} from "../../models/security";
import {RequestModel} from "../../models/request";


export class SecurityRepo {
    static async deleteDeviceToken(userId: string | undefined, deviceId: string) {

        const result = await SessionModel.deleteOne({userId, deviceId});

        return result.deletedCount > 0;

    }

    static async deleteSpecifiedDeviceToken(userId: string | undefined, deviceId: string | undefined) {

        const result = await SessionModel.deleteMany({userId: userId, deviceId: {$ne: deviceId}});
        return result.deletedCount > 0;

    }

    static async insertRequestFromUser(requestUser: ipUrlType) {
//TODO type
        const res: any= await RequestModel.create(requestUser)
        return res._id.toString();
    }

    static async countRequests(ip: string, url: string, fromDate: Date) {
        const count = await RequestModel.countDocuments({
            ip,
            url,
            date: {$gte: fromDate}
        });
        return count;
    }


}
