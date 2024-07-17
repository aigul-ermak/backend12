import mongoose, {Schema} from 'mongoose';
import {ipUrlType} from "../types/security/output";


const requestSchema: Schema = new mongoose.Schema<ipUrlType>({
    ip: { type: String, required: true },
    url: { type: String, required: true },
    date: { type: Date, required: true }
});
export const RequestModel = mongoose.model('Request', requestSchema);

