import mongoose from 'mongoose';
import {SessionDBType} from "../types/token/output";

const sessionSchema = new mongoose.Schema<SessionDBType>({
    userId: { type: String, required: true },
    deviceId: { type: String, required: true },
    ip: { type: String, required: true },
    title: { type: String, required: true },
    iatDate: { type: String, required: true },
    expDate: { type: String, required: true }
});

export const SessionModel = mongoose.model('Session', sessionSchema);
